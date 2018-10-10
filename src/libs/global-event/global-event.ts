import Browser from "../class/browser";
import { IUniVector } from "../types/global";

/**
 * @description Global window based events
 */

class GlobalEvent {

  public get: IUniVector = {};
  public activeKey: IUniVector = {};
  public browser: Browser;

  public constructor(browser: Browser) {

    this.browser = browser;
    // this.attachEvent("onmousedown" , function(e) {console.log("mouse down" + event); });

  }

  public activateKeyDetection() {
    document.body.addEventListener("keydown", this.onKeyDownHandler, true);
    document.body.addEventListener("keyup", this.onKeyUpHandler, true);
  }

  public deactivateKeyDetection() {
    document.body.removeEventListener("keydown", this.onKeyDownHandler, true);
    document.body.removeEventListener("keyup", this.onKeyUpHandler, true);
  }

  public attachEvent(name: string, callback) {
    this.get[name] = callback;
    window[name] = (event) => {
      this.get[name](event);
    };
  }

  private onKeyDownHandler = (e) => {
    const root = this;
    root.activeKey[e.keyCode] = true;
  }

  private onKeyUpHandler = (e) => {
    const root = this;
    root.activeKey[e.keyCode] = false;
  }

}
export default GlobalEvent;
