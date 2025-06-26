
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const utils = {
  lerp,
  distance,
  lineEq,

  setTransform,
  delay,
  reduceText,
  splitTextIntoSpans,
  wrapElements,
  random,
  getRandomFloat, // ⭐️new
  generateRgb,
  generateHex,

  isDevice,
  isTouchDevices,
  shuffleArrayAsync,
  wrap,
  mapRand,
  mapRange,
  setRange,
  animateCounter,
  debounce,
  isCssVariablesSupported,
  isInViewport,

  loadImage,
  preloadImages,
  generateImageUrls,
  fetchJsonData,
  initLenis,
  preloadFonts,
  getCSSVariableValue,
  
  getMousePosClient,
  getMousePosPage,
  getClipPos,
  getMapPos,
  calculateWindowSize,
  calculateInitialTransform,

  easeInOut,
  clamp,
  // map, // ⭐️mapRange に変える
  getAllProperties,
  AutoBind,
  getRandomString,

}

// ランダムな文字列を取得
function getRandomString(_length){
  let result = "";
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  // console.log(characters.length); // 62

  for(let i = 0; i < _length; i++){
    // charAt() → 文字列の指定した位置(インデックス)にある1文字を取得
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // console.log(result);
  return result;
}

// 要素の一部分でもビューポートに入っていれば true を返す処理
function isInViewport(elem){
  // console.log(elem)
  const { top, bottom, right, left } = elem.getBoundingClientRect();
  // console.log(top) // ページの上から要素のtopまで
  // console.log(bottom); // ページの上から要素のbottomまでの長さ
  // console.log(right); // ページの左から要素の右まで
  // console.log(left); // ページの左から要素の左まで

  return (
    ( 
      // bottom が0以上、かつ、bottom がビューポートの高さ以下の時、または、
      // top が0以上、かつ、top がビューポートの高さ以下の時
      bottom >= 0 && bottom <= (window.innerHeight || document.documentElement.clientHeight) || 
      top >= 0 && top <= (window.innerHeight || document.documentElement.clientHeight)
    ) &&
    (
      // rightが0以上、 かつ、ビューポートの幅より小さい時 または、
      // leftが0以上、かつ、ビューポートの幅より小さい時
      right >= 0 && right <= (window.innerWidth || document.documentElement.clientWidth) || 
      left >= 0 && left <= (window.innerWidth || document.documentElement.clientWidth)
    )
  );
};

// CSS変数がサポートされているかどうかをチャックする関数
function isCssVariablesSupported() {
  // window.CSS → ブラウザで利用可能なCSSオブジェクトを参照
  //              ブラウザがCSSOM(CSS Object Model)をサポートしているかどうかを示すオブジェクト
  // 　　　　　　　　古いブラウザや、一部の特定環境では window.CSS が存在しない場合がある
  // window.CSS.supports → 引数として与えた CSS のプロパティと値が現在のブラウザでサポートされているかをチェック
  //                         つまり、CSS変数をサポートしているかどうかを検証している
  if (!window.CSS || typeof window.CSS.supports !== 'function') {
      console.warn("CSS.supports is not available in this browser.");
      return false;
  }

  // CSS変数のサンプル
  const testVariable = '--dummy-variable';
  const testValue = 'test-value';

  try {
      // CSS変数の方がブラウザでサポートされているかどうかを検証
      // → あくまでもこの形式がサポートされているかどうかを検証するのであり、値までもは検証していない
      return window.CSS.supports(`${testVariable}: ${testValue}`);
  } catch (error) {
      console.error("An error occurred while checking CSS variable support:", error);
      return false;
  }
}

// Webフォントローダーで非同期でフォントを読み込む
// <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script> が必要
// → Google Fonts、Adobe Fonts、または他のカスタムフォントに対応
//   adobeフォント: id、googleフォント: 配列で渡ってくる
// 使用例: Promise.all([preloadImages('.画像のクラス'), preloadFonts('rmd7deq', ['Roboto', 'Lato'])]).then(() => {}
function preloadFonts(_adobeId, _googleFamilies = []) {
  return new Promise((resolve, reject) => {
    if (!_adobeId && _googleFamilies.length === 0) {
      return reject(new Error('No fonts specified for preload.'));
    }

    const webFontConfig = {};

      // Google Fontsの設定
    if (_googleFamilies.length > 0) {
      webFontConfig.google = { families: _googleFamilies };
    }

    // Adobe Fontsの設定
    if (_adobeId) {
      webFontConfig.typekit = { id: _adobeId };
    }

    // フォントのロード設定
    webFontConfig.active = resolve; // ロードが完了して、activeになったら解決
    webFontConfig.inactive = () => {
      reject(new Error('Font loading failed.'));
    };

    try {
      WebFont.load(webFontConfig);
    } catch (error) {
      reject(new Error(`An error occurred while loading fonts: ${error.message}`));
    }
  });
}


// 指定されたオブジェクトの全てのプロパティ(メソッドなど)を、プロトタイプチェーンを遡って取得する関数
// →　ただし、最後のObjectのプロパティは取得しない。
// 最終的に、指定されたオブジェクトとそのすべての親プロトタイプオブジェクトに存在するプロパティのリストを 
// Set に格納し、返します。
function getAllProperties(object){
  // console.log(object); // {createPreloader: ƒ, createRenderer: ƒ, createCamera: ƒ, createScene: ƒ, createGeometry: ƒ, …}
  // → Canvasクラスのメソッドやプロパティが入る(クラスに定義したメソッドはprototypeに入る)

  const properties = new Set();
  // console.log(properties)

  // 現在のオブジェクト の プロトタイプチェーン全体 を走査する
  // do { } while { } 
  // → do...while ループ構文で、特定の処理を繰り返し実行するための制御フロー文。
  //   少なくとも1回は処理を実行し、その後にループを継続するかどうかを条件に基づいて判断する
  // 処理のフロー → ①まず、do 内のコードブロックが1回実行される
  //              ②do ブロックの後に、while の条件が評価
  //                条件が 真 (true) であれば、再び do ブロックが実行
  //                条件が 偽 (false) になるまで繰り返される
  do {
    // Reflect →　主にオブジェクトの操作を行うための静的メソッドを提供
    // Reflect.ownkeys → オブジェクトの「全てのプロパティの名前（キー）」を取得するためのメソッド
    // ⭐️プロトタイプのオブジェクトのさらにプロトタイプには遡っては取得しない
    // console.log(Reflect.ownKeys(object));
    for (const key of window.Reflect.ownKeys(object)) {
      // console.log(key); // constructor createPreloader createRenderer createCamera createScene createGeometry createMedias onResize easeInOut onTouchDown onTouchMove onTouchUp onWheel update addEventListeners
      // [プロトタイプのオブジェクト, プロパティ] という感じ
      properties.add([object, key]);
    }
    // console.log(properties); // Set(15) {Array(2), Array(2), Array(2), Array(2), Array(2), …}

    // 繰り返しの条件 → trueならdoブロックを実行
    // ①object = Reflect.getPrototypeOf(object)) → objectにプロトタイプを代入
    // ②object !== Object.prototype →　そのobjectがObject.prototypeに達したかどうかを判定
    // → objectは最上位のprototypeオブジェクトとなっているので、falseが返るので1度でループ終了

    // console.log(Reflect.getPrototypeOf(object)); // objectのさらに遡ったプロトタイプのオブジェクト
    // console.log(Object.prototype); // すべてのオブジェクトが共有する最上位のプロトタイプ
    // {__defineGetter__: ƒ, __defineSetter__: ƒ, hasOwnProperty: ƒ, __lookupGetter__: ƒ, __lookupSetter__: ƒ, …}
    // → Object.prototype のこと。これが出るまでループ継続。
  } while ((object = Reflect.getPrototypeOf(object)) && object !== Object.prototype);

  // console.log(properties); // Set(15) {Array(2), Array(2), Array(2), Array(2), Array(2), …}
                              // こんな感じ → [{createPreloader: ƒ, createRenderer: ƒ, …}, "constructor"]
  return properties;
};

// クラスのインスタンス (self) のメソッド内のthisを、自動的にそのインスタンス自身にバインドするための関数
// → メソッドがインスタンス外で呼び出されても this が適切にそのインスタンスを指すようになる
// include → バインドしたいメソッドだけを指定する。配列内に指定した名前のメソッドだけがバインドされる
//           AutoBind(instance, { include: ["sayHello", "sayGoodbye"] });
// exclude → バインドしたくないメソッドを除外する。配列内に指定した名前のメソッドをバインド対象から除外
//           AutoBind(instance, { exclude: ["initialize", "destroy"] });
// ⭐️ここでは全て通してtrueを返す。
function AutoBind(self, { include, exclude } = {}) {
  // console.log(self); // Canvas {images: Array(11), scroll: {…}}
  // console.log(self.constructor.prototype); // {createPreloader: ƒ, createRenderer: ƒ, createCamera: ƒ, createScene: ƒ, createGeometry: ƒ, …}
  // → selfのprototypeのObjectオブジェクト

  // key が include または exclude の条件に一致する場合に、その key が対象となるかを決める
  const filter = (key) => {
    // console.log(key); // createPreloader createRenderer createCamera createScene createGeometry createMedias onResize easeInOut onTouchDown onTouchMove onTouchUp onWheel update addEventListeners
    
    // someのコールバックに渡される。
    const match = (pattern) => { // pattern には、include/exclude の配列の要素が渡ってくる(ここでは指定なし。)
      // console.log(pattern)
      // key === patten →　key と patternが等しいか
      // patten.test(key) → patternが正規表現オブジェクトである場合に、keyがその正規表現にマッチするかどうかを判定
      return typeof pattern === "string" ? key === pattern : pattern.test(key);
    }

    if (include) {
      // some → 配列内の 少なくとも1つの要素 が指定した条件を満たしているかどうかをチェックする
      // return したらここでこのfilter関数自体が終了する
      return include.some(match);
    }

    if (exclude) {
      return !exclude.some(match);
    }

    return true;
  };

  // console.log(getAllProperties(self.constructor.prototype)); // .Set(15) {Array(2), Array(2), Array(2), Array(2), Array(2), …}
  for (const [object, key] of getAllProperties(self.constructor.prototype)) { // selfのプロトタイプのオブジェクト
    // console.log(object, key); // objectのプロトタイプオブジェクトと、プロパティ名

    // keyがconstructor、
    // console.log(filter(key)); // 全てtrueが返る
    if (key === "constructor" || !filter(key)) {
      // console.log("continue"); // constructorのみ通す

      // return; // returnはもうここでこのfor文自体が終わる
      continue; // ループ内で現在の反復処理をスキップし、次の反復処理に移る
    }

    const descriptor = Reflect.getOwnPropertyDescriptor(object, key);
    // console.log(descriptor); // { writable: true, enumerable: false, configurable: true, value: ƒ }
    if (descriptor && typeof descriptor.value === "function") {
      // 各メソッドをバインドする
      self[key] = self[key].bind(self);
      // Canvas[createPreloader] = Canvas[createPreloader].bind(Canvas)
      // → このような形で、createPreloader()を実行すれば、createPreloaderの中のthis.は全てCanvasを参照する
    }
  }

  return self;
}

// 数値をある範囲から別の範囲に変換する関数
// 使い方: num を min1〜max1 の範囲から、min2〜max2 の範囲に変換する
// 例えば、[0, 100] の値を [0, 1] に正規化したり、逆に [0, 1] を [0, 100] に拡張できる
export function mapRange(num, min1, max1, min2, max2, round = false) {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;

  if (round) return Math.round(num2);

  return num2;
}


// 数値を特定の範囲内に制限する関数
// 使い方: number を min（最小値）と max（最大値）の範囲に収める
// 範囲外の値は、最小値または最大値に丸められる
// clamp(0, 100, 50);  // 50 (範囲内)
// clamp(0, 100, -10); // 0 (最小値)
export function clamp(min, max, number) {
  return Math.max(min, Math.min(number, max));
}


// イージング（動きの滑らかさ）を制御する関数。
// 使い方: t（0〜1の範囲）を使い、動きの加速・減速を滑らかにする
// 最初と最後がゆっくり、中間が速い動きを生成する
function easeInOut(t){
  return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}


// 各要素を、ラップする処理
// elems ... [span.char, span.char, span.char, span.char, span.char, span.char, span.char, span.char, span.char]
// wrapType ... 文字をラップした要素
// wrapClass ... それに付与したいクラス
function wrapElements(elements, wrapType, wrapClass){
  elements.forEach(element => { // .element
    const wrapElement = document.createElement(wrapType);
    wrapElement.classList = wrapClass; 
    
    // console.log(element.parentNode); 
    element.parentNode.appendChild(wrapElement);
    wrapElement.appendChild(element);
  });
}


// ウインドウサイズを取得
function calculateWindowSize(){
  return {
    width: window.innerWidth,
    height: window.innerHeight
  }
}

// 各画像をx, y, z軸方向に動かす値、回転する角度を返す処理
// →　ランダムではなく、一定の基準に基づいて均等に動かす
//    例: ビューポート中央から遠い画像ほど、移動距離や回転する値が大きくなる
function calculateInitialTransform(element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) {
  const viewportCenter = { // ビューポートの中央
    width: window.innerWidth / 2, 
    height: window.innerHeight / 2 
  };

  const elementCenter = { // 格納その中央の座表
    // offsetLeft → ビューポートの左側からの距離
    x: element.offsetLeft + element.offsetWidth / 2, 
    y: element.offsetTop + element.offsetHeight / 2 
  };
  // console.log(element.offsetLeft); 
  // console.log(element.offsetTop); // 親要素(.grid_img)の上端からの距離

  // 中央(0, 0)から各画像までの角度を算出
  // atan → 長さの比から角度を算出。tanは角度から比を算出する
  //        計算される角度は -π から π の範囲で、-180° から 180° まで
  const angle = Math.atan2(
    Math.abs(viewportCenter.height - elementCenter.y), 
    Math.abs(viewportCenter.width - elementCenter.x),
    // viewportCenter.height - elementCenter.y, 
    // viewportCenter.width - elementCenter.x
  );
  // console.log(angle); 

  // 画像の角度に合わせて、x軸、y軸の位置を設定し、250をかけて移動距離を決定
  const translateX = Math.abs(Math.cos(angle) * offsetDistance);
  const translateY = Math.abs(Math.sin(angle) * offsetDistance);

  // ビューポートの中央から角四方までの距離
  // Math.pow(2, 3) → べき乗。2*2*2 のこと
  // console.log(Math.pow(viewportCenter.width, 2)); // 250000
  const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));

  // 中央から各画像までの距離
  const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));

  // ビューポート中央から各画像の中央までの距離に対する、最大距離の比率。0 〜 1
  const distanceFactor = currentDistance / maxDistance;

  // 回転角度を決定
  // 中央から離れている要素ほど大きく回転する
  // x軸に対する回転 → 要素のy軸を
  // rotationX: マイナスなら手前側に回る
  // rotationY: マイナスなら、左に回る
  const rotationX = ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor);
  const rotationY = ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor);

  // z軸方向への値。2000をかけているだけ
  const translateZ = maxZTranslation * distanceFactor;

  // 各画像をx, y, z軸方向に動かす値、回転する角度を返す
  return {
    // 中央より右側の画像はプラス、左側の画像はマイナスに
    x: elementCenter.x < viewportCenter.width ? -translateX : translateX,
    y: elementCenter.y < viewportCenter.height ? -translateY : translateY,
    z: translateZ,
    rotateX: rotationX,
    rotateY: rotationY
  };
};


