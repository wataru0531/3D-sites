/**************************************************************

レンダーターゲット → 描画結果を保存するためのバッファ(メモリ領域)のこと
                  必ずしもテクスチャ専用の保存子ではなく、描画データ全般を格納できるバッファ
レンダリングした画面をテクスチャとして、
他のマテリアルに追加して使用できる機能

***************************************************************/
import {
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderTarget,
  BoxGeometry,
  MeshLambertMaterial,
  Mesh,
  ShaderMaterial,
  DoubleSide,
  PointLight,

} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

// メインのレンダラー
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.deviceRatio);
renderer.setClearColor(0xeeeeee);

document.body.appendChild(renderer.domElement);

const scene = new Scene(); // シーン
scene.background = new Color( 0xeeeeee );

const camera = new PerspectiveCamera( // カメラ
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.z = -10;


// レンダーターゲット → 描画結果を保存するためのバッファ(メモリ領域)のこと
// 　　　　　　　　　　 必ずしもテクスチャ専用の保存子ではなく、描画データ全般を格納できるバッファ
// → フレームバッファオブジェクトなどがレンダーターゲットとして機能する
//   フレームバッファオブジェクト ... オフスクリーンレンダリング用のレンダーターゲット(バッファ)
//   オフスクリーンレンダリング
//   → 描画結果を画面に直接表示せず、別のメモリ領域(通常はフレームバッファオブジェクト)に保存するレンダリング技法。
//     これにより、画面に表示する前に追加の処理(ポストプロセッシング)を行い、フレームバッファオブジェクトに描画結果を追加、
//     それをテクスチャとして扱い、通常の描画バッファに追加し(ここではmaterialのtDiffuse)ディスプレイに表示

// フレームバッファ
// → 通常の最終的な描画の画像データを格納するためのメモリ領域。GPU側で管理。
//   ピクセルデータを保存（カラー、深度、ステンシルバッファなど)
// 頂点バッファ
// → 頂点データ(位置、法線、テクスチャ座標など)を保存。GPU側で管理
//   頂点シェーダによって処理され、最終的な描画に使用されるジオメトリ情報を提供。
const renderTarget = new WebGLRenderTarget(500, 500); // テクスチャに使うためのレンダーターゲット(バッファ)を用意
// console.log(renderTarget); // WebGLRenderTarget {isWebGLRenderTarget: true, width: 500, height: 500, depth: 1, scissor: Vector4, …}

// レンダーターゲットのカメラ
// const rtCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const rtCamera = camera.clone();   // オリジナルとは異なるcamera
rtCamera.position.set(0, 0, 10); // x y z
rtCamera.aspect = 1;
// updateProjectionMatrix
// → カメラのアスペクト比や視野などを考慮して、3Dシーンを2Dスクリーンに投影するための投影行列を更新
//   ここではaspectが更新されているので、その変更を蹴目らの投影行列に反映させる必要がある
rtCamera.updateProjectionMatrix(); // aspectの設定を反映する

// レンダーターゲットのシーン
const rtScene = new Scene(); // rtシーン...これに追加したものを最終的にテクスチャとする
rtScene.background = new Color(0x00ff00);

// レンダーターゲットのメッシュ
const rtGeo = new BoxGeometry(4, 4, 4);
const rtMate = new MeshLambertMaterial({ color: 0x009dff, side: DoubleSide });
const rtMesh = new Mesh(rtGeo, rtMate);
rtScene.add(rtMesh); // rtSceneに追加


// 通常のメッシュ...このメッシュに手薄ちゃとしてレンダーターゲットを貼り付ける
const geo = new BoxGeometry(4, 4, 4);

// このマテリアルにレンダーターゲットのメッシュを貼り付ける
const mate = new ShaderMaterial({
  vertexShader,
  fragmentShader,

  uniforms: {
    // fragmentShaderにレンダーターゲットのテクスチャを渡す
    // renderTargetは必ずしもテクスチャ専用の保存子ではなく、描画データ全般を格納できるバッファ
    tDiffuse: { value: renderTarget.texture },
  }
});

const mesh = new Mesh(geo, mate);
// console.log(mesh)
scene.add(mesh);


// ライト
const light1 = new PointLight( 0xffffff, 1, 0 );
light1.position.set( 0, 20, 0 );

const light2 = new PointLight( 0xffffff, 1, 0 );
light2.position.set( 10, 20, 10 );

const light3 = new PointLight( 0xffffff, 1, 0 );
light3.position.set( - 10, - 20, - 10 );

rtScene.add(light1, light2, light3);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  rtMesh.rotation.x += 0.01;
  rtMesh.rotation.y += 0.01;
  
  // 以下の①〜⑤のプロセスを通じて、レンダリング対象であるテクスチャにシーンが描かれ、
  // その結果をテクスチャとして取得することができる。

  // render()
  // → シーンをカメラから見た視点でフレームバッファに描画するためのメソッド
  // 　描画先が通常のフレームバッファ(画面)である場合、その結果は直接ブラウザに表示されるが、
  // 　レンダーターゲット(バッファのこと)が設定されている場合、その結果はレンダーターゲットに保存される
  // ※あくまでフレームバッファに描画内容を保存するメソッドでブラウザに描画するメソッドではない

  // ①レンダリングの保存先をレンダーターゲット(バッファ)に設定
  // setRenderTarget()...レンダリングの出力先を決定するメソッド
  renderer.setRenderTarget(renderTarget); 
  
  // ②レンダーターゲット(フレームバッファオブジェクト)に描画データをレンダリングして格納
  // rtSceneをrtCameraの視点からレンダーターゲットに描画
  renderer.render(rtScene, rtCamera); 

  // ③レンダリングの保存先を通常のフレームバッファに戻す(リセット)
  // → これにより、次に描画される内容は画面に直接表示されるようになる
  renderer.setRenderTarget(null);

  // ④メインのシーンにレンダーターゲットのテクスチャを使用
  // → tDiffuse: { value: renderTarget.texture } この部分

  // ⑤通常のフレームバッファに描画データを保存して、ディスプレイに描画
  renderer.render(scene, camera);
}

animate();
