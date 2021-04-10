import ClientConfig from "../../client-config";
import Browser from "../class/browser";
import ViewPort from "../class/view-port";
import { IUniVector } from "../interface/global";
import { UniVector } from "../types/global";
import ARROW_KEYS from "../defaults";
/**
 * @description Global window based events,
 * - Keyboard event provider, with elegant
 *   key access and setup value.
 * - Potencial for handling any other event.
 * - Help from browser to get client navigator data.
 * - Activate Player commander place
 */

class GlobalEvent {

  public get: IUniVector = {};
  public activeKey: IUniVector = {};
  public providers: UniVector = {};
  private browser: Browser;
  private viewPort: ViewPort;
  private clientConfig: ClientConfig;

  public constructor(browser: Browser, viewPort: ViewPort) {

    this.browser = browser;
    this.clientConfig = viewPort.config;
    console.info("Is mobile: ", this.browser.isMobile);

    if (browser.isMobile === true) {
      this.viewPort = viewPort;

      window.addEventListener('CANVAS_READY', () => {
        console.log("canvas ready catch ")
        this.activateMobilePlatformerControls();
      } , false)
      

    } else {

      if (this.clientConfig.getcontrols().enableMobileControlsOnDesktop) {
        // yest
      }
      // Optimize 
      // We no need at all keyboard at mobile platform!

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

  // 37 left
  // 39 
  // 38 jump

  private onKeyDownHandler = (e) => {
    const root = this;
    console.log(" SINTENTIC e.keyCode .... ", e.keyCode)
    root.activeKey[e.keyCode] = true;
    root.providers.onkeydown();
  }

  private onKeyUpHandler = (e) => {
    const root = this;
    console.log(" SINTENTIC e.keyCode .... ", e.keyCode)
    root.activeKey[e.keyCode] = false;
    root.providers.onkeyup();
  }

  private synteticLeft = () => {
    const root = this;
    console.log(" SINTENTIC e.keyCode .... ", e.keyCode)
    root.activeKey[ARROW_KEYS.LEFT] = true;
    root.providers.onkeydown();
  }

  private synteticRight = () => {
    const root = this;
    console.log(" SINTENTIC e.keyCode .... ", e.keyCode)
    root.activeKey[ARROW_KEYS.RIGHT] = false;
    root.providers.onkeyup();
  }

  private activateMobilePlatformerControls () {

    console.log("COOthis.viewPortL", this.viewPort)
    window.addEventListener("touchstart", (event) => {
      
      const posX = event.changedTouches[0].clientX | event.changedTouches[0].pageX
      const posY = event.changedTouches[0].clientY | event.changedTouches[0].pageY
      console.log("COOL x ", posX)
      console.log("COOL y ", posY)

    }, false)

  }


}
export default GlobalEvent;
