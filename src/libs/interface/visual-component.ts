import Resources from "../class/resources";

interface IVisualComponent {
  assets: Resources;
  drawComponent: (c: CanvasRenderingContext2D, texture: HTMLImageElement, part: any) => void;
}
export default IVisualComponent;
