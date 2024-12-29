/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry();
const geometry = new THREE.PlaneGeometry(20, 10);
// const geometry = new THREE.SphereGeometry();
// const geometry = new THREE.TorusGeometry(10, 3, 200, 20);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 30;

let i = 0;
function animate() {
  requestAnimationFrame(animate);
  // console.log(i++);
  // cube.rotation.x = cube.rotation.x + 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
