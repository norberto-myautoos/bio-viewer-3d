import * as THREE from 'three';
import type { Atom, SS } from '../parser/PdbParser';

const M = 10; // vértices por sección
const S = 6;  // muestras por aminoácido

const dist = (a: Atom, b: Atom) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);

function prune(s: SS[]): SS[] {
  let i = 0;
  while (i < s.length) {
    let j = i;
    while (j < s.length && s[j] === s[i]) j++;
    const min = s[i] === 'H' ? 4 : s[i] === 'E' ? 3 : 0;
    if (s[i] !== 'C' && j - i < min) for (let k = i; k < j; k++) s[k] = 'C';
    i = j;
  }
  return s;
}

/** Estimación aproximada desde geometría de CA (no es DSSP completo). */
function geoSS(p: THREE.Vector3[]): SS[] {
  const n = p.length;
  const s: SS[] = new Array<SS>(n).fill('C');
  const d = (i: number, j: number) => p[i].distanceTo(p[j]);
  for (let i = 0; i + 4 < n; i++) {
    if (d(i, i + 3) > 4.5 && d(i, i + 3) < 5.8 && d(i, i + 4) > 5.8 && d(i, i + 4) < 6.8)
      for (let k = i; k <= i + 4; k++) s[k] = 'H';
  }
  for (let i = 0; i + 3 < n; i++) {
    if (d(i, i + 2) > 6.0 && d(i, i + 3) > 8.8)
      for (let k = i; k <= i + 3; k++) if (s[k] !== 'H') s[k] = 'E';
  }
  return prune(s);
}

const SIZE = (s: SS): [number, number] => (s === 'H' ? [1.0, 0.22] : s === 'E' ? [0.9, 0.2] : [0.22, 0.22]);

export class Ribbon {
  readonly mesh: THREE.Mesh;
  readonly ssByResidue = new Map<string, SS>();
  private rings: { atom: Atom; ss: SS }[] = [];

  constructor(atoms: Atom[], sec: Map<string, SS>) {
    type R = { ca?: Atom; o?: Atom };
    const res = new Map<string, R>();
    for (const a of atoms) {
      if (a.isHet || (a.name !== 'CA' && a.name !== 'O')) continue;
      const k = `${a.chain}|${a.resSeq}`;
      const r = res.get(k) ?? {};
      if (a.name === 'CA') r.ca = a; else r.o = a;
      res.set(k, r);
    }
    const segs: { ca: Atom; o?: Atom }[][] = [];
    let cur: { ca: Atom; o?: Atom }[] = [];
    for (const r of res.values()) {
      if (!r.ca) continue;
      const prev = cur[cur.length - 1];
      if (prev && (prev.ca.chain !== r.ca.chain || dist(prev.ca, r.ca) > 4.5)) { segs.push(cur); cur = []; }
      cur.push({ ca: r.ca, o: r.o });
    }
    if (cur.length) segs.push(cur);

    const pos: number[] = [];
    const idx: number[] = [];
    for (const seg of segs) {
      const n = seg.length;
      const P = seg.map((r) => new THREE.Vector3(r.ca.x, r.ca.y, r.ca.z));
      const ss = sec.size > 0
        ? seg.map((r) => sec.get(`${r.ca.chain}|${r.ca.resSeq}`) ?? 'C')
        : geoSS(P);
      seg.forEach((r, i) => this.ssByResidue.set(`${r.ca.chain}|${r.ca.resSeq}`, ss[i]));
      if (n < 4) continue;

      // Vectores guía (C=O) con signo consistente y suavizados
      const G: THREE.Vector3[] = [];
      seg.forEach((r, i) => {
        const g = r.o ? new THREE.Vector3(r.o.x - r.ca.x, r.o.y - r.ca.y, r.o.z - r.ca.z)
                      : (G[i - 1]?.clone() ?? new THREE.Vector3(0, 1, 0));
        g.normalize();
        if (i > 0 && g.dot(G[i - 1]) < 0) g.negate();
        G.push(g);
      });
      const Gs = G.map((_, i) => {
        const v = G[i].clone().multiplyScalar(2);
        if (i > 0) v.add(G[i - 1]);
        if (i < n - 1) v.add(G[i + 1]);
        return v.normalize();
      });

      const curve = new THREE.CatmullRomCurve3(P, false, 'centripetal');
      const N = (n - 1) * S + 1;
      const base = this.rings.length;
      for (let k = 0; k < N; k++) {
        const u = k / (N - 1);
        const p = curve.getPoint(u);
        const T = curve.getTangent(u);
        const f = k / S;
        const i = Math.min(Math.floor(f), n - 2);
        const fr = f - i;
        const g = Gs[i].clone().lerp(Gs[i + 1], fr);
        const W = g.sub(T.clone().multiplyScalar(g.dot(T))).normalize();
        if (W.lengthSq() < 1e-8) W.set(-T.y, T.x, 0.001).normalize();
        const Nn = new THREE.Vector3().crossVectors(T, W).normalize();

        const a = SIZE(ss[i]), b = SIZE(ss[i + 1]);
        let w = a[0] + (b[0] - a[0]) * fr;
        let t = a[1] + (b[1] - a[1]) * fr;
        if (ss[i] === 'E' && ss[i + 1] !== 'E') { w = 1.5 - 1.45 * fr; t = 0.2; } // punta de flecha

        for (let m = 0; m < M; m++) {
          const ang = (2 * Math.PI * m) / M;
          const v = p.clone().addScaledVector(W, Math.cos(ang) * w).addScaledVector(Nn, Math.sin(ang) * t);
          pos.push(v.x, v.y, v.z);
        }
        const near = Math.min(n - 1, Math.round(f));
        this.rings.push({ atom: seg[near].ca, ss: ss[near] });
      }
      for (let k = 0; k < N - 1; k++) {
        for (let m = 0; m < M; m++) {
          const a = (base + k) * M + m, b = (base + k) * M + ((m + 1) % M);
          const c = (base + k + 1) * M + m, d = (base + k + 1) * M + ((m + 1) % M);
          idx.push(a, c, b, b, c, d);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.Float32BufferAttribute(new Array<number>(pos.length).fill(1), 3));
    geo.setIndex(idx);
    geo.computeVertexNormals();
    this.mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      vertexColors: true, roughness: 0.45, metalness: 0.05, side: THREE.DoubleSide,
    }));
    this.mesh.frustumCulled = false;
  }

  paint(fn: (a: Atom, ss: SS) => number): void {
    const col = this.mesh.geometry.getAttribute('color') as THREE.BufferAttribute;
    const c = new THREE.Color();
    this.rings.forEach((r, i) => {
      c.setHex(fn(r.atom, r.ss));
      for (let m = 0; m < M; m++) col.setXYZ(i * M + m, c.r, c.g, c.b);
    });
    col.needsUpdate = true;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    (this.mesh.material as THREE.Material).dispose();
  }
} 