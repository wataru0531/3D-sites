/**
 * Three.js
 * https://threejs.org/
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import GUI from "lil-gui";
import Stats from "stats-js";

init();

function mapRand(min, max, isInt = false) {
  let rand = Math.random() * (max - min) + min;
  rand = isInt ? Math.round(rand) : rand;
  return rand;
}

async function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 90;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  // ライト
  const amLight = new THREE.AmbientLight(0x3f3f46);
  scene.add(amLight);

  const pLight = new THREE.PointLight(0xffffff, 1, 200);
  pLight.position.set(-26, 7, 100);
  scene.add(pLight);
  pLight.castShadow = true;
  pLight.shadow.mapSize.width = 1024;
  pLight.shadow.mapSize.height = 1024;

  const dLight = new THREE.DirectionalLight(0xaabbff, 0.2);
  dLight.position.set(0, 0, 1);
  scene.add(dLight);

  // メッシュ
  const X_NUM = 10,
    Y_NUM = 6,
    SCALE = 30,
    COLORS = { MAIN: "#f3f4f6", SUB: "#60a5fa" };

  const boxGeo = new THREE.BoxGeometry(SCALE, SCALE, SCALE);
  const mainMate = new THREE.MeshLambertMaterial({ color: COLORS.MAIN });
  const subMate = new THREE.MeshLambertMaterial({ color: COLORS.SUB });

  const boxes = [];
  for (let y = 0; y < Y_NUM; y++) {
    for (let x = 0; x < X_NUM; x++) {
      const material = Math.random() < 0.2 ? subMate : mainMate;
      const box = new THREE.Mesh(boxGeo, material);
      box.position.x = x * SCALE - (X_NUM * SCALE) / 2;
      box.position.y = y * SCALE - (Y_NUM * SCALE) / 2;
      box.position.z = mapRand(-10, 10);
      box.scale.set(0.98, 0.98, 0.98);
      box.castShadow = true;
      box.receiveShadow = true;
      boxes.push(box);
    }
  }
  scene.add(...boxes);

  const control = new OrbitControls(camera, renderer.domElement);

  // lil gui
  const gui = new GUI();
  const folder1 = gui.addFolder("PointLight");
  folder1.open();

  folder1.add(pLight.position, "x", -500, 500, 1);
  folder1.add(pLight.position, "y", -500, 500, 1);
  folder1.add(pLight.position, "z", -500, 500, 1);

  const folder2 = gui.addFolder("Color");
  folder2.open();
  folder2.addColor(COLORS, "MAIN").onChange(() => {
    mainMate.color.set(COLORS.MAIN);
  });
  folder2.addColor(COLORS, "SUB").onChange(() => {
    subMate.color.set(COLORS.SUB);
  });

  // stats
  const stats = new Stats();
  stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom);

  function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    control.update();

    renderer.render(scene, camera);

    stats.end();
  }

  animate();
}
