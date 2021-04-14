import { ISpriteShema } from "../../interface/global";
import IVisualComponent from "../../interface/visual-component";
import { Counter, getDistance } from "../math";
import Resources from "../resources";
import SpriteTextureComponent from "./sprite-animation";
import TextureComponent from "./texture";

/**
 * @description Class SpriteTextureComponent extends TextureComponent and override
 * main method drawComponent. We need to keep tiles system working!
 * Objective:
 * Store and manipulate with image texture data.
 * Render element - Tile, flip
 * void ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
 * JavaScript syntax: context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
 * Parameter Values
 * Parameter Description Play it
 * img Specifies the image, canvas, or video element to use
 * sx Optional. The x coordinate where to start clipping
 * sy Optional. The y coordinate where to start clipping
 * swidth	Optional. The width of the clipped image
 * sheight Optional. The height of the clipped image
 * x The x coordinate where to place the image on the canvas
 * y The y coordinate where to place the image on the canvas
 * width Optional. The width of the image to use (stretch or reduce the image)
 * height Optional. The height of the image to use (stretch or reduce the image)
 */
class SpriteStreamComponent extends SpriteTextureComponent {

  public streamTexture: any = null;

  constructor(name: string, imgRes: string | string[], shema?: ISpriteShema, streamTex?: HTMLVideoElement) {

    super(name, imgRes, shema);

    if (typeof streamTex !== "undefined") {
      this.streamTexture = streamTex;
    }

    // Override right here to prepare for spritesheet scenario of image drawing.
    (this.flipImage as any) = function (image, ctx, sx, sy, sw, sh, dx, dy, dw, dh, flipH, flipV) {
      const scaleH = flipH ? -1 : 1, scaleV = flipV ? -1 : 1;
      ctx.save();
      ctx.scale(scaleH, scaleV);
      ctx.drawImage(
        this.assets.getImg(), sx, sy, sw, sh, dx, dy, dw, dh);
      ctx.restore();
    };

  }

  /**
   * @description Override function drawComponent
   * from TextureComponent parent class.
   */
  public drawComponent(c: CanvasRenderingContext2D, part: any): void {

    if (this.keepAspectRatio === true) {

      const dist2 = getDistance(part.vertices[part.vertices.length / 2], part.vertices[part.vertices.length - 1]);
      const dist1 = getDistance(part.vertices[0], part.vertices[part.vertices.length / 2 - 1]);
      const originW = dist1 / this.verticalTiles * part.render.sprite.xScale;
      const originH = dist2 / this.horizontalTiles * part.render.sprite.yScale;
      let originX = dist1 * -part.render.sprite.xOffset * part.render.sprite.xScale;
      let originY = dist2 * -part.render.sprite.yOffset * part.render.sprite.yScale;
      originX = originX / this.verticalTiles - originW / 2;
      originY = originY / this.horizontalTiles - originH / 2;

      for (let x = -this.verticalTiles / 2; x < this.verticalTiles / 2; x++) {
        for (let j = -this.horizontalTiles / 2; j < this.horizontalTiles / 2; j++) {

          const sx = this.seqFrameX.getValue() * this.assets.getImg().width / this.shema.byX;
          const sy = this.seqFrameY.getRawValue() * this.assets.getImg().height / this.shema.byY;
          const sw = (this.assets.getImg().width) / this.shema.byX;
          const sh = (this.assets.getImg().height) / this.shema.byY;
          const dx = originX - originW * (x);
          const dy = originY - originH * (j);
          const dw = originW;
          const dh = originH;

          if (this.streamTexture !== null) {
             this.flipStream(this.streamTexture,
              c, sx, sy, sw, sh, dx, dy, dw, dh,
              this.horizontalFlip, this.verticalFlip);
          } else {
            (this.flipImage as any)(this.assets.getImg(),
              c, sx, sy, sw, sh, dx, dy, dw, dh,
              this.horizontalFlip, this.verticalFlip);
          }

        }

      }
    } else {

      const sx = this.seqFrameX.getValue() * this.assets.getImg().width / this.shema.byX;
      const sy = this.seqFrameY.getRawValue() * this.assets.getImg().height / this.shema.byY;
      const sw = (this.assets.getImg().width) / this.shema.byX;
      const sh = (this.assets.getImg().height) / this.shema.byY;
      const dx = (this.assets.getImg().width * -part.render.sprite.xOffset * part.render.sprite.xScale);
      const dy = (this.assets.getImg().height * -part.render.sprite.yOffset * part.render.sprite.yScale);
      const dw = (this.assets.getImg().width * part.render.sprite.xScale);
      const dh = (this.assets.getImg().height * part.render.sprite.yScale);

      if (this.streamTexture !== null) {

        c.drawImage(
          this.streamTexture,
          sx, sy, sw, sh, dx, dy, dw, dh);

      } else {

        c.drawImage(
          this.assets.getImg(),
          sx, sy, sw, sh, dx, dy, dw, dh);

      }
    }

  }

  public setStreamTexture(streamTexture: HTMLVideoElement): void {
    this.streamTexture = streamTexture;
  }

  private flipStream (image, ctx, sx, sy, sw, sh, dx, dy, dw, dh, flipH, flipV) {
    const scaleH = flipH ? -1 : 1, scaleV = flipV ? -1 : 1;
    ctx.save();
    ctx.scale(scaleH, scaleV);
    ctx.drawImage(
      image, sx, sy, sw, sh, dx, dy, dw, dh);
    ctx.restore();
  }

}
export default SpriteStreamComponent;
