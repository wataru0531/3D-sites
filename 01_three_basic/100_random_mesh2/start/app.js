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

  function mapRand(min, max, isInt = false) {
    let rand = Math.random() * (max - min) + min;
    rand = isInt ? Math.round(rand) : rand;
    return rand;
  }

  
  function randomMesh() {
    const geometries = [
      new THREE.BoxGeometry(10, 10, 10),
      new THREE.PlaneGeometry(20, 20),
      new THREE.TorusGeometry(10, 3, 200, 20)
    ];
    const color = new THREE.Color(
      mapRand(0.7, 1),
      mapRand(0.7, 1),
      mapRand(0.7, 1)
      );
    const material = new THREE.MeshBasicMaterial({ color });
    const gIndex = mapRand(0, geometries.length - 1, true);
    const mesh = new THREE.Mesh(geometries[gIndex], material);
    return mesh;
  }

  const mesh1 = randomMesh();
  
  scene.add(mesh1);

  const axis = new THREE.AxesHelper(20);
  scene.add(axis);

  camera.position.z = 30;

  const control = new OrbitControls(camera, renderer.domElement);
    
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);

    // 回転
    // mesh1.rotation.x += 0.01;
    // mesh1.rotation.y += 0.01;
    // mesh2.rotation.z += 0.01;
    // mesh3.rotation.y += 0.01;
    // mesh.rotateX(0.01);

    // 平行移動
    // mesh.position.x += 0.02;
    // mesh.position.y += 0.02;
    // mesh.position.z += 0.02;
    // mesh.position.set(10, 0, 0);
    // geometry.translate(0.01,0.01,0.01);

    // スケール
    // mesh.scale.x += 0.002;
    // mesh.scale.y += 0.002;
    // geometry.scale(1.02, 1, 1);
    control.update();

    renderer.render(scene, camera);
  }

  animate();
}
