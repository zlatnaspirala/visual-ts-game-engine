import Browser from "../class/browser";
import { IUniVector } from "../interface/global";
import { UniVector } from "../types/global";

/**
 * @description Global window based events,
 * - Keyboard event provider, with elegant
 *  key access and setup value.
 * Potencial for handling any other event.
 * Help from browser to get client navigator data.
 */

class GlobalEvent {

  public get: IUniVector = {};
  public activeKey: IUniVector = {};
  public providers: UniVector = {};
  private browser: Browser;

  public constructor(browser: Browser) {

    this.browser = browser;
    // console.info("Is mobile: ", this.browser.isMobile);

    // Register providers
    this.providers.onkeydown = function() {};
    this.providers.onkeyup = function() {};

  }

  public activateKeyDetection() {
    document.body.addEventListener("keydown", this.onKeyDownHandler, true);
    document.body.addEventListener("keyup", this.onKeyUpHandler, true);
  }

  public deactivateKeyDetection() {
    document.body.removeEventListener("keydown", this.onKeyDownHandler, true);
    document.body.removeEventListener("keyup", this.onKeyUpHandler, true);
  }

  // Attach any event from `code`
  public attachEvent(name: string, callback) {
    this.get[name] = callback;
    window[name] = (event) => {
      this.get[name](event);
    };
  }

  private onKeyDownHandler = (e) => {
    const root = this;
    root.activeKey[e.keyCode] = true;
    root.providers.onkeydown();
  }

  private onKeyUpHandler = (e) => {
    const root = this;
    root.activeKey[e.keyCode] = false;
    root.providers.onkeyup();
  }

}
export default GlobalEvent;
