/**************************************************************


レンダーターゲット ... 描画結果を格納するバッファ(メモリ領域)のこと
                    通常のバッファ(フレームバッファ)とは違う
                    レンダーターゲットの例としてフレームバッファオブジェクトなどがある。

***************************************************************/
import {
  WebGLRenderer,
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderTarget,
  BoxGeometry,
  DoubleSide,
  ShaderMaterial,
  Mesh,
  MeshLambertMaterial,
  PointLight,
  
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { FilmShader } from "three/examples/jsm/shaders/FilmShader";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { DotScreenPass } from "three/examples/jsm/postprocessing/DotScreenPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import vertexShader from "./vertex.glsl";
import fragmentShader from "./fragment.glsl";

// メインのレンダラー
const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xeeeeee);

// console.log(renderer.domElement)
document.body.appendChild(renderer.domElement);

const scene = new Scene(); // シーン
scene.background = new Color( 0xeeeeee );

// カメラ
const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = -10;


/**************************************************************

ポストプロセス
→ 通常の3Dシーンのレンダリングが完了した後に、その描画結果に対して追加のエフェクトや
  調整を行うプロセスを指す。

  ただし、RenderPassで一度取り込んだら描画データとしてフレームバッファで保持する
  テクスチャとしてではない。
  その後にglitchなどのエフェクトを同様にフレームバッファに追加していき最終的なものを描画する

  通常のThree.jsのレンダリングパイプラインでは、
  シーンとカメラを指定してrenderer.render(scene, camera) を呼び出すことで、
  シーンをカメラの視点からレンダリングする。この際、直接ブラウザの画面に描画する

  しかし、EffectComposerを使用すると、通常のレンダリング結果を後で
  ポストプロセスのエフェクトと合成するため、
  最初に通常のレンダリング結果をRenderPassを通じてcomposerに追加する必要がある。
  これにより、後続のエフェクトが適用される対象となるレンダリング結果が整備される

***************************************************************/
// EffectComposer → ポストプロセッシングエフェクトを管理するためのクラス
//                  通常のレンダリングの後に追加のポストプロセスエフェクトを適用するための仕組みを提供
const composer = new EffectComposer(renderer);

// RenderPass → 通常のレンダリングを行うパス
//              後から追加されるエフェクトと合成するために、RenderPassに通常のレンダリングしたいシーンを渡して、composerに渡しておく
//              通常RenderPassを最初に配置することで、通常のレンダリングを行い、
//              その結果をポストプロセスのパイプラインの最初に組み込む。
//              この後にブルーム、モーションブラー、グリッチなどの追加のパスを追加することが一般的。
const renderPass = new RenderPass(scene, camera); // これはテクスチャではない
composer.addPass(renderPass); 


// グリッチのエフェクト
// const glitchPass = new GlitchPass();
// composer.addPass(glitchPass);
// → ここから追加するものがテクスチャとしてテクスチャとして追加され上書きされていく

// フィルムパスのエフェクト → フィルム調のエフェクトを追加するポストプロセスエフェクト
// const filmPass = new FilmPass();
// filmPass.uniforms.sCount.value = 8192; // クラスの上書き
// filmPass.uniforms.grayscale.value = 1;
// composer.addPass(filmPass);

// ドットスクリーンパス
// const dotScreenPass = new DotScreenPass();
// composer.addPass(dotScreenPass);

// シェーダーパス
// → 自分で定義した頂点シェーダーとフラグメントシェーダーを使用して、
//   レンダリング結果にカスタムエフェクトを適用することができる
// FilmShader...uniforms、vertexShader、fragmentShaderの3つを持つ。
const pass = new ShaderPass(FilmShader);
// pass.uniforms.grayscale.value = 1;
composer.addPass(pass);


/**************************************************************
レンダーターゲット ... 描画結果を格納するバッファ(メモリ領域)のこと
                    必ずしもテクスチャ専用の保存子ではなく、描画データ全般を格納できるバッファ
                    通常のバッファ(フレームバッファ)とは違う
                    レンダーターゲットの例としてフレームバッファオブジェクトなどがある。
***************************************************************/
const renderTarget = new WebGLRenderTarget(500, 500);
// console.log(renderTarget)

// rtカメラ
const rtCamera = camera.clone();  
rtCamera.position.set(0, 0, 10); // x y z
rtCamera.aspect = 1;
rtCamera.updateProjectionMatrix(); // aspectの設定を反映する

// rtScene
const rtScene = new Scene(); // rtシーン...これに追加したものを最終的にテクスチャとする
rtScene.background = new Color(0x444444);

// レンダーターゲットのメッシュ
const rtGeo = new BoxGeometry(4, 4, 4);
const rtMate = new MeshLambertMaterial({ color: 0x009dff, side: DoubleSide });
const rtMesh = new Mesh(rtGeo, rtMate);
rtScene.add(rtMesh); // rtSceneに追加


// 立方体...このメッシュにレンダーターゲットをテクスチャとして貼り付ける
const geo = new BoxGeometry(4, 4, 4);
// const mate = new MeshBasicMaterial({ // 光の影響はない
//   color: 0x009dff, 
//   side: DoubleSide,
//   // ここでレンダーターゲットに描画した内容を渡す。あくまでもテクスチャとして渡す
//   map: renderTarget.texture, 

// });
const mate = new ShaderMaterial({
  vertexShader,
  fragmentShader,

  uniforms: {
    // レンダーターゲットのテクスチャを貼り付け
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

  rtMesh.rotation.x += 0.01;
  rtMesh.rotation.y += 0.01;

  controls.update();

  // render()
  // → シーンをカメラから見た視点でフレームバッファに描画するためのメソッド
  // 　描画先が通常のフレームバッファ(画面)である場合、その結果は直接ブラウザに表示されるが、
  // 　レンダーターゲット(バッファのこと)が設定されている場合、その結果はレンダーターゲットに保存される
  // ※あくまでフレームバッファに描画内容を保存するメソッドでブラウザに描画するメソッドではない

  // ①レンダリング先をレンダーターゲット(バッファ)に設定
  // setRenderTarget()...レンダリングの出力先を決定するメソッド
  renderer.setRenderTarget(renderTarget); 
  
  // ②レンダーターゲット(バッファ)にシーンを描画
  // rtSceneをrtCameraの視点からレンダーターゲットに描画
  // → この描画結果はrenderTargetのフレームバッファに保存する
  renderer.render(rtScene, rtCamera); 

  // ③レンダリング先を通常のフレームバッファに戻す(リセット)
  // → これにより、次に描画される内容は画面に直接表示されるようになる
  renderer.setRenderTarget(null);

  // ④メインのシーンにレンダーターゲットのテクスチャを使用
  // → tDiffuse: { value: renderTarget.texture } この部分

  // ⑤scene を camera の視点から通常のフレームバッファ(画面)に描画する
  // renderer.render(scene, camera);

  // Composerをレンダリング
  //  → composerの中には通常のレンダリングの内容(scene, camera)と、
  //    composer.addPassで渡したそれに続くポストプロセスのエフェクトの内容がテクスチャとして入っている
  // → 合成された結果がフレームバッファに出力
  composer.render(); // 

}

animate();
