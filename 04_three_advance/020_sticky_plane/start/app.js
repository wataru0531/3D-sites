/**
 * Three.js
 * https://threejs.org/
 */
import {
  Scene, 
  WebGLRenderer,
  PerspectiveCamera,
  PlaneGeometry,
  Float32BufferAttribute,
  TextureLoader,
  ShaderMaterial,
  Mesh,

} from "three";
import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import { gsap } from "gsap";

init();
async function init() {
  // scene
  const scene = new Scene();

  // camera
  const camera = new PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    10,
    3000
  );

  camera.position.z = 1000;

  // renderer
  const renderer = new WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setClearColor(0xffffff);
  document.body.appendChild(renderer.domElement);
  // console.log(renderer.domElement)

  // OrbitControls...カメラに適用
  const control = new OrbitControls(camera, renderer.domElement);

  // geometry
  // 遅延時間を持った頂点を格納
  function setupGeometry(){
    const wSeg = 10; // Y軸の頂点の数 →　y軸の頂点は3つとなる
    const hSeg = 10; // X軸の頂点の数 → 同様

    const geometry = new PlaneGeometry(600, 300, wSeg, hSeg);

    const delayVertices = []; // 遅延時間を持った頂点の配列
    const maxCount = (wSeg + 1) * (hSeg + 1); // 頂点の総数

    for(let i = 0; i < maxCount; i++){
      // 遅延時間を、0 〜 1 で格納
      // 1に対するmaxCount(ここでは9)の割合を算出 → 必ず0から1の少数となる
      const delayDuration = ( 1 / maxCount ) * i;
      delayVertices.push(delayDuration);
    };
    
    // console.log(delayVertices); // (9) [0, 0.1111111111111111, 0.2222222222222222, 0.3333333333333333, 0.4444444444444444, 0.5555555555555556, 0.6666666666666666, 0.7777777777777777, 0.8888888888888888]

    // geometryの頂点に追加
    // Float32BufferAttribute
    // → WebGLバッファに対して32ビット浮動小数点数の属性データを効率的に管理するために使われる。
    //   WebGLバッファはGPU上にある。
    //   このようにCPUで頂点を作る → GPUに送り込んで(コピーする)リアルタイムレンダリングを実現される
    // 第２引数 ... count(頂点の数)、itemSize... (x, y, z)のことなど。
    //             ここでは各頂点には1つの値でいいので、1 となる。3次元の成分は持たない
    geometry.setAttribute("aDelay", new Float32BufferAttribute(delayVertices, 1));

    return geometry;
  };

  const geometry = setupGeometry();
  window.geometry = geometry;

  console.log(geometry);
  // console.log(window, window.geometry)

  // material
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    return texture;
  };

  const material = new ShaderMaterial({
    uniforms: {
      uTex: { value: await loadTex("/img/output1.jpg") },
      uTick: { value: 0 },
      uProgress: { value: 0 },
    },
    vertexShader,
    fragmentShader,

    wireframe: true,
  });

  // mesh
  const plane = new Mesh(geometry, material);
  scene.add(plane);

  // lil-gui
  const gui = new GUI();
  const folder1 = gui.addFolder("Animation");
  // folder1.open();

  folder1.add(material.uniforms.uProgress, "value", 0, 1, 0.01).name("progress").listen();

  //  boolean に切り換え
  const datData = { 
    next: !!material.uniforms.uProgress.value,
  };

  folder1.add(datData, "next").onChange(() => {

    gsap.to(material.uniforms.uProgress, 1.5, {
      value: +datData.next,
      // + ... 単項プラス演算子（unary plus operator）
      //       真偽値や文字列を数値に変換する
      //       ここでは、trueは数値の1に変換される
      //       falseは数値の0に変換される
      ease: "power3.inOut",
    });
  });

  // animate
  function animate() {
    control.update();

    material.uniforms.uTick.value++;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();
}