// そのCSSに設定されているcssの値を取得
function getCSSVariableValue(_element, _variableName) {
  return getComputedStyle(_element).getPropertyValue(_variableName).trim();
};


// マウスの位置を取得
function getMousePosClient(e) {
  return { x : e.clientX,  y : e.clientY };
};


function getMousePosPage(e){
  return { x: e.pageX, y: e.pageY }
}

// クリップ座標  中央が(0, 0)で、-1 〜 1 で返す
function getClipPos(e) {
  return {
    x:   ( e.clientX / viewport.width  ) * 2 - 1,
    y: - ( e.clientY / viewport.height ) * 2 + 1,
  };
}

// 中央が(0, 0)で、座標を返す処理
function getMapPos(_width, _height){
  // console.log(_width, _height); // 256.8 187.6
  const clipPos = getClipPos();
  // console.log(clipPos);

  return {
    x: clipPos.x * _width / 2,
    y: clipPos.y * _height / 2
  }
}


function initLenis(options = {}) {
  // Lenisとgsap(ScrollTrigger)の更新を連動させる仕組みを構築
  // gsapの内部のtickerが独自に動く仕組みになっていて、それをlenisと同期していく
  const lenis = new Lenis(options);

  // Lenisでスクロールが発生するたびに、ScrollTrigger.updateを発火させる
  // この設定により、スクロール位置の変化に合わせてScrollTriggerが更新され、アニメーションが同期して動作する
  lenis.on('scroll', ScrollTrigger.update)

  // gsap.ticker.add → gsapのタイムライン(gsap内部で起きている独自の更新のタイミング)にLenisのrafメソッドを追加
  // → gsapのアニメーション更新タイミングとLenisのスクロール更新タイミングが同期され、スムーズにスクロールとアニメーションが連動
  //   ここではgsapのタイミングに合わせてLenisのスクロール状態も更新されるようにしている
  gsap.ticker.add((time)=>{   // lenis.raf() → Lenisのスクロールアニメーションを更新
    // console.log(time)
    lenis.raf(time * 1000)
  });

  // lagSmoothing(0) → gsapのtickerのラグ(遅れ)を調整する機能を無効化
  // → gsapはフレームレートが低下してラグが発生した場合に、アニメーションが一時的にカクつかないように、ある程度の範囲で自動補正を行う
  //   デフォルト設定では、フレームレートが大きく落ち込んだときにアニメーションをリセットしたり、スムーズさを保つために動作を調整したりしている
  //   Lenisとの連携では、補正がかかるとスクロールやアニメーションの同期が崩れることがあるため、この設定でスムーズに動作するようgsapのこの機能を無効化している
  // この設定により、スクロールやアニメーションに遅延が発生した場合でも、突然のリセットやカクつきが発生しないようにしている
  gsap.ticker.lagSmoothing(0);
};


