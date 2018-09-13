
interface IVisualComponent {
  drawComponent: (c: CanvasRenderingContext2D, texture: HTMLImageElement, part: any) => void;
}
export default IVisualComponent;
