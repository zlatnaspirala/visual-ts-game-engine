import ClientConfig from "../../client-config";
import { createAppEvent } from "./system";

/**
 * @description This class contain canvas dom operation.
 * Getter and setter for  width and height of canvas or
 * percent of innerHeight or innerWidth.
 * @param config {CLientCofig}
 */
class ViewPort {

  public config: ClientConfig;

  private canvasDom;
  private reperW: any;
  private reperH: any;
  private aspectRatio: number = 1.333;

  constructor(config: ClientConfig) {

    this.config = config;
    this.aspectRatio = this.config.getAspectRatio();
    if (this.config.getDrawRefference() === "diametric-fullscreen") {
      this.reperH = function () {
        return (window as any).innerHeight;
      };
      this.reperW = function () {
        return (window as any).innerWidth;
      };

    } else if (this.config.getDrawRefference() === "frame") {
      this.reperH = function () {
        if ((window as any).innerHeight >= (window as any).innerWidth / this.aspectRatio) {
          return (window as any).innerWidth / this.aspectRatio;
        } else {
          return (window as any).innerHeight;
        }

      };
      this.reperW = function () {
        if ((window as any).innerWidth >= (window as any).innerHeight * this.aspectRatio) {
          return (window as any).innerHeight * this.aspectRatio;
        } else {
          return (window as any).innerWidth;
        }
      };
    }

  }

  public initCanvasDom() {
    // important, first canvas for now only
    this.canvasDom = document.getElementsByTagName("canvas")[0];

    /**
     * Old trick with 1 msec
     * We need asyn call here
     */
    setTimeout( () => {
      const canvasDomReady = createAppEvent(
        "CANVAS_READY",
        {
          desc: "Good",
        },
      );
      (window as any).dispatchEvent(canvasDomReady);
    }, 1);

  }

  public getCanvasDom(): HTMLCanvasElement {

    // important, first canvas for now only
    // initCanvasDom Not in dep chain ! Fix later
    this.canvasDom = document.getElementsByTagName("canvas")[0];

    return this.canvasDom;
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

  public getCanvasWidth() {
    return document.getElementsByTagName("canvas")[0].clientWidth;
  }

  public getCanvasHeight() {
    return document.getElementsByTagName("canvas")[0].clientHeight;
  }

  public setCanvasWidth(width: string) {

    let canvasCss;
    this.canvasDom = document.getElementsByTagName("canvas")[0];
    canvasCss = this.canvasDom.style;
    canvasCss.width = width;

  }

  public setCanvasHeight(height: string) {

    let canvasCss;
    this.canvasDom = document.getElementsByTagName("canvas")[0];
    canvasCss = this.canvasDom.style;
    canvasCss.height = height;

  }
}
export default ViewPort;