// デバウンス
// → リサイズやホイールのイベントなどで最終的な1回の処理を実行する処理
// 　 例えばリサイズが止まった時にだけ発火する
//    return function(){} → この部分がイベントにコールバックとして登録され、
//    _callbackが実行される
function debounce(_callback, _delay){
  let timerId = null;

  return function(...args) {
    if(timerId) clearTimeout(timerId);
    // console.log(timerId)

    timerId = setTimeout(() => {
      // console.log(timerId)
      // console.log(...args) // イベントオブジェクト
      // console.log(this); // 呼び出し元を参照する

      _callback.apply(this, args); // thisのコンテキストを使いたい場合
    }, _delay);
  }
}


// jsonデータを非同期で取得する処理
// _url → パス
// _variableName → データの変数名。dataはオブジェクトで取得できるため
async function fetchJsonData(_url, _variableName){
  try{
    const jsonData = await fetch(_url);
    // console.log(data); // Response {type: 'basic', url: 'http://127.0.0.1:5500/data.json', redirected: false, status: 200, ok: true, …}
    
    // json() → 非同期にJSONデータを読み込み、その結果をPromiseオブジェクトとして返す
    //          JSON文字列をオブジェクトに変換
    // await  → Promiseを解決。内部的にはresolveが発火
    const data = await jsonData.json();
    // console.log(galleryItems)

    return data[_variableName];
  }catch(error){
    console.error("データの取得に失敗", error);
  }
}

