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

    console.log("TEST :::" + this.assets);
  }

}
export default SpriteTextureComponent;
