import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class SceneManager {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly controls: OrbitControls;
  private frameId = 0;

  constructor(containerId: string) {
    const container = document.getElementById(containerId)!;
    this.scene.background = new THREE.Color(0x0b0f19);
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    this.camera.position.set(0, 0, 50);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;

    this.scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 1.2);
    sun.position.set(10, 20, 15);
    this.scene.add(sun);

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /** Encuadra una esfera centrada en el origen. */
  fitToRadius(radius: number): void {
    const dist = (radius / Math.sin(THREE.MathUtils.degToRad(this.camera.fov / 2))) * 1.1;
    this.camera.position.set(0, 0, dist);
    this.camera.far = dist * 4;
    this.camera.updateProjectionMatrix();
    this.controls.target.set(0, 0, 0);
    this.controls.update();
  }

  /** Bucle de render; onFps recibe los FPS medidos cada segundo. */
  start(onFps?: (fps: number) => void): void {
    let frames = 0;
    let last = performance.now();
    const loop = (now: number) => {
      this.frameId = requestAnimationFrame(loop);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      frames++;
      if (now - last >= 1000) {
        onFps?.(Math.round((frames * 1000) / (now - last)));
        frames = 0;
        last = now;
      }
    };
    this.frameId = requestAnimationFrame(loop);
  }

  /** Exporta solo el lienzo 3D (sin interfaz) a PNG, por defecto al doble de resolución. */
  exportPNG(name = 'bioviewer.png', scale = 2): void {
    const w = window.innerWidth, h = window.innerHeight, pr = this.renderer.getPixelRatio();
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w * scale, h * scale, false);
    this.renderer.render(this.scene, this.camera);
    const url = this.renderer.domElement.toDataURL('image/png');
    this.renderer.setPixelRatio(pr);
    this.renderer.setSize(w, h);
    this.renderer.render(this.scene, this.camera);
    const a = document.createElement('a');
    a.download = name;
    a.href = url;
    a.click();
  }

  dispose(): void {
    cancelAnimationFrame(this.frameId);
    this.renderer.dispose();
  }
}