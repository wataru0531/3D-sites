/**************************************************************

⭐️ PCへの負荷が重すぎて終わり。28:35

Three.js チュートリアル – 接続されたポイントとクールな効果を備えた光るノード キューブを作成します。
https://www.youtube.com/watch?v=bOsj1aWbul0&t=385sProject URL

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


import * as THREE from "three";
// console.log(THREE)

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 12;

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

// cube
// const gridSize = 15;
const gridSize = 5;
// const spacing = 0.4;
const spacing = 0.1;

const nodeGeometry = new THREE.BufferGeometry();
const nodeMaterial = new THREE.PointsMaterial({ // ✅ ポイント
  color: 0x000000,
  size: 0.05,
});

const positions = []; // x, y, z座表
const nodes = [];

// x ... -2.5 〜 2.5 の範囲 → 5回ずつループ　⭐️重すぎるので -2.5 〜 2.5 に変更
// y ... -2.5 〜 2.5
// z ... -2.5 〜 2.5

// ✅ 処理の順番
// x = -2.5
//   y = -2.5
//     z = -2.5 → -1.5 → -0.5 → 0.5 → 1.5 // ✅zは全て回る
//   y = -1.5
//     z = -2.5 → -1.5 → ...
//   ...
// x = -1.5
//   y = -2.5
//     z = ...
// ...
// ① -2.5, -2.5, -2.5 
// ② -2.5, -2.5, -1.5
// ③ -2.5, -2.5, -0.5
// ...
for(let x = - gridSize / 2; x < gridSize / 2; x++){
  // console.log(x); // -2.5, -1.5, -0.5, 0.5, 1.5

  for(let y = -gridSize / 2; y < gridSize / 2; y++){
    // console.log(y); // -2.5, -1.5, -0.5, 0.5, 1.5

    for(let z = -gridSize / 2; z < gridSize / 2; z++){
      // console.log(z); // -2.5, -1.5, -0.5, 0.5, 1.5

      // 
      const posX = x * spacing;
      const posY = y * spacing;
      const posZ = z * spacing;

      positions.push(posX, posY, posZ); // 数値の配列
      nodes.push({ x: posX, y: posY, z: posZ }); // x, y, zの座標のオブジェクトの配列
    }
  }
}

// console.log(positions); // 3375回ループ * 3 で、10125
// console.log(nodes); // 3375。15回 * 15回 * 15回

// 
nodeGeometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));

const nodePoints = new THREE.Points(nodeGeometry, nodeMaterial);

scene.add(nodePoints);


const lineGeometry = new THREE.BufferGeometry();
const linePositions = [];
const lineColors = [];

// x, y, zのオブジェクトの配列をループ → 
for(let i = 0; i < nodes.length; i++){
  for(let j = i + 1; j < nodes.length; j++){
    // ✅ Math.hypot() ... 与えられた複数の値のユークリッド距離(直線距離)を算出
    // ここでは、最初の点と次の点との２点間の距離を求めている。
    const dist = Math.hypot(
      nodes[i].x - nodes[j].x,
      nodes[i].y - nodes[j].y,
      nodes[i].z - nodes[j].z
    );

    // console.log(dist);

    // ⭐️ TODO → 2.5を変更する。
    // if(dist < spacing * 2.5 && Math.random > 0.8){
    if(dist < spacing * 2.5 && Math.random() > 0.8){
      // console.log(nodes[i].x);
      linePositions.push(
        nodes[i].x, nodes[i].y, nodes[i].z,
        nodes[j].x, nodes[j].y, nodes[j].z,
      );

      lineColors.push(0, 0, 0, 1, 1, 1);
    }

  }
}

const lineMaterial = new THREE.LineBasicMaterial({
  vertexColors: true,
  transparent: true,
  opacity: 0.5,
});

const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);

scene.add(lineSegments);


renderer.render(scene, camera);