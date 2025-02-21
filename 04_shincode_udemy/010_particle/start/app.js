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
  MeshNormalMaterial,
  Mesh,
  BufferGeometry,
  BufferAttribute,
  SphereGeometry,
  PointsMaterial,
  Points,
  Clock,

} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import GUI from "lil-gui";

init();
async function init(){
  //UIデバッグ
  // const gui = new GUI();

  //サイズ
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  //シーン
  const scene = new Scene();

  //カメラ
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    100
  );
  camera.position.set(1, 1, 15);

  //レンダラー
  const renderer = new WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  /************************************************************
  テクスチャ設定...画像などを設定する
  ***************************************************************/
  async function loadTex(url) {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(url);

    return texture;
  };

  const url = "/img/shincode/textures/particles/1.png";
  const particlesTexture = await loadTex(url);

  /****************************************************************
  パーティクルを作ってみよう
  ******************************************************************/
  // ジオメトリ
  // BufferGeometry...メモリの効率化に良い
  const particlesGeometry = new BufferGeometry(1, 100, 100);

  // パーティクルの数
  const count = 100;

  // 3...座標の数がZ、Y、Zの3つのため。
  const positionArray = new Float32Array(count * 3);

  // 色の座標
  const colorArray = new Float32Array(count * 3);

  for(let i = 0; i < count * 3; i++){
    positionArray[i] = (Math.random() -0.5) * 10;
    colorArray[i] = Math.random();
  };

  // BufferGeometryに関連づけられた属性のデータを格納する。ここではパーティクルの数、頂点の数
  const bufferAttribute = new BufferAttribute(positionArray, 3);
  // console.log(bufferAttribute);

  // BufferGeometryに位置の属性を付与
  particlesGeometry.setAttribute('position', bufferAttribute);

  // BufferGeometryに色の属性を付与
  particlesGeometry.setAttribute('color', new BufferAttribute(colorArray, 3));

  // 球
  const cube = new Mesh(
    new SphereGeometry(0.5, 16, 32),
    new MeshNormalMaterial(),
  );

  // マテリアル
  const pointsMaterial = new PointsMaterial({
    size: 0.15,
    sizeAttenuation: true, // デフォルトでtrue。
    alphaMap: particlesTexture, // transparentもtrueにする必要がある。
    transparent: true,
    // alphaTest: 0.001, // パーティクルの画像のエッジを見えなくする。
    // depthTest: false, // 深度のテストが行われなくなる。深さを関係なくする。
    depthWrite: false, // 奥行きをなくす。
    // color: "green",
    vertexColors: true, // 頂点座標の色を設定。カラフルに設置する。
    // blending: AdditiveBlending, // 物体やパーティクル同士とが重なったら光る。
  });
  // pointsMaterial.map = particlesTexture;


  // メッシュ化
  // Points...パーティクル専用のメッシュ。
  const particles = new Points(particlesGeometry, pointsMaterial);

  scene.add(particles);


  // マウス操作
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 慣性

  window.addEventListener("resize", onWindowResize);

  // console.log(particleGeometry)

  const clock = new Clock();

  // レンダー
  render();
  function render() {
    const elapsedTime = clock.getElapsedTime();

    controls.update();

    // パーティクルにアニメーションをつける
    for(let i = 0; i < count; i++){
      const i3 = i * 3;

      // すべての頂点のY座標を0にする。
      // particlesGeometry.attributes.position.array[i3 + 1] = 0; 

      // X座標
      const x = particlesGeometry.attributes.position.array[i3 + 0];

      // sin()...波のように表現できる。
      particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x); 
    };

    // 注意...particlesGeometryの位置座標をアニメーションで動かしたい場合、needsUpdateをtrueにする。
    particlesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);

    requestAnimationFrame(render);
  };

  //ブラウザのリサイズに対応
  function onWindowResize() {
    renderer.setSize(sizes.width, sizes.height);
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  };

}