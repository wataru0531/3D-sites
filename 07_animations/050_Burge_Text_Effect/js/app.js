
/**************************************************************

THREE JS: image RGB Split / Distortion On Scroll
https://www.youtube.com/watch?v=DdQn82X1G3I&t=39s

// GSAPライブラリ
https://cdnjs.com/libraries/gsap

gsap easings  https://gsap.com/docs/v3/Eases/

***************************************************************/
// "数値" 指定時間後にトゥイーン。タイムラインの先頭からの時間（秒）で開始
// "+=1"  直前のトゥイーンの終了後に何秒だけ離すか delay: 1 と同じ
// "-=1"  直前のトゥイーンの終了に何秒だけ重ねるか delay: -1　と同じ

// ">"    直前のトゥイーンの終了時
// ">3"   直前のトゥイーンの終了後に何秒だけ離すか。3秒後にトゥイーンする
// "<"    直前のトゥイーンの開始時
// "<4"   直前のトゥイーンの開始時の何秒後か。4秒後にトゥイーン

// "ラベル名"  指定したラベルと同じタイミングでトゥイーン
// "ラベル名 += 数値"
// "ラベル名 -= 数値"

// stagger... each   ... デフォルト、1つ１つの要素に効く
//            amount ... 全体で何秒か

// Custom ease の使用例
// gsap.registerPlugin(CustomEase)
// CustomEase.create(
//   "hop",
//   "M0,0 C0,0 0.056,0.442 0.175,0.442 0.294,0.442 0.332,0 0.332,0 0.332,0 0.414,1 0.671,1 0.991,1 1,0 1,0"
// );

// //now you can reference the ease by ID (as a string):
// gsap.to(element, { duration: 1, y: -100, ease: "hop" });

// LenisとScrollTriggerの更新を連動させる仕組みを構築 ///////////////////
// 慣性スクロール
// const lenis = new Lenis()

// ScrollTriggerがページのスクロール位置に応じて適切に更新
// lenis.on('scroll', ScrollTrigger.update)

// GSAPのtickerにカスタムアニメーションループを追加毎フレーム自動的に発火
//   Lenisのスムーズスクロールの更新がGSAPのアニメーションフレームと一致し、全体の動作がスムーズかつ一貫性のあるものになる
// gsap.ticker.add((time)=>{   // lenis.raf() → Lenisのスクロールアニメーションを更新
//   // console.log(time)
//   lenis.raf(time * 1000)
// });

// GSAPのtickerは通常、パフォーマンスのために遅延補正(ラグスムージング)を行うが、遅延補正を無効にしている
// これにより、LenisとGSAPのアニメーションがより正確に同期する
// gsap.ticker.lagSmoothing(0)
///////////////////////////////

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  PlaneGeometry,
  ShaderMaterial,
  CanvasTexture,
  Vector2,
  Mesh,
  PointLight,
  PointLightHelper,
  AxesHelper,
  MathUtils

  // html2canvas,

} from "three";

import html2canvas from 'html2canvas';
import GUI from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import vertexShader from "./shaders/vertex.glsl";
// console.log(vertexShader)
import fragmentShader from "./shaders/fragment.glsl";
import {  utils } from "./utils.js";


init();

async function init() {
  const canvas = document.getElementById("js-canvas");
  
  const scene = new Scene();
  // scene.background = "red";

  const camera = new PerspectiveCamera(
    55, 
    window.innerWidth / window.innerHeight, 
    .1, 
    1000
  );
  camera.position.z = 700;

  const renderer = new WebGLRenderer({ 
    canvas: canvas,
    antialias: true, 
    preserveDrawingBuffer: true ,
    // precision: , // 
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setClearColor(0x000000, 0);
  
  const control = new OrbitControls(camera, renderer.domElement);

  // html2canvasでDOMをキャプチャ
  const domElement = document.querySelector('.dom-element');
  // let texture = await domToCanvasTexture(domElement);
  let texture = await captureDomAsTexture(domElement);

  // シェーダー材質の設定
  const material = new ShaderMaterial({
    uniforms: {
      uTexture: { value: texture },
      uMouse: { value: new Vector2(0, 0) }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // transparent: true,
    // flatShading: true,
  });
  // console.log(material)


  // 平面ジオメトリの作成
  const geometry = new PlaneGeometry(window.innerWidth, window.innerHeight, 200, 100);
  const plane = new Mesh(geometry, material);
  // plane.position.set(100, 100, 100);
  scene.add(plane);

  // ライト、ヘルパー
  const pLight = new PointLight("#ffffff", 30, 12, 1);
  // pLight.position.set(20, 40, 60);
  const pLightHelper = new PointLightHelper(pLight, 10);
  const axesHelper = new AxesHelper(100);

  scene.add(pLight, pLightHelper, axesHelper);

  // ヘルパー

  // ウィンドウサイズが変更された際の処理
  window.addEventListener('resize', () => {
    // console.log("resize running!!");
    onWindowResize();
  });

  document.addEventListener('mousemove', ({ clientX, clientY }) => {
    // console.log("pointermove running!!");
    onMouseMove({ clientX, clientY });
  });


  // ウィンドウリサイズ対応
  async function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    texture = await captureDomAsTexture(domElement);
    material.uniforms.uTexture.value = texture;
  }

  // マウス移動のイベント処理
  const mouseLerped = { x: 0, y: 0 };
  function onMouseMove({ clientX, clientY }) {
    // console.log("onMouseMove running!!");
    const mouseX = (clientX / window.innerWidth) * 2 - 1;
    const mouseY = -(clientY / window.innerHeight) * 2 + 1;
    // console.log(`x: ${mouseX}, y:${mouseY}`);

    mouseLerped.x = utils.lerp(mouseLerped.x, mouseX, 0.05);
    mouseLerped.y = utils.lerp(mouseLerped.y, mouseY, 0.05);
    // console.log(mouseLerped.x, mouseLerped.y);
    
    // material.uniforms.uMouse.value.x = mouseLerped.x;
    // material.uniforms.uMouse.value.y = mouseLerped.y;
    // console.log(material.uniforms.uMouse.value.x)
  }

  // アニメーションの更新
  function animate() {
    // console.log("animate running!!");
    requestAnimationFrame(animate);

    material.uniforms.uMouse.value.x = mouseLerped.x;
    material.uniforms.uMouse.value.y = mouseLerped.y;
    // console.log(`x: ${material.uniforms.uMouse.value.x}, ${material.uniforms.uMouse.value.y}`)

    control.update();

    renderer.render(scene, camera);
  }
  animate();
  

  // DOMをCanvasテクスチャに変換
  async function captureDomAsTexture(domEl) {
    const canvas = await html2canvas(domEl, { backgroundColor: null });
    return new CanvasTexture(canvas);
  }

}
