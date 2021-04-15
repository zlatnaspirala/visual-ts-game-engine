import ClientConfig from "../../client-config";
import Browser from "../class/browser";
import MobileControls from "../class/player-commands";
import ViewPort from "../class/view-port";
import { ARROW_KEYS } from "../defaults";
import { IUniVector } from "../interface/global";
import { UniVector } from "../types/global";

/**
 * @name GlobalEvent
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
  private mobileControl: MobileControls;
  private clientConfig: ClientConfig;

  public constructor(browser: Browser, viewPort: ViewPort, mobileControl: MobileControls) {

    this.viewPort = viewPort;
    this.browser = browser;
    this.clientConfig = viewPort.config;
    this.mobileControl = mobileControl;

    if (browser.isMobile === true) {

      console.info("Mobile device detected: ", this.browser.isMobile);

      window.addEventListener("CANVAS_READY", () => {
        console.log("Canvas ready.");
        this.activateMobilePlatformerControls();
      } , false);

      this.providers.injected = {};
      this.providers.onkeydown = function () {
        console.log("default providers.onkeydown");
      };
      this.providers.onkeyup = function () {
        console.log("default providers.onkeyup");

      };
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

  public deActivateKeyDetection() {
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

  private synteticLeft = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.LEFT] = true;
    root.providers.onkeydown();
  }

  private synteticRight = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.RIGHT] = true;
    root.providers.onkeydown();
  }

  private synteticJump = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.JUMP] = true;
    root.providers.onkeydown();
  }

  private synteticLeftUp = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.LEFT] = false;
    root.providers.onkeyup();
  }

  private synteticRightUp = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.RIGHT] = false;
    root.providers.onkeyup();
  }

  private synteticJumpUp = () => {
    const root = this;
    root.activeKey[ARROW_KEYS.JUMP] = false;
    root.providers.onkeyup();
  }

  private activateMobilePlatformerControls () {

    window.addEventListener("touchstart", this.mEvent, false);
    window.addEventListener("touchend", this.mEventUp, false);

  }

  private deActivateMobilePlatformerControls () {

    window.removeEventListener("touchstart", this.mEvent);
    window.removeEventListener("touchend", this.mEventUp);

  }

  private mEvent = (event) => {

    const posX = event.changedTouches[0].clientX || event.changedTouches[0].pageX;
    const posY = event.changedTouches[0].clientY || event.changedTouches[0].pageY;
    const r = this.mobileControl.detArea.commandRight;
    const l = this.mobileControl.detArea.commandLeft;
    const j = this.mobileControl.detArea.commandJump;
    if (posX > j.left() && posX < (j.left() + j.width()) &&
        posY > j.top() && posY < (j.top() + j.height())) {
      this.synteticJump();
    }

    if (posX > l.left() && posX < (l.left() + l.width()) &&
        posY > l.top() && posY < (l.top() + l.height())) {
      this.synteticLeft();
    }
    if (posX > r.left() && posX < (r.left() + r.width()) &&
        posY > r.top() && posY < (r.top() + r.height())) {
      this.synteticRight();
    }

    // console.info("Touch position: ", posX, posY)
  }

  private mEventUp = (event: Event) => {

    this.synteticLeftUp();
    this.synteticRightUp();
    this.synteticJumpUp();

  }

}
export default GlobalEvent;
