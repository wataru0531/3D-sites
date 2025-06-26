
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  MeshBasicMaterial,
  Clock
} from 'three';
import gsap from 'gsap';
import MeshItem from './MeshItem';
import Loader from './js/Loader';

import { utils } from "/scripts/utils.js";


const canvas = document.getElementById('canvas');
const scene = new Scene()

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new PerspectiveCamera(
  35, 
  sizes.width / sizes.height,
  0.1, 
  2000
)
camera.position.set(0, 0, 1600)
scene.add(camera);

const renderer = new WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// const material = new MeshBasicMaterial(0xff0000)
const objectsDistance = sizes.height; // ビューポートの高さ

const mesh1 = MeshItem(1000, 667)
// console.log(mesh1);
const mesh2 = MeshItem(450, 581)
const mesh3 = MeshItem(553, 600)
const mesh4 = MeshItem(600, 600)

const sectionMeshes = [ mesh1, mesh2, mesh3, mesh4 ]

// meshの位置を調整(3Dの座表)
// → canvasの中央が(0, 0)。そこからy軸下にビューポートの高さ分ずらしていく
for (let i = 0; i < sectionMeshes.length; i++) {
    // sectionMeshes[i].position.y = -500 * i
    sectionMeshes[i].position.y = -objectsDistance * i
}

scene.add(mesh1, mesh2, mesh3, mesh4)

const loader = new Loader();

// テクスチャの読み込みが終わったら発火させるコールバックを渡す
// → texturesは、読み込んだテクスチャの配列が渡ってくる
loader.loadTextures((textures) => {
  // console.log(textures); // (4) [_Texture, _Texture, _Texture, _Texture]

  document.body.classList.remove("loading");

  for (let i = 0; i < sectionMeshes.length; i++) {
    // メッシュにテクスチャを渡す
    sectionMeshes[i].material.uniforms.uTexture.value = textures[i]
  }

  observeScroll();
  const section = Math.round(scrollY / sizes.height);
  // console.log(section); // 0 〜 4
  onSectionEnter(section);
  tick();
})


/**
 * Scroll
 */
let scrollY = window.scrollY
let currentSection = -1

// shift 
// let shift = 0;

function observeScroll() {
  // ⭐️TODO throttle入れてもいいかも
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY

    // ビューポートの高さに対してのスクロール量の比率
    // let newSection = scrollY / sizes.height;
    // console.log(sizes.height);
    // console.log(newSection);
    // ⭐️Math.round で 四捨五入することでセクション毎の数値が取得できる
    let newSection = Math.round(scrollY / sizes.height);
    // console.log(newSection);　0 1 2 3
    
    if (currentSection != newSection) {
      // console.log(currentSection);

      // 現在のセクションを1〜4で取得
      // shift += newSection - currentSection;
      // console.log(shift)

      currentSection = newSection;
      // console.log(currentSection);

      // uniform.uProgressを1にする
      onSectionEnter(newSection); 
    }
  })
}

// uniform.uProgressを1にする処理
function onSectionEnter(_section) {
  gsap.to(sectionMeshes[_section].material.uniforms.uProgress, {
      duration: 3.0,
      value: 1.0,
      ease: "power2.inOut"
    }
  )
}

/**
 * Tick
 */
// const clock = new Clock();
// console.log(clock); // Clock {autoStart: true, startTime: 0, oldTime: 0, elapsedTime: 0, running: false}

// let time = 0
let targetPosY = -scrollY; // メッシュのy軸の位置

function tick(){
  // const elapsedTime = clock.getElapsedTime();
  // console.log(elapsedTime);

  // const deltaTime = elapsedTime - time;
  // time = elapsedTime;

  // 下スクロールならマイナス、上ならプラスの値が返る → 3Dの-1から1の座標に合わす
  targetPosY = utils.lerp(targetPosY, -scrollY, 0.1);
  // console.log(targetPosY);

  camera.position.y = targetPosY;
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
}