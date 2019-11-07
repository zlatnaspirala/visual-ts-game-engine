import IVisualComponent from "../../interface/visual-component";
import { getDistance } from "../math";
import Resources from "../resources";

/**
 * Objective :
 * Render text by input coordinate x and y.
 * Store and manipulate with text data.
 */
class TextComponent implements IVisualComponent {

  // Next step , image sprite alphabet
  public assets: Resources; //  new Resources();

  private options: any;
  private bufferText: string[] = [];
  private text: string = "Player";

  constructor(textArg: string | string[], options?: any) {

    if (textArg === undefined) {
      throw console.error("You miss text arg in TextComponent constructor...");
    }
    if (typeof textArg !== "string") {
      if (textArg.length > 1) {
        this.bufferText = textArg;
      } else {
        this.text = textArg[0];
      }
    } else {
      this.text = textArg;
    }

    if (options) {
      this.options = options;
    } else {
      this.options = { color: "white"};
    }

  }

  public drawComponent(c: CanvasRenderingContext2D, part: any): void {

  const dist1 = getDistance(part.vertices[0], part.vertices[1]);
  const dist2 = getDistance(part.vertices[0], part.vertices[3]);
  let originX = dist1 * -part.render.sprite.xOffset * part.render.sprite.xScale;
  let originY = dist2 * -part.render.sprite.yOffset * part.render.sprite.yScale;
  const originW = dist1;
  const originH = dist2;
  originX += originH / 2;
  originY += originH / 2;

  c.font = "50px sans-serif";
  c.fillStyle = (this.options.color as string) || "rgba(255,255,255,1)";
  c.fillText(
   this.text,
   originX,
   originY,
   originW);

  }

}
export default TextComponent;
