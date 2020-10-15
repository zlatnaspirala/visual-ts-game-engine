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

    // Register providers and dependency.
    // = () => make's reflecting for selectedPlayer , tiles etc.
    // Instance must be proveded sometimes.
    this.providers.injected = {};
    this.providers.onkeydown = function () {
      console.log("default providers.onkeydown");
    };
    this.providers.onkeyup = function () {
      console.log("default providers.onkeyup");
    };

  }

  public injectDependency(alias: string, anyInstance: any) {
    if (typeof this.providers.injected[alias] !== "undefined") {
      console.warn("You already injected instance with this alias. Operation rejected.");
      return;
    }
    this.providers.injected[alias] = anyInstance;
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
