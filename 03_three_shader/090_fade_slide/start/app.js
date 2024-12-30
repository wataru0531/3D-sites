/**
 * Three.js
 * https://threejs.org/
 */

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  TextureLoader,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
  ShaderMaterial,
  Vector2,
  Mesh,
} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";

init();
async function init() {
  // scene
  const scene = new Scene();
  // camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 30;
  
  // renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);
  
  // geometry
  const geometry = new PlaneGeometry(20, 10);

  // material
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    texture.wrapS = ClampToEdgeWrapping; // デフォルト(最後の色情報を継続して使う)
    texture.wrapT = MirroredRepeatWrapping; // 反転

    return texture;
  }

  const material = new ShaderMaterial({
    uniforms: {
      uTexCurrent: { value: await loadTex("/img/output1.jpg") },
      uTexNext: { value: await loadTex("/img/output2.jpg") },

      uProgress: { value: 0 },
      uTick: { value: 0 },
      uNoiseScale: { value: new Vector2(10, 10) },

    },
    vertexShader,
    fragmentShader,
  });

  // mesh
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  // lil-gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Noise");
  // folder1.close();

  folder1.add(material.uniforms.uNoiseScale.value, "x", 0, 100, 0.01);
  folder1.add(material.uniforms.uNoiseScale.value, "y", 0, 100, 0.01);
  folder1.add(material.uniforms.uProgress, "value", 0, 1, 0.01).name("uProgress");

  // animate
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);
  
    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;
    material.uniforms.uTick.value++;

    // renderer
    renderer.render(scene, camera);
  }
  
  animate();
}
