import IVisualComponent from "../../interface/visual-component";
import {getDistance} from "../math";
import Resources from "../resources";

/**
 * Objective :
 * new instance - bind
 * store and manipulate with image data!
 */
class TextureComponent implements IVisualComponent {

  public assets: Resources = new Resources();
  public keepAspectRatio: boolean = false;
  private verticalTiles: number = 1;
  private horizontalTiles: number = 1;

  constructor(imgRes: string | string[], name?: string) {

    let id: string = "tex0";
    if (name) { id = name; }
    if (typeof imgRes !== "string" ) {
      if (Array.isArray(imgRes)) {
        this.assets.insertSerial(imgRes);
      } else {
        console.warn("WTF");
      }
    } else {
       this.assets.insertImg(id, imgRes);
    }

  }

  public generate() {}

  public drawComponent(c: CanvasRenderingContext2D, part: any): void {

   // if (part.vertices.length === 4) {

      if (this.keepAspectRatio == false) {
      // console.log("aa");
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
          this.assets.getImg("tex1"),
          originX - originW * (x),
          originY - originH * (j),
          originW,
          originH);

          }
      }
    } else {

      c.drawImage(
        this.assets.getImg("tex1"),
        this.assets.getImg("tex1").width * -part.render.sprite.xOffset * part.render.sprite.xScale,
        this.assets.getImg("tex1").height * -part.render.sprite.yOffset * part.render.sprite.yScale,
        this.assets.getImg("tex1").width * part.render.sprite.xScale,
        this.assets.getImg("tex1").height * part.render.sprite.yScale);
    }

 // }

  }

  public setVerticalTiles(newVerticalTiles: number) {
    this.verticalTiles = newVerticalTiles;
  }
  public setHorizontalTiles(newHorinzontalTiles: number) {
    this.horizontalTiles = newHorinzontalTiles;
  }

}
export default TextureComponent;
