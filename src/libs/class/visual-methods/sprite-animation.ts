import IVisualComponent from "../../interface/visual-component";
import { getDistance } from "../math";
import Resources from "../resources";
import TextureComponent from "./texture";

/**
 * Objective :
 * new instance - bind
 * store and manipulate with image data!
 */

 /*

    void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    JavaScript syntax:	context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
    Parameter Values
    Parameter	Description	Play it
    img	Specifies the image, canvas, or video element to use
    sx	Optional. The x coordinate where to start clipping
    sy	Optional. The y coordinate where to start clipping
    swidth	Optional. The width of the clipped image
    sheight	Optional. The height of the clipped image
    x	The x coordinate where to place the image on the canvas
    y	The y coordinate where to place the image on the canvas
    width	Optional. The width of the image to use (stretch or reduce the image)
    height	Optional. The height of the image to use (stretch or reduce the image)
  */
class SpriteTextureComponent extends TextureComponent {

  constructor(name: string, imgRes: string | string[]) {
    super(name, imgRes);

    console.log("TEST1 :::" + this.assets);
    console.log("TEST2 :::" + this.drawComponent);
  }

  // Override func
  public drawComponent(c: CanvasRenderingContext2D, part: any): void {

    // if (part.vertices.length === 4) {
    if (this.keepAspectRatio === false) {

      const dist1 = getDistance(part.vertices[0], part.vertices[1]);
      const dist2 = getDistance(part.vertices[0], part.vertices[3]);
      let originX = dist1 * -part.render.sprite.xOffset * part.render.sprite.xScale;
      let originY = dist2 * -part.render.sprite.yOffset * part.render.sprite.yScale;
      const originW = dist1 / this.verticalTiles;
      const originH = dist2 / this.horizontalTiles;
      originX = originX / this.verticalTiles - originW / 2;
      originY = originY / this.horizontalTiles - originH / 2;

      for (let x = -this.verticalTiles / 2; x < this.verticalTiles / 2; x++) {
        for (let j = -this.horizontalTiles / 2; j < this.horizontalTiles / 2; j++) {

          c.drawImage(
            this.assets.getImg(),
            originX - originW * (x),
            originY - originH * (j),
            originW,
            originH);

        }
      }
    } else {

      c.drawImage(
        this.assets.getImg(),
        this.assets.getImg().width * -part.render.sprite.xOffset * part.render.sprite.xScale,
        this.assets.getImg().height * -part.render.sprite.yOffset * part.render.sprite.yScale,
        this.assets.getImg().width * part.render.sprite.xScale,
        this.assets.getImg().height * part.render.sprite.yScale);
    }

  }
  
}
export default SpriteTextureComponent;
