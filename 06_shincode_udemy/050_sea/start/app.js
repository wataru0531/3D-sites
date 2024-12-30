/**************************************************************

shincodeのudemy講座
https://www.udemy.com/course/threejs-beginner/learn/lecture/29874966?start=0#overview

***************************************************************/
import "./styles/style.css";


import {
  Scene,
  TextureLoader,
  PerspectiveCamera,
  WebGLRenderer,
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  DoubleSide,
  Vector2,
  Color,
  AxesHelper,
  Clock,
  Object3D,

} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "lil-gui";

import vertexShader from "./shaders/vertexShader.glsl";
import fragmentShader from "./shaders/fragmentShader.glsl";


init();
async function init(){
  // サイズ
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Canvas
  const canvas = document.querySelector(".webgl");

  // Scene
  const scene = new Scene();

  // Camera
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, 0.23, 0);
  // camera.position.set(0, 0, 1)

  // レンダラー
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Textures
  const loadTex = async (_url) => {
    const textureLoader = new TextureLoader();
    const texture = await textureLoader.loadAsync(_url);

    return texture;
  }

  const BACKGROUND_URL = "/img/shincode/textures/sky/sky.jpg";
  // scene.background = await loadTex(BACKGROUND_URL);

  // Geometry
  // セグメントは2の累乗で
  const geometry = new PlaneGeometry(8, 8, 128, 128);
  console.log(geometry)

  // カラー
  const colorObject = {
    depthColor: "#2d81ae",   // 深い部分の色
    surfaceColor: "#66c1f9", // 表面の色
  };

  // マテリアル
  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    // wireframe: true,
    side: DoubleSide,
    
    uniforms: { 
      uWaveLength: { value: 0.38 }, // 振幅
      uFrequency: { value: new Vector2(6.6, 3.5) }, // 周波数
      uTime: { value: 0 },
      uWaveSpeed: { value: 0.75 },
      uDepthColor: { value: new Color(colorObject.depthColor) },
      uSurfaceColor: { value: new Color(colorObject.surfaceColor) },
      uColorOffset: { value: 0.03 },    // 
      uColorMultiplier: { value: 9.0 }, // 色に対してかける数値
      uSmallWaveElevation: { value: 0.15 }, // 波の振幅
      uSmallWaveFrequency: { value: 3.0 },  // 
      uSmallWaveSpeed: { value: .2 },       // 

      // uTick: { value: 0 },
    }
  });

  // メッシュ化
  const mesh = new Mesh(geometry, material);
  mesh.rotation.x = - Math.PI / 2;
  scene.add(mesh);

  // デバック
  const gui = new dat.GUI({ width: 300 });
  gui.add(material.uniforms.uWaveLength, "value").min(0.1).max(1).step(0.01).name("uWaveLength");
  gui.add(material.uniforms.uFrequency.value, "x").min(0).max(10).step(0.01).name("uFrequencyX");
  gui.add(material.uniforms.uFrequency.value, "y").min(0).max(10).step(0.01).name("uFrequencyY");

  gui.add(material.uniforms.uWaveSpeed, "value").min(0).max(5).step(0.01).name("uWaveSpeed");
  gui.add(material.uniforms.uColorOffset, "value").min(0).max(1).step(0.01).name("uColorOffset");
  gui.add(material.uniforms.uColorMultiplier, "value").min(0).max(10).step(0.01).name("uColorMultiplier");
  gui.add(material.uniforms.uSmallWaveElevation, "value").min(0).max(1).step(0.01).name("uSmallWaveElevation");
  gui.add(material.uniforms.uSmallWaveFrequency, "value").min(0).max(10).step(.01).name("uSmallWaveFrequency");
  gui.add(material.uniforms.uSmallWaveSpeed, "value").min(0).max(10).step(.01).name("uSmallWaveSpeed");

  // 色のデバック
  gui.addColor(colorObject, "depthColor").onChange(() => {
    material.uniforms.uDepthColor.value.set(colorObject.depthColor);
  });

  gui.addColor(colorObject, "surfaceColor").onChange(() => {
    material.uniforms.uSurfaceColor.value.set(colorObject.surfaceColor);
  })

  // guiをクローズしておく
  gui.close()
  // gui.show(false); // 

  // ヘルパー
  const axesHelper = new AxesHelper();
  scene.add(axesHelper);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Controls
  // const controls = new OrbitControls(camera, canvas);
  // controls.enableDamping = true;

  // Animate
  const clock = new Clock();
  // console.log(clock)

  // レンダー
  const render = () => {
    //時間取得
    const elapsedTime = clock.getElapsedTime();

    material.uniforms.uTime.value = elapsedTime; // 経過時間を取得
    // console.log(elapsedTime)

    // material.uniforms.uTick.value++;

    // カメラを円周上に周回させる
    // * 3 ... 半径を大きくする
    camera.position.x = Math.sin(elapsedTime * .17) * 3; // sin ... y軸
    camera.position.z = Math.cos(elapsedTime * .17) * 3; // cos ... z軸

    // カメラを揺らす...船に乗っている様
    // lookAt(x軸, y軸, z軸)
    camera.lookAt(
      Math.cos(elapsedTime) * .5, // x軸
      Math.sin(elapsedTime) * .5, // y軸
      Math.sin(elapsedTime) * .3  // z軸
    );

    // controls.update();

    // cameraはここで実行
    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
  };

  render();
}