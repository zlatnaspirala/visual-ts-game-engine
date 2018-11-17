import { ISpriteShema } from "../../interface/global";
import IVisualComponent from "../../interface/visual-component";
import { Counter, getDistance } from "../math";
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

/**
 * Class SpriteTextureComponent extends TextureComponent and override
 * main method drawComponent. We need to keep tiles system working!
 */
class SpriteTextureComponent extends TextureComponent {

  private shema: { byX: number, byY: number };
  private seqFrameX: Counter;
  private seqFrameY: Counter;

  constructor(name: string, imgRes: string | string[], shema: ISpriteShema) {
    super(name, imgRes);
    this.shema = shema;
    const localSumX = shema.byX - 1;
    const localSumY = shema.byY - 1;
    this.seqFrameX = new Counter(0, localSumX, 1);
    this.seqFrameY = new Counter(0, localSumY, 1);
    this.seqFrameX.setDelay(20);
    this.seqFrameY.onRepeat = this.nextColumn;
    this.seqFrameX.onRepeat = this.nextRow;
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
            0,
            0,
            12,
            12,
            originX - originW * (x),
            originY - originH * (j),
            originW,
            originH);

          /*
          ori
          c.drawImage(
            this.assets.getImg(),
            originX - originW * (x),
            originY - originH * (j),
            originW,
            originH)
            */
        }
      }
    } else {

      /**
       *  c.drawImage(
       *  this.assets.getImg(),
       *  this.assets.getImg().width * -part.render.sprite.xOffset * part.render.sprite.xScale,
       *  this.assets.getImg().height * -part.render.sprite.yOffset * part.render.sprite.yScale,
       *  this.assets.getImg().width * part.render.sprite.xScale,
       *  this.assets.getImg().height * part.render.sprite.yScale);
       */

      const sx = this.seqFrameX.getValue() * this.assets.getImg().width / this.shema.byX;
      const sy = this.seqFrameY.getRawValue() * this.assets.getImg().height / this.shema.byY;
      const sw = (this.assets.getImg().width) / this.shema.byX;
      const sh = (this.assets.getImg().height) / this.shema.byY;
      const dx = (this.assets.getImg().width * -part.render.sprite.xOffset * part.render.sprite.xScale);
      const dy = (this.assets.getImg().height * -part.render.sprite.yOffset * part.render.sprite.yScale);
      const dw = (this.assets.getImg().width * part.render.sprite.xScale);
      const dh = (this.assets.getImg().height * part.render.sprite.yScale);

      c.drawImage(
        this.assets.getImg(), sx, sy, sw, sh, dx, dy, dw, dh);
    }

  }

  private nextRow = () => {
    this.seqFrameY.setDelay(-1);
    this.seqFrameY.getValue();
  }

  private nextColumn() {
    // test
  }

}
export default SpriteTextureComponent;
