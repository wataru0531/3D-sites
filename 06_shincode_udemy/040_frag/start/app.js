/**************************************************************

shincodeのudemy講座
https://www.udemy.com/course/threejs-beginner/learn/lecture/29874966?start=0#overview

***************************************************************/
import "./styles/style.css";

// メモリを最小限抑えるために必要なモジュールのみインポート
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
  Clock,
  AxesHelper,
  
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "lil-gui";

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
  const canvas = document.querySelector("#webgl");

  // シーン
  const scene = new Scene();

  // カメラ
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(0, 0, 1.5);

  // レンダラー
  const renderer = new WebGLRenderer({
    canvas: canvas,
  });
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


  // Textures
  const loadTex = async (_url) => {
    const textureLoader = new TextureLoader();
    const texture = textureLoader.loadAsync(_url);

    return texture;
  }

  const TEXTURE_URL= "/img/shincode/textures/frag/jp-flag.png";
  const flagTexture = await loadTex(TEXTURE_URL);

  // ジオメトリ...頂点
  const geometry = new PlaneGeometry(1, 1, 32, 32);
  console.log(geometry)

  // マテリアル
  // RawShaderMaterial...projectionMatrix、viewMatrix、modelMatrixなどを自分で宣言する必要がある。

  const material = new ShaderMaterial({
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,

    transparent: true, // opacityを設定するときに使用
    side: DoubleSide, // 平面の裏側も
    // wireframe: true,
    
    uniforms: {
      uFrequency: {value: new Vector2(10, 5)}, // 周波数
      uTime: { value: 0 },
      uColor: { value: new Color("pink") },
      uTexture: { value: flagTexture },
      
    }
  });

  // デバック
  const gui = new dat({ width: 300 });
  gui.add(material.uniforms.uFrequency.value, "x").min(0).max(30).step(0.01).name("frequencyX");
  gui.add(material.uniforms.uFrequency.value, "y").min(0).max(50).step(0.01).name("frequencyY");
  // gui.add(material.uniforms.uColor.value, "color")

  // メッシュ
  const mesh = new Mesh(geometry, material);
  // 大きさを変更する場合
  mesh.scale.y = 2 / 3;

  scene.add(mesh);

  window.addEventListener("resize", () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // Controls
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true; // 慣性をつける

  // ヘルバー
  const axesHelper = new AxesHelper();
  scene.add(axesHelper)

  // render
  const clock = new Clock();

  const render = () => {
    //時間取得
    const elapsedTime = clock.getElapsedTime();
    // console.log(elapsedTime)

    // uniformの変数に時間を入れる
    material.uniforms.uTime.value = elapsedTime;
    // material.uniforms.uTime.value++;

    controls.update();

    renderer.render(scene, camera);

    window.requestAnimationFrame(render);
  };

  render();
}