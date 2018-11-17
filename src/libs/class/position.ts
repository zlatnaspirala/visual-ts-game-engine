import ViewPort from "./view-port";

class Position {

  private x: number;
  private y: number;
  private viewPort: ViewPort;

  constructor(viewPort: ViewPort) {

    this.viewPort = viewPort;
  }
  public getX(): number {
    return this.viewPort.getWidth(this.x);
  }

  public getY(): number {
    return this.viewPort.getHeight(this.y);
  }

  public setX(newX) {
    this.x = newX;
  }

  public setY(newY) {
    this.y = newY;
  }

}
export default Position;
