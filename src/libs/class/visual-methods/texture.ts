import IVisualComponent from "../../interface/visual-component";
import { getDistance } from "../math";
import Resources from "../resources";

/**
 * Objective :
 * new instance - bind
 * store and manipulate with image data!
 */
class TextureComponent implements IVisualComponent {

  public assets: Resources = new Resources();
  public keepAspectRatio: boolean = false;
  protected verticalTiles: number = 1;
  protected horizontalTiles: number = 1;

  protected horizontalFlip: boolean = false;
  protected verticalFlip: boolean = false;

  constructor(name: string, imgRes: string | string[]) {

    if (name === undefined) {
      throw console.error("You miss first arg : name in TextureComponent instancing...");
    }
    if (imgRes === undefined) {
      throw console.error("You miss second arg : imageRes in TextureComponent instancing...");
    }
    if (typeof imgRes !== "string") {
      if (imgRes.length > 1) {
        this.assets.insertImgs(name, imgRes);
      } else {
        this.assets.insertImg(name, imgRes[0]);
      }
    } else {
      this.assets.insertImg(name, imgRes);
    }
  }

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

  public setVerticalTiles(newVerticalTiles: number) {
    this.verticalTiles = newVerticalTiles;
    return this;
  }

  public setHorizontalTiles(newHorinzontalTiles: number) {
    this.horizontalTiles = newHorinzontalTiles;
    return this;
  }

  public setHorizontalFlip(newStatus: boolean) {
    this.horizontalFlip = newStatus;
  }

  public setVerticalFlip(newStatus: boolean) {
    this.verticalFlip = newStatus;
  }

}
export default TextureComponent;
