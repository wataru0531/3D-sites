import { makeDebugContext } from "./webgl-debug.js";

let gl;

window.onload = startup;
function startup() {
  let canvas = document.querySelector("#canvas");
  gl = createGLContext(canvas);
  gl = makeDebugContext(gl);
  const shaderProgram = setupShaders();

  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      // 頂点データが格納されているインデックスを取得
      position: gl.getAttribLocation(shaderProgram, "aVertexPosition")
    }
  };
  programInfo.verticeNum = setupBuffers(programInfo);

  draw(programInfo);
}

/**
 * WebGLコンテキストの作成
 */
function createGLContext(canvas) {
  let ctx = canvas.getContext("webgl");
  if (ctx) {
    ctx.viewportWidth = canvas.width;
    ctx.viewportHeight = canvas.height;
  } else {
    alert("WebGLのコンテキストを生成できません。");
  }
  return ctx;
}

/**
 * シェーダーコードの読み込み
 */
function loadShader(type, shaderSource) {
  // fragment、またはvertexのシェーダータイプを指定
  const shader = gl.createShader(type);
  // シェーダーコードを指定
  gl.shaderSource(shader, shaderSource);
  // シェーダーコードをバイナリコードにコンパイル
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert("シェーダーの作成に失敗しました。" + gl.getShaderInfoLog(shader));
    // 問題のあるコードの場合は削除
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * シェーダーコードをWebGLコンテキストにバインド
 */
function setupShaders() {
  const vertexShaderSource = `
    precision mediump float;
    attribute vec2 aVertexPosition;

    void main() {
      vec2 p = aVertexPosition;
      gl_Position = vec4(p, 0.0, 1.0);
    }
    `;
  const fragmentShaderSource = `
    precision mediump float;

    void main() {
        gl_FragColor = vec4(0., 1., 0., 1.);
    }
  `;

  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  // プログラムの作成
  const shaderProgram = gl.createProgram();
  // プログラムにシェーダーをバインド
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  // vertexシェーダーとfragmentシェーダーをリンク
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("シェーダーのセットアップに失敗しました。");
  }

  return shaderProgram;
}

// 頂点データを格納するバッファを設定
function setupBuffers(pInfo) {
  // 頂点の数
  const verticeNum = 3;

  // 位置を管理する頂点の入れ物（バッファ）を作成
  const vertexPositionBuffer = gl.createBuffer();
  // 頂点の位置を指定（-1 ~ 1）
  const triangleVertices = [
    1, 0,
    -1, -1,
    -1, 1
  ];
  
  // ARRAY_BUFFERに頂点データを格納するバッファを紐づける
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
  // ARRAY_BUFFERバッファに頂点データをロードする
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  // シェーダーコード内から抽出された属性（attribute）と上記でアップした頂点データを紐づける
  gl.vertexAttribPointer(
    pInfo.attribLocations.position,
    triangleVertices.length / verticeNum,
    gl.FLOAT,
    false,
    0,
    0
  );

  // 属性を有効化する
  gl.enableVertexAttribArray(pInfo.attribLocations.position);

  return verticeNum;
}

// 画面描写
function draw(pInfo) {
  // WebGLのコンテキストとキャンパスのサイズを同じにする。
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  // 背景色を特定の色で指定（0~1のrgbaで指定）
  gl.clearColor(0, 0, 0, 1);
  // 上記で指定した背景色を描写
  gl.clear(gl.COLOR_BUFFER_BIT);
  // WebGLのコンテキストが使用するプログラムを指定
  gl.useProgram(pInfo.program);
  // ARRAY_BUFFERに格納されている頂点を元に画面描写
  gl.drawArrays(gl.TRIANGLES, 0, pInfo.verticeNum);
}
