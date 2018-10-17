
class ViewPort {

  public drawRefference: string;

  private canvasDom;
  private reperW: any;
  private reperH: any;
  private aspectRatio: number = 1.333;

  constructor(viewPortType) {

    this.drawRefference = viewPortType;
    if (viewPortType === "diametric-fullscreen") {
      this.reperH = function () {
        return (window as any).innerHeight;
      };
      this.reperW = function () {

        return (window as any).innerWidth;

      };

    } else if (viewPortType === "frame") {

      this.reperH = function () {

        if ((window as any).innerHeight > (window as any).innerWidth / this.aspectRatio - 200) {
          return (window as any).innerWidth / this.aspectRatio;
        } else {
          return (window as any).innerHeight;
        }

      };
      this.reperW = function () {

        if ((window as any).innerWidth > (window as any).innerHeight * this.aspectRatio) {
          return (window as any).innerHeight * this.aspectRatio;
        } else {
          return (window as any).innerWidth;
        }
      };
    }

  }

  public getWidth(percente: number): number {

    return this.reperW() / 100 * percente;

  }

  public getHeight(percente: number): number {

    return this.reperH() / 100 * percente;

  }

  public setAspectRatio(aspectRatio: number) {

    this.aspectRatio = aspectRatio;

  }

  public setCanvasWidth(width: string) {

    let canvasCss;
    this.canvasDom = document.getElementsByTagName("canvas");
    canvasCss = this.canvasDom[0].style;
    canvasCss.width = width;

  }

  public setCanvasHeight(height: string) {

    let canvasCss;
    this.canvasDom = document.getElementsByTagName("canvas");
    canvasCss = this.canvasDom[0].style;
    canvasCss.height = height;
    // console.log(canvasCss.height);

  }
}
export default ViewPort;
