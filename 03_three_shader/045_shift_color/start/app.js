/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  TextureLoader,
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  RepeatWrapping,
  MirroredRepeatWrapping,
  ClampToEdgeWrapping,

} from "three";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

init();
async function init() {
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);
  
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    // wrapS、wrapTのS、Tについて
    // → グラフィックスやコンピュータグラフィックスの文脈で使用される用語、
    //   具体的には、テクスチャ座標系での軸のラベルのことを指す 

    //  テクスチャを横軸に繰り返す。S...x軸、水平を表す
    texture.wrapS = RepeatWrapping; // 横軸に繰り返す
    // texture.wrapS = MirroredRepeatWrapping; // 反転
    // texture.wrapS = ClampToEdgeWrapping; // デフォルト(最後の色情報を継続して使う)

    // テクスチャを縦軸に繰り返す。T...y軸、垂直
    texture.wrapT = RepeatWrapping;

    return texture;
  }

  // geometry
  const geometry = new PlaneGeometry(20, 10);
  console.log(geometry);
  
  // materia/
  const material = new ShaderMaterial({
    uniforms: {
      uTex: { value: await loadTex('/img/output2.jpg') },
      uTick: { value: 0 }
    },
    vertexShader,
    fragmentShader,
  });
  const cube = new Mesh(geometry, material);
  scene.add(cube);
  
  camera.position.z = 30;
  
  let i = 0;
  function animate() {
    requestAnimationFrame(animate);
  
    // cube.rotation.x = cube.rotation.x + 0.01;
    // cube.rotation.y += 0.01;
    material.uniforms.uTick.value++;

    renderer.render(scene, camera);
  }
  
  animate();
}
