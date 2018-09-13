import Starter from ".././starter";

class ViewPort {

  public drawRefference: string;

  private canvasDom;
  private reperW: any;
  private reperH: any;
  private aspectRatio: number = 1.333;

    constructor(viewPortType) {

     this.drawRefference = viewPortType;
     if (viewPortType === "diametric-fullscreen") {
         this.reperH = function() {
           return window.innerHeight;
       };
         this.reperW = function() {

         return window.innerWidth;

       };

     } else if (viewPortType === "frame") {

        this.reperH = function() {

        if (window.innerHeight > window.innerWidth / this.aspectRatio - 200) {
        console.log("!!!!");
        return window.innerWidth / this.aspectRatio;
      } else {
        return window.innerHeight;
      }

      };
        this.reperW = function() {

          if (window.innerWidth > window.innerHeight * this.aspectRatio) {
            // console.log("!test");
            return window.innerHeight * this.aspectRatio;
          } else {
            return window.innerWidth;
          }
        };
     }
     // console.log("ViewPort constructed");
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
    console.log(canvasCss.width);

  }

  public setCanvasHeight(height: string) {

    let canvasCss;
    this.canvasDom = document.getElementsByTagName("canvas");
    canvasCss = this.canvasDom[0].style;
    canvasCss.height = height;
    console.log(canvasCss.height);

  }
}
export default ViewPort;
