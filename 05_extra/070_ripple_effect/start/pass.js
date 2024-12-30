/**************************************************************

pass
処理の流れ
・renderTargetにrippleの描画データを格納 ↓
・それをテクスチャとしてShaderMaterialにテクスチャとして渡す ↓
・composerに渡す ↓
・app.jsのanimateメソッドでレンダリング

***************************************************************/
import {
  Scene,
  OrthographicCamera,
  // WebGLRenderer,
  PlaneGeometry,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  WebGLRenderTarget,
  ShaderMaterial,

} from "three";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

import vertexShader from "./vertex.glsl";
import fragmentShader from  "./fragment.glsl";


// rippleのmesh生成、大きさを変更するアニメーション
// → opacityを基準に表示、非表示を行う
class Ripple {
  constructor(_tex){
    const ripple = { width: 100, height: 100 };
    this.geometry = new PlaneGeometry(ripple.width, ripple.height);
    this.material = new MeshBasicMaterial({ 
      transparent: true,
      map: _tex,
    });
    this.mesh = new Mesh(this.geometry, this.material);

    this.mesh.visible = false; // 初期表示はfalse
    this.isUsed = false; // 使い回すために使用中かどうかをこのフラグで見分ける
  }

  start(_mouse){
    const { material, mesh } = this;

    // 取得できた場合
    this.isUsed  = true;       // もうこのrippleオブジェクトは使ったよということ
    mesh.visible = true;  // メッシュを可視化できるようにする

    // 位置、大きさ、透明度、回転
    mesh.position.x = _mouse.x;
    mesh.position.y = _mouse.y;
    mesh.scale.x = mesh.scale.y = .2;
    material.opacity = .8;
    mesh.rotation.z = 2 * Math.PI * Math.random(); // 360 * 0から1。回転

    this.animate();
  }

  animate(){
    const { mesh, material } = this;

    // 大きさ、透明度、回転
    mesh.scale.x = mesh.scale.y = mesh.scale.x + 0.03; // ループが繰り返されるうちに0.1づつ大きくなる
    material.opacity *= .95; // ループが繰り返されるうちに.95倍で透明度が下がっていく
    mesh.rotation.z += 0.003;

    // マテリアルの透明度が0.01以下の時のみanimateを発火し続ける
    if(material.opacity <= 0.01){
      // ループ終了
      mesh.visible = false; // 画面上に表示されなくなる
      this.isUsed = false; // もうこのメッシュは使ってませんよに
      
    } else{
      requestAnimationFrame(() => {
        this.animate();
      })
    }
  }
}

// ポストプロセスのcomposerに、
// レンダーターゲットに保存したrippleのエフェクトの描画データを追加
// → コンポーザーに追加されたデータはテクスチャとして保持される
async function initRipplePass(_composer) {
  const rtScene = new Scene(); // シーン　renderTarget
  const rtCamera = new OrthographicCamera( // カメラ renderTarget 遠近感を加味しない
    - window.innerWidth / 2,  // 左
    window.innerWidth / 2,    // 右
    window.innerHeight / 2,   // 上
    - window.innerHeight / 2, // 下
    - window.innerHeight,     // near
    window.innerHeight        // far
  );
  rtCamera.position.z = 10;

  // レンダーターゲット(フレームバッファオブジェクト) ... 
  // → 描画データの保存先。ここにrippleのエフェクトをレンダリングしていく
  const renderTarget = new WebGLRenderTarget();
  renderTarget.setSize(window.innerWidth, window.innerHeight);

  const texLoader = new TextureLoader();
  const tex = await texLoader.loadAsync("/img/displacement/ripple.png");
  // console.log(tex);

  const ripples = [];
  const rippleCount = 50;

  for(let i = 0; i < rippleCount; i++){
    const ripple = new Ripple(tex);
    // console.log(ripple)

    rtScene.add(ripple.mesh);
    ripples.push(ripple);
  }

  // 波紋のエフェクトをテクスチャとして、RenderPassでレンダリングした描画データに追加
  const material = new ShaderMaterial({
    // ShaderPassに渡すvertex
    // → ポストプロセス効果を適用するための四角形(スクリーン全体を覆う平面、スクリーンスペースのクアッド)の頂点を処理する
    //   composerに渡ってきたこれまでのレンダリング結果の画面の4つの頂点を処理している
    vertexShader,
    fragmentShader,
    uniforms: {
      // RenderPassで読み込んだはじめのシーンがテクスチャとしてここに渡ってくる仕様になっている
      // → 直近でcomposer.addPassで読み込んだものがテクスチャとして渡ってくる
      tDiffuse: { value: null },

      // レンダーターゲットで生成したテクスチャを貼り付ける
      // 画面全体の大きさのテクスチャとなる
      texRipple: { value: renderTarget.texture }, // 波紋のテクスチャ
    },
  });

  const pass = new ShaderPass(material); // 独自に作ったシェーダーパス
  _composer.addPass(pass);  // エフェクトを追加

  // マウスの位置の制御
  const mouse = {
    x: window.innerWidth  / 2,
    y: window.innerHeight / 2,
    tick: 0,
  }

  function onMouseMove({ clientX, clientY }) {
    // console.log(clientX, clientY);
    mouse.x =   clientX - window.innerWidth  / 2; // ブラウザ座標をワールド座標に変換
    mouse.y = - clientY + window.innerHeight / 2;

    // 使ってないメッシュを選択し、透明度を少しづつ上げ、波紋を大きくしていく
    // あまり波紋を作るとうっとうしいので5で割った時の余りが0の時のみ生成(tickが5の倍数の時)
    if(mouse.tick % 5 === 0){ 
      // find...ripplesからまだ使われていないrippleを取得。1つのみ取得
      const unUsedRipple = ripples.find(ripple => !ripple.isUsed); // isUsedはデフォルトでfalse
      // console.log(unUsedRipple)

      // もし50個使い切った場合、後続の処理に進めたくないので処理を止める
      if(!unUsedRipple) return;

      // 位置、透明度、大きさなどの初期化
      unUsedRipple.start(mouse);
    }
  }

  // renderTargetに格納した描画データをレンダリング
  function renderRipple(_mainRenderer) { // メインのレンダラーが渡ってくる
    // レンダリングの描画データの保存先をレンダーターゲット(フレームバッファオブジェクト)に設定
    _mainRenderer.setRenderTarget(renderTarget); 
    _mainRenderer.render(rtScene, rtCamera); // レンダーターゲットの描画データをレンダリング
    _mainRenderer.setRenderTarget(null); // レンダラーの描画対象を通常のフレームバッファに戻しレンダリング

    mouse.tick++;
  }

  // 確認用。呼ぶとリップルの画面が見える
  function getTexture(){
    // レンダーターゲットのテクスチャを返す
    return renderTarget.texture;
  }
  
  return {
    onMouseMove,
    renderRipple,
    getTexture,
  };
};

export { initRipplePass };