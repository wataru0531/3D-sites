/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
init();
async function init() {
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
  //  const geometry = new THREE.PlaneGeometry(32, 18);
  // const geometry = new THREE.SphereGeometry();
  const geometry = new THREE.TorusGeometry(10, 3, 200, 20);
  const texLoader = new THREE.TextureLoader();
  const texture2 = await texLoader.loadAsync("/img/output2.jpg");
  const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  const control = new OrbitControls(camera, renderer.domElement);
  camera.position.z = 30;

  let i = 0;
  function animate() {
    requestAnimationFrame(animate);

    control.update();
    // console.log(i++);
    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}