// 画像を生成(imgタグ)し、画像のロードの完了を待つ関数
// → srcで読み込みが始まり、完了したらonload発火 → resolve発火でimgを返す
function loadImage(_src){
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      console.error(`Failed to load image: ${_src}`, err);
      reject(err);
    };
    img.src = _src;
  })
}

// CSSの背景画像を含めた画像の読み込みが終わるまで待機する関数
// loading時に使う関数なので画像などは返さない
function preloadImages(_selector = 'img') {
  const elements = [...document.querySelectorAll(_selector)];
  // console.log(elements); // NodeList(79) [div.grid__item-img, ...]
  const imagePromises = [];

  elements.forEach((element) => {
    // 背景画像の場合
    // console.log(getComputedStyle(element)); // 指定した要素に適用されているスタイルを表すオブジェクト
    const backgroundImage = getComputedStyle(element).backgroundImage;
    // console.log(backgroundImage);
    // url("image.jpg")、url('image.jpg')、url(image.jpg) にマッチさせる
    const urlMatch = backgroundImage.match(/url\((['"])?(.*?)\1\)/);
    // console.log(urlMatch); // (3) ['url("http://127.0.0.1:5501/images/1.avif")', '"', 'http://127.0.0.1:5501/images/1.avif', index: 0, input: 'url("http://127.0.0.1:5501/images/1.avif")', groups: undefined]
    if (urlMatch) {
      const url = urlMatch[2];
      imagePromises.push(utils.loadImage(url)); 
    }
    // console.log(element.tagName); // div
    if (element.tagName === 'IMG') { // img要素の場合の処理
      // console.log("img")
      const src = element.src;
      // console.log(src)
      if (src) {
        imagePromises.push(utils.loadImage(src));
      }
    }
  });

  return Promise.all(imagePromises);
}

// 画像のurlの配列を生成
// const images = utils.generateImageUrls({ _length: 24, _range: 20, _extension: "avif" })
function generateImageUrls({ _length, _path = "./images", _range, _extension }){
  return Array.from({ length: _length }, (_, idx) => {
    const fileIndex = (idx % _range) + 1;
    return `${_path}/${fileIndex}.${_extension}`;
  })
}

// 線形補間 t...補完係数
function lerp(start, end, t, limit = .001) {
  let current = start * (1 - t) + end * t;

  // end と currentの中間値の値が.001未満になれば、endを返す(要調整)
  if (Math.abs(end - current) < limit) current = end;

  return current;
}
// console.log(lerp(10, 15, 0.9991));

// 2点間の距離を取得
function distance(x2, x1, y2, y1) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Math.sqrt() ... 与えられた数値の平方根を返す。スクエアルート
  return Math.sqrt(dx * dx + dy * dy);
  // return Math.hypot(a, b); と同じ
}
// console.log(distance(0, 0, 3, 4)); // 5 (3-4-5の三角形)


// 「2点(x1, y1)と(x2, y2)を通る直線上における、任意のx(=currentVal)に対するyを求める関数」
// → 算出する値は別にy1　〜 y2に収まるものではないし、２点をいれるのは単に傾きと切片を得るためだけ。
// line equation → 直線の方程式
// this.dmScale = Math.min(lineEq(50, 0, 140, 0, mouseDistance), 50);
function lineEq(x2, x1, y2, y1, currentVal){
  // y = mx + b

  const m = (y2 - y1) / (x2 - x1); // 傾き
                                 //  →　この値が大きければ大きいほど返る値が大きくなる。
  // console.log(m); // 2.8
  
  const b = y1 - m * x1; // 切片
  // console.log(b); // ここでは、0
  
  return m * currentVal + b;
};

// transformを付与。_elはDOM
function setTransform(_el, _transform) {
  _el.style.transform = _transform;
}

// 与えた秒数、処理を遅らせる。ms
function delay(time){
  return new Promise(resolve => setTimeout(resolve, time))
}


// 文字をspanでラップする関数
// const splitTexts = element.innerHTML.trim().split("");
// → 文字の配列を引数にわたす
function reduceText(_splitTexts){
  // console.log(typeof _splitTexts)
  return _splitTexts.reduce((accu, curr) => {
    // console.log(accu, curr)
    curr = curr.replace(/\s+/, "&nbsp;")

    // return accu + curr
    return `${accu}<span class="char">${curr}</span>`
  }, "")
}

// 文字列をspanでラップして返す関数
function splitTextIntoSpans(_selector){
  let elements = document.querySelectorAll(_selector);
  elements.forEach(element => {
    let text = element.innerText;
    // console.log(text); // Front
    // console.log(text.split("")); // (5) ['F', 'r', 'o', 'n', 't']
    
    // 1文字づつspanで返して配列で格納。.joinで連結
    let splitTexts = text.split("").map(char => {
      return `<span>${char === " " ? "$nbsp;" : char}</span>`
    });
    // console.log(splitTexts); // (5) ['<span>F</span>', '<span>r</span>', '<span>o</span>', '<span>n</span>', '<span>t</span>']
    
    let joinedTexts = splitTexts.join("");
    // console.log(joinedTexts); // <span>F</span><span>r</span><span>o</span><span>n</span><span>t</span>

    element.innerHTML = joinedTexts;
  });
}

// ランダムな整数値を取得
function random(min, max) {
  const num = Math.floor(Math.random() * (max - min)) + min;
  // console.log(num)
  return num;
}

// ランダムな値を小数で取得
function getRandomFloat(min, max, decimals = 2) {
  const num = Math.random() * (max - min) + min;

  return Number(num.toFixed(decimals)); // toFixedは文字列になるので数値型にして返す
}

// rgbカラーコードを生成
function generateRgb() {
  return `rgb(${random(0, 255)}, ${random(0, 255)}, ${random(0, 255)})`;
}

// 16進数のカラーコードを生成
function generateHex(){
  const letters = "0123456789ABCDEF"; // ※letters ... 文字の意味
  let hash = "#";

  for(let i = 0; i < 6; i++){
    // Math.floor()  ... 小数点切り捨て
    // Math.random() ... 0以上〜1未満の範囲で乱数を生成。
    // Math.random() * 16 とすることで、0〜15までの数値がランダムで生成される。

    // lettersの中からランダムに文字列を取得して#以下を選択
    hash += letters[Math.floor(Math.random() * 16)];
  }

  return hash;
}


// モバイルデバイスかタブレットだったらtrueを返す。PCだったらfalseを返す
function isDevice() {
  const ua = window.navigator.userAgent;
  // console.log(ua) // Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36
  
  // 検索対象の文字列や配列の中で、特定のサブ文字列や要素が最初に現れる位置を返す。見つからなかった場合は-1を返す。
  // console.log(ua.indexOf("iPhone")) // -1
  // if(ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 || ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0){
  //   return 'mobile';
  // }else if(ua.indexOf('iPad') > 0 || ua.indexOf('Android') > 0){
  //   return 'tablet';
  // }else{
  //   return 'desktop';
  // }

  const isMobile = (ua.indexOf('iPhone') > -1 || ua.indexOf('iPod') > -1 || ua.indexOf('Android') > -1 && ua.indexOf('Mobile') > -1);
  const isTablet = (ua.indexOf('iPad') > -1 || ua.indexOf('Android') > -1);
  if(isMobile || isTablet) return true;

  return false;
}

// タッチデバイスかどうか判定
function isTouchDevices(){
  const isTouchDevices = Boolean(
    "ontouchstart" in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  );

  return isTouchDevices;
}

// 配列の要素をランダムにシャッフル。
// Fisher-Yates（フィッシャー・イェーツ）アルゴリズム
async function shuffleArrayAsync(_array){
  // console.log(_array)
  const newArray = _array.slice(); // 複製。元の配列には影響なし

  // 配列全体を後ろからループ
  // console.log(_array.length - 1) // 4 最後の要素を取得
  // i > 0 ... i が 0までループを継続。つまり、indexが0の時終了。
  for(let i = newArray.length - 1; i >= 0; i--){
    // 配列のインデックスをランダムに返す。0から
    const randomIndex = Math.floor(Math.random() * (i + 1)); // floor 少数切り捨て
    // console.log(i, randomIndex) // インデックス、ランダムな数値
    
    // ここで配列の要素の回数ループを回し、要素を入れ替える。
    [newArray[i], newArray[randomIndex]] = [newArray[randomIndex], newArray[i]];
    await new Promise(resolve => setTimeout(resolve, 0)); // 確実に待つ
    // console.log(newArray)
  }

  return newArray;
}



// インデックスが範囲を超えた場合に適切にラップする関数
// 配列が[0, 1, 2]とあったとして、4のインデックスに増えるところを次のインデックスを0にする
// -1、+1になるところを配列のlength-1にわわせることができる
// gsap.utils.wrapのバニラ版
function wrap(current, min, max) {
  const range = max - min; // range 3

  return ((current - min) % range + range) % range + min;
}

// 最小値から最大値までのランダムな値を取得
function mapRand(min, max, isInt = false) {
  // Math.random 0 〜 1未満
  // Math.round  四捨五入
  let rand = Math.random() * (max - min) + min;
  rand = isInt ? Math.round(rand) : rand; // Math.round 四捨五入

  return rand;
}


// 数値をある範囲から別の範囲に変換する関数
// 使い方: num を min1〜max1 の範囲から、min2〜max2 の範囲に変換する
// 例えば、[0, 100] の値を [0, 1] に正規化したり、逆に [0, 1] を [0, 100] に拡張できる
function mapRange(num, min1, max1, min2, max2, round = false) {
  const num1 = (num - min1) / (max1 - min1);
  const num2 = num1 * (max2 - min2) + min2;

  if(round) return Math.round(num2);

  return num2;
}


// ✅-数値 〜　数値　の範囲の配列のオブジェクトにする
// 例:
// 引数 {x: 30, y: 20, z: 0} → {x: [-30, 30], y: [-20, 20], z: [0, 0]};
function setRange(obj){
  for (let k in obj) {
    if (obj[k] == undefined) {
      obj[k] = [0, 0];
    } else if (typeof obj[k] === "number") {
      obj[k] = [-1 * obj[k], obj[k]];
    }
  }
};


// カウンター
function animateCounter(_counterElement, _callback){
  const counterElement = document.querySelector(_counterElement);

  let currentValue = 0;
  const updateInterval = 200;
  const maxDuration = 2000;
  const endValue = 100;
  const startTime = Date.now(); // Date.now() → 1970年1月1日00:00:00 UTC」から数えたミリ秒の経過時間
  // console.log(startTime);

  function updateCounter(){
    const elapsedTime = Date.now() - startTime;
    // console.log(elapsedTime); // 
    
    // 経過時間が2000ms未満だったらカウントを増加し続ける
    if (elapsedTime < maxDuration) {
      currentValue = Math.min(
        currentValue + Math.floor(Math.random() * 30) + 10, // 最低でも8は保証
        endValue
      );
      counterElement.textContent = currentValue;
      setTimeout(updateCounter, updateInterval);

    } else {
      // maxDuration後に行いたい処理
      counterElement.textContent = currentValue;

      setTimeout(() => {
        gsap.to(counterElement, {
          y: -20,
          duration: 1,
          ease: "power4.inOut",
          onStart: () => {
            _callback(); // 
          }
        })
      }, -500);
    }
  }

  updateCounter()

}
