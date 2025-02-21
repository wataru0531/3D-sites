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
  BoxGeometry,
  MeshNormalMaterial,
  Mesh,
  TorusGeometry,

} from "three";


init();
async function init(){
  /**************************************************************
  canvas
  ****************************************************************/
  const canvas = document.getElementById('webgl');

  /**************************************************************
  シーン
  ****************************************************************/
  const scene = new Scene();

  /**************************************************************
  背景用のテクスチャ
  ****************************************************************/

  // テクスチャ読み込み
  const loadTex = async (_url) => {
    const texLoader = new TextureLoader();
    const texture = await texLoader.loadAsync(_url);

    return texture;
  }

  const url = "/img/shincode/bg/bg.jpg";

  // const textureLoader = new TextureLoader();
  // const bgTexture = textureLoader.load('./bg/bg.jpg');
  const bgTexture = await loadTex(url);
  console.log(bgTexture)
  scene.background = bgTexture;

  /**************************************************************
  ウインドウサイズ
  ****************************************************************/
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**************************************************************
  カメラ
  ****************************************************************/
  const camera = new PerspectiveCamera(
    75,
    sizes.width / sizes.height,
    0.1,
    1000
  );

  // camera.position.z = 10;

  /**************************************************************
  レンダラー
  ****************************************************************/
  const renderer = new WebGLRenderer({
    canvas: canvas, // HTMLのcanvasタグに挿入
  });

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(window.devicePixelRatio);

  /**************************************************************
  オブジェクトを作成
  ****************************************************************/
  // ボックスジオメトリ
  const boxGeometry = new BoxGeometry(5, 5, 5, 10);
  const boxMaterial = new MeshNormalMaterial();
  const box = new Mesh(boxGeometry, boxMaterial);

  box.position.set(0, 0.5, -15);
  box.rotation.set(1, 1, 0);

  // ドーナッツジオメトリ
  const torusGeometry = new TorusGeometry(8, 2, 16, 100);
  const torusMaterial = new MeshNormalMaterial();
  const torus = new Mesh(torusGeometry, torusMaterial);

  torus.position.set(0, 1, 10);

  scene.add(box, torus);

  /**************************************************************
  線形補間...滑らかに移動させる公式。ここでは一次線形補間。
  ****************************************************************/
  // lerp(x, y, a)
  // x...スタート地点
  // y...エンド地点
  // a...滑らかに動く度合い。割合。パラパラ漫画。一時関数の直線のようなもの。

  function lerp(x, y, a){
    return (1 - a) * x + a * y;
  };

  // スクロール率に応じて各区間のどの位置にいるかの割合を算出する。
  // startからendまでの間でいまどこにいるのかの割合を取得する関数。
  function scalePercent(start, end){
    return (scrollPercent - start) / (end - start);
  };

  /**************************************************************
  スクロールアニメーション
  ****************************************************************/
  // アニメーションの配列
  const animationScripts = [];

  // 0〜40%でのスクロールアニメーション
  animationScripts.push({
    start: 0,
    end: 40,
    function(){
      camera.lookAt(box.position);
      camera.position.set(0, 1, 10);
      // 線形補間、lerp関数でZ軸の値を決める。
      box.position.z = lerp(-15, 2, scalePercent(0, 40));
      torus.position.z = lerp(10, -20, scalePercent(0, 40));
    }
  });

  // 40%〜60%までのアニメーション
  animationScripts.push({
    start: 40,
    end: 60,
    function(){
      camera.lookAt(box.position);
      camera.position.set(0, 1, 10);
      // Math.PI...π。ラジアン単位でπは180°。
      box.rotation.z = lerp(1, Math.PI, scalePercent(40, 60));
    }
  });

  // 60〜80までのアニメーション
  animationScripts.push({
    start: 60,
    end: 80,
    function(){
      camera.lookAt(box.position);
      camera.position.x = lerp(0, -15, scalePercent(60, 80));
      camera.position.y = lerp(1, 15, scalePercent(60, 80));
      camera.position.z = lerp(10, 25, scalePercent(60, 80));
    }
  });

  // 80%〜100%までのアニメーション
  animationScripts.push({
    start: 80,
    end: 100,
    function(){
      camera.lookAt(box.position);
      box.rotation.x += 0.02;
      box.rotation.y += 0.02;
    }
  })

  // ブラウザのスクロール率を取得
  // (スクロール量 / (全体の高さ - ブラウザの高さ)) * 100
  let scrollPercent = 0;

  document.body.onscroll = () => {
    scrollPercent = 
      (document.documentElement.scrollTop / 
        (document.documentElement.scrollHeight - document.documentElement.clientHeight)) * 100;

    // console.log(scrollPercent);
  };

  // アニメーションを開始するための関数
  function playScrollAnimation(){
    animationScripts.forEach((animation) => {
      
      if(scrollPercent >= animation.start && scrollPercent <= animation.end){
        animation.function();
      }
      // 配列からアニメーションをひとつづつ取り出してアニメーションさせる。

    });
  };

  /**************************************************************
  アニメーション
  ****************************************************************/
  // ticの中はフレームの更新ごとに実行される
  const tic = () => {
    // フレームの更新のたびにtic関数を呼ぶ
    window.requestAnimationFrame(tic);

    // アニメーションを実行。
    playScrollAnimation();

    renderer.render(scene, camera);
  };

  tic();

  /**************************************************************
  ブラウザのリサイズ操作
  ****************************************************************/
  window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix(); // 変更を加えたらかならず呼び出す必要がある。

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
  });

}