

module.exports = {
  plugins: [
    // 通常のcssで、ネストを処理できるようにする
    require('postcss-nested'),
  ]
};

// Parcelではデフォルトではネストのサポートをしていないのでプラグインを追加する
// ⭐️ parcel が PostCSS を組み込みでサポートしており、postcss-nested プラグインを適用することで
//    SCSS 風のネスト構文を CSS 内で使えるようになる
// Parcelはpostcssを自動的に検出して、postcss.config.jsが存在するとその設定を適用する
