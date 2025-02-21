
// utils

import { PerspectiveCamera } from 'three';

export const utils = {
  lerp,
  resizeThreeCanvas,
  calcFov,
  debounce
}


// 線形補間 t...補完係数
function lerp(start, end, t, limit = .001) {
  let current = start * (1 - t) + end * t;
  // end と currentの中間値の値が.001未満になれば、endを返す(要調整)
  if (Math.abs(end - current) < limit) current = end;

  return current;
}

// リサイズ処理 camera, renderer, effectComposer
function resizeThreeCanvas({ camera, fov = null, renderer, effectComposer = null }) {
  if (camera instanceof PerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight

    if (fov) { camera.fov = fov }
  }

  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  if (effectComposer) {
    effectComposer.setSize(window.innerWidth, window.innerHeight)
  }
}

// fovを取得
// cameraの距離とウインドウの高さからcameraのfovを取得することで、canvasとhtmlのサイズが一致する
// atan → tanの逆で、辺の長さの比から角度を算出。tanは角度(radian)から比を算出   
// 180 / Math.PI → radianから度数法に変換
function calcFov(CAMERA_POS) {
  return 2 * (Math.atan((window.innerHeight / 2) / CAMERA_POS)) * 180 / Math.PI;
} 

// リサイズの時に指定した時間ごとに実行させる。パフォーマンス改善
// アロー関数にすることでthisが無視される
function debounce(func, timeout = 300){
  let timerId

  return (...args) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => { 
      func.apply(this, args) 
    }, timeout)
  }
}

