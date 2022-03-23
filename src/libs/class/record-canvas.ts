
import {
  IRecordCanvasModule
 } from "./../../libs/interface/global";

import RC from "record-canvas";

/**
 * @implements IRecordCanvasModule
 * @description External package
 * 
 * npm i record-canvas
 */
class RecordGamePlay implements IRecordCanvasModule {

  private options: any = {};
  public recordCanvas;

  public constructor(options?: any) {
    if (typeof options !== "undefined") {
      this.options= options;
      console.info("RecordGamePlay ->  loaded with args: ", options);
    } else {
      this.options = {
        // injectCanvas: injectCanvas,
        injectCanvas: document.getElementsByTagName("canvas")[0],
        frameRequestRate: 30,
        videoDuration: 10,
        outputFilename: "record-canvas.mp4",
        mineType: "video/mp4",
        resolutions: '800x600'
      };

    }
    this.recordCanvas = new (RC as any).RecordCanvas(this.options);

  }

  /**
   * @description
   * @returns void
   */
  public startRecording() {
    // platformer.starter.ioc.get.RecordGamePlay.recordCanvas.run()
    this.recordCanvas.run();
  }

}
export default RecordGamePlay;
