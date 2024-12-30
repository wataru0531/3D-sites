
// glTF 読み込み


import "./styles/style.css";

import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  AxesHelper,
  AmbientLight,
  PointLight,
  Color,
  DirectionalLight,
  MeshStandardMaterial,
  sRGBEncoding,


} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
// console.log(GLTFLoader);

init();
async function init(){
  const canvas = document.getElementById('js-canvas');
  const scene = new Scene();
  scene.background = new Color(0xdddddd);

  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  camera.position.set(0, 2, 10);

  const renderer = new WebGLRenderer({
    canvas: canvas, // HTMLのcanvasタグに挿入
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  

  const geometry = new BoxGeometry(5, 5, 5, 10);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const box = new Mesh(geometry, material);
  // scene.add(box);




  // 
  const gltfLoader = new GLTFLoader();
  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/draco_decoder.js");

  // Bear.binを参照しているので
  // gltfLoader.load(
  //   "/img/blender/Bear.gltf", 
  //   (gltf) => {
  //     // console.log(gltf)
  //     scene.add(gltf.scene);

  //     // gltf.animations; // Array<THREE.AnimationClip>
  //     // gltf.scene; // THREE.Group
  //     // gltf.scenes; // Array<THREE.Group>
  //     // gltf.cameras; // Array<THREE.Camera>
  //     // gltf.asset; // Object
  //   }, 
  //   (xhr) => {
  //     // XMLHttpRequest
  //     // → ブラウザのXMLHttpRequestオブジェクトを使用して、ファイルの読み込みの進行状況を追跡する
  //     //   ロードしたファイルの合計サイズや、現在どのくらい読み込まれているかといった情報を含み、
  //     //   読み込みが完了するまでリアルタイムで進行状況を確認することができる
  //     // console.log(xhr); // ProgressEvent {isTrusted: false, lengthComputable: true, loaded: 14175, total: 14175, type: 'progress', …}
  //     console.log((xhr.loaded / xhr.total) * 100 + "%");
  //   },
  //   (error) => {
  //     console.log("An error happened", error);
  //   }
  // )

  await loadGLTF(scene, "/img/blender/Bear.gltf");

  // ライト
  const amLight = new AmbientLight(0x404040, 2);
  const pLight = new PointLight(0xFFFFFF, 1, 1000);
  scene.add(amLight, pLight);

  const directionalLight = new DirectionalLight(0xffffff, 3);
  directionalLight.position.set(5, 10, 7.5);



  const axesHelper = new AxesHelper(20);
  scene.add(axesHelper);

  const control = new OrbitControls(camera, renderer.domElement);
  // control.update

  // ticの中はフレームの更新ごとに実行される
  const render = () => {
    requestAnimationFrame(render);

    control.update();
    renderer.render(scene, camera);
  };


  render();

  let timerId = null;
  window.addEventListener('resize', () => {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);
    }, 500);
  });

  
}

async function loadGLTF(_scene, _modelPath){
  const loader = new GLTFLoader();

  const dracoLoader = new DRACOLoader();
  // dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/");
  dracoLoader.setDecoderPath("three/examples/jsm/libs/draco/draco_decoder.js");
  loader.setDRACOLoader(dracoLoader);

  try{
    const gltf = await loader.loadAsync(_modelPath);
    const model = gltf.scene;

    model.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material = new MeshStandardMaterial({
          ...child.material,
          map: child.material.map,
        });
        // child.material.map.encoding = sRGBEncoding;
      }
    })

    _scene.add(model);

  } catch(error){
    console.error("モデルの読み込みに失敗", error);
  }

}
