/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { Mesh } from "three";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

class Ripple {
  constructor(tex) {
    const ripple = { width: 100, height: 100 };
    this.geo = new THREE.PlaneGeometry(ripple.width, ripple.height);
    this.material = new THREE.MeshBasicMaterial({ transparent: 1, map: tex });
    this.mesh = new THREE.Mesh(this.geo, this.material);
    this.mesh.visible = false;
    this.isUsed = false;
  }

  start(mouse) {
    const { material, mesh } = this;

    this.isUsed = true;
    mesh.visible = true;
    mesh.position.x = mouse.x;
    mesh.position.y = mouse.y;
    mesh.scale.x = mesh.scale.y = 0.2;
    material.opacity = 0.8;
    mesh.rotation.z = 2 * Math.PI * Math.random();
    this.animate();
  }

  animate() {
    const { mesh, material } = this;
    mesh.scale.y = mesh.scale.x = mesh.scale.x + 0.07;
    material.opacity *= 0.96;
    mesh.rotation.z += 0.003;

    if(material.opacity <= 0.01) {
      // ループ終了
      this.isUsed = false;
      mesh.visible = false;
    } else {
      requestAnimationFrame(() => {
        this.animate();
      });
    }
  }
}

(async () => {
  const scene = new THREE.Scene();

  const camera = new THREE.OrthographicCamera(
    -window.innerWidth / 2,
    window.innerWidth / 2,
    window.innerHeight / 2,
    -window.innerHeight / 2,
    -window.innerHeight,
    window.innerHeight
  );

  camera.position.z = 10;

  const renderer = new THREE.WebGLRenderer({ antialias: true });

  renderer.setSize(window.innerWidth, window.innerHeight);

  document.body.appendChild(renderer.domElement);

  const rippleCount = 50;
  const texLoader = new THREE.TextureLoader();
  const tex = await texLoader.loadAsync("/img/displacement/ripple.png");
  const ripples = [];
  for (let i = 0; i < rippleCount; i++) {
    const ripple = new Ripple(tex);
    scene.add(ripple.mesh);
    ripples.push(ripple);
  }

  const mouse = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    tick: 0,
  };

  renderer.domElement.addEventListener("mousemove", (event) => {
    console.log(event.clientX, event.clientY);
    mouse.x = event.clientX - window.innerWidth / 2;
    mouse.y = -event.clientY + window.innerHeight / 2;

    if (mouse.tick % 5 === 0) {
      const _ripple = ripples.find((ripple) => !ripple.isUsed);

      if (!_ripple) return;

      _ripple.start(mouse);
    }
  });

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    mouse.tick++;
  }

  animate();
})();
