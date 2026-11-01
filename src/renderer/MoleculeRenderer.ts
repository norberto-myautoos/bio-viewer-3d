import * as THREE from 'three';
import type { Atom } from '../parser/PdbParser';

export type ColorMode = 'confidence' | 'element' | 'residue' | 'chain';

const ELEMENT_COLORS: Record<string, number> = {
  C: 0x909090, N: 0x3050f8, O: 0xff0d0d, S: 0xffff30, H: 0xffffff, P: 0xffa500,
};
const RADII: Record<string, number> = { H: 0.25, C: 0.4, N: 0.38, O: 0.37, S: 0.5, P: 0.5 };
const CHAIN_PALETTE = [0x38bdf8, 0xf472b6, 0xa3e635, 0xfbbf24, 0xa78bfa, 0xfb923c, 0x2dd4bf, 0xf87171];

function plddtColor(v: number): number {
  if (v > 90) return 0x0053d6;
  if (v > 70) return 0x65cbf3;
  if (v > 50) return 0xffdb13;
  return 0xff7d45;
}

function residueColor(res: string): number {
  if (['ARG', 'LYS', 'HIS'].includes(res)) return 0x145afc;
  if (['ASP', 'GLU'].includes(res)) return 0xe60a0a;
  if (['SER', 'THR', 'ASN', 'GLN'].includes(res)) return 0x00e000;
  if (['ALA', 'VAL', 'LEU', 'ILE', 'MET', 'PHE', 'TRP', 'PRO'].includes(res)) return 0xb3b3b3;
  return 0xe6c84b;
}

export class MoleculeRenderer {
  private group = new THREE.Group();
  private atomMesh: THREE.InstancedMesh | null = null;
  private backbone = new THREE.Group();
  private atoms: Atom[] = [];
  private chainIndex = new Map<string, number>();
  private bMin = 0;
  private bMax = 1;
  /** Radio de la esfera que contiene la estructura (ya centrada en el origen). */
  radius = 10;

  constructor(scene: THREE.Scene) {
    this.group.add(this.backbone);
    scene.add(this.group);
  }

  load(atoms: Atom[], mode: ColorMode, predicted: boolean): void {
    this.clear();
    this.atoms = atoms;
    if (atoms.length === 0) return;

    let cx = 0, cy = 0, cz = 0;
    this.bMin = Infinity; this.bMax = -Infinity;
    for (const a of atoms) {
      cx += a.x; cy += a.y; cz += a.z;
      this.bMin = Math.min(this.bMin, a.bFactor);
      this.bMax = Math.max(this.bMax, a.bFactor);
      if (!this.chainIndex.has(a.chain)) this.chainIndex.set(a.chain, this.chainIndex.size);
    }
    cx /= atoms.length; cy /= atoms.length; cz /= atoms.length;

    const geometry = new THREE.SphereGeometry(1, 12, 8);
    const material = new THREE.MeshStandardMaterial({ roughness: 0.4, metalness: 0.1 });
    const mesh = new THREE.InstancedMesh(geometry, material, atoms.length);
    mesh.frustumCulled = false;
    const dummy = new THREE.Object3D();
    let r2 = 0;
    atoms.forEach((a, i) => {
      a.x -= cx; a.y -= cy; a.z -= cz;
      r2 = Math.max(r2, a.x * a.x + a.y * a.y + a.z * a.z);
      dummy.position.set(a.x, a.y, a.z);
      dummy.scale.setScalar(RADII[a.element] ?? 0.4);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
    this.atomMesh = mesh;
    this.group.add(mesh);
    this.radius = Math.sqrt(r2) + 2;

    this.recolor(mode, predicted);
    this.buildBackbone();
  }

  /** Cambia el color sin reconstruir geometría. */
  recolor(mode: ColorMode, predicted: boolean): void {
    if (!this.atomMesh) return;
    const color = new THREE.Color();
    const span = this.bMax - this.bMin || 1;
    this.atoms.forEach((a, i) => {
      switch (mode) {
        case 'confidence':
          if (predicted) color.setHex(plddtColor(a.bFactor));
          else color.setHSL(0.66 * (1 - (a.bFactor - this.bMin) / span), 0.9, 0.5);
          break;
        case 'element': color.setHex(ELEMENT_COLORS[a.element] ?? 0xffc0cb); break;
        case 'residue': color.setHex(residueColor(a.resName)); break;
        case 'chain': color.setHex(CHAIN_PALETTE[(this.chainIndex.get(a.chain) ?? 0) % CHAIN_PALETTE.length]); break;
      }
      this.atomMesh!.setColorAt(i, color);
    });
    if (this.atomMesh.instanceColor) this.atomMesh.instanceColor.needsUpdate = true;
  }

  setAtomsVisible(v: boolean): void { if (this.atomMesh) this.atomMesh.visible = v; }
  setBackboneVisible(v: boolean): void { this.backbone.visible = v; }

  /** Un tubo por segmento continuo de CA, separado por cadena (no une cadenas ni huecos). */
  private buildBackbone(): void {
    const chains = new Map<string, Atom[]>();
    for (const a of this.atoms) {
      if (a.name !== 'CA' || a.isHet) continue;
      if (!chains.has(a.chain)) chains.set(a.chain, []);
      chains.get(a.chain)!.push(a);
    }
    for (const [chain, cas] of chains) {
      const material = new THREE.MeshStandardMaterial({
        color: CHAIN_PALETTE[(this.chainIndex.get(chain) ?? 0) % CHAIN_PALETTE.length],
        roughness: 0.4,
      });
      let seg: THREE.Vector3[] = [];
      const flush = () => {
        if (seg.length >= 4) {
          const curve = new THREE.CatmullRomCurve3(seg);
          this.backbone.add(new THREE.Mesh(new THREE.TubeGeometry(curve, seg.length * 4, 0.22, 6, false), material));
        }
        seg = [];
      };
      cas.forEach((a, i) => {
        const p = new THREE.Vector3(a.x, a.y, a.z);
        if (i > 0 && p.distanceTo(seg[seg.length - 1] ?? p) > 4.5) flush();
        seg.push(p);
      });
      flush();
    }
  }

  private clear(): void {
    if (this.atomMesh) {
      this.group.remove(this.atomMesh);
      this.atomMesh.geometry.dispose();
      (this.atomMesh.material as THREE.Material).dispose();
      this.atomMesh.dispose();
      this.atomMesh = null;
    }
    const mats = new Set<THREE.Material>();
    for (const child of [...this.backbone.children]) {
      const m = child as THREE.Mesh;
      m.geometry.dispose();
      mats.add(m.material as THREE.Material);
      this.backbone.remove(child);
    }
    mats.forEach((m) => m.dispose());
    this.chainIndex.clear();
  }
}
