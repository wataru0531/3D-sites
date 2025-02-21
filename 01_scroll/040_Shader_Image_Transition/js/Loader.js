

import {
	TextureLoader,

} from 'three';
import image1 from '../static/textures/01.webp'
import image2 from '../static/textures/02.webp'
import image3 from '../static/textures/03.webp'
import image4 from '../static/textures/04.webp'

export default class Loader {

	loadTextures(_callback) { // 
		const textureLoader = new TextureLoader();
		let loadCount = 0;

		const imageSources = [image1, image2, image3, image4];
		const textures = [];
		
		imageSources.forEach((src, idx) => {
			const onLoad = (_texture) => {
				textures[idx] = _texture; // texturesに格納していく
				// console.log(textures); // (4) [_Texture, _Texture, _Texture, _Texture]

				loadCount += 1;
				// console.log(loadCount); // 1 2 3 4
				if (loadCount == imageSources.length) {
					// console.log(loadCount);

					// 全ての読み込みが終わったら発火するコールバック
					_callback(textures);
				}
			}
			// console.log(onload);
			// 第2引数のonload → テクスチャの読み込みが終わったら発火
			textureLoader.load(src, onLoad);
		})
	}
}