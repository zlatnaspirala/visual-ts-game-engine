import IVisualComponent from "../../interface/visual-component";
import { getDistance } from "../math";
import Resources from "../resources";
import TextureComponent from "./texture";

/**
 * Objective :
 * new instance - bind
 * store and manipulate with image data!
 */
class SpriteTextureComponent extends TextureComponent {

  constructor(name: string, imgRes: string) {
    super(name, imgRes);
    if (name === undefined) {
      throw console.error("You miss first arg : name in SpriteTextureComponent instancing...");
    }
    if (imgRes === undefined) {
      throw console.error("You miss second arg : imgRes in SpriteTextureComponent instancing...");
    }
    console.log(this.assets);
  }

}
export default SpriteTextureComponent;
