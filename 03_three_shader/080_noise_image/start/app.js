/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  ClampToEdgeWrapping,
  MirroredRepeatWrapping,
  ShaderMaterial,
  Vector2,
  Mesh,
  TextureLoader,
  
} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

import GUI from "lil-gui";

init();
async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  // renderer...sceneとcameraをブラウザに映し出す
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);

  // geometry
  const geometry = new PlaneGeometry(20, 10);
  console.log(geometry);

  // material
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    texture.wrapS = ClampToEdgeWrapping;
    texture.wrapT = MirroredRepeatWrapping;

    return texture;
  }
  
  const material = new ShaderMaterial({
    uniforms: {
      uTex: { value: await loadTex("/img/output2.jpg") },
      uTick: { value: 0 },

      // ノイズ...xに広がるノイズ、yに拡がるノイズ
      uNoiseScale: { value: new Vector2(10, 10) }, // 2次元ベクトルを生成
    },
    vertexShader,
    fragmentShader,
  });

  console.log(material.uniforms.uNoiseScale.value)

  // mesh
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 30;

  // gui  lil-gui使用
  const gui = new GUI();
  const folder1 = gui.addFolder("Noise");
  // folder1.close();

  folder1.add(material.uniforms.uNoiseScale.value, "x", 0, 100, 0.01);
  folder1.add(material.uniforms.uNoiseScale.value, "y", 0, 100, 0.01);


  // animation
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
