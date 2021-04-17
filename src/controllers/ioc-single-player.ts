
import ClientConfig from "../client-config";
import Browser from "../libs/class/browser";
import MessageBox from "../libs/class/messager-box";
import MobileControls from "../libs/class/player-commands";
import Sound from "../libs/class/sound";
import { scriptManager } from "../libs/class/system";
import ViewPort from "../libs/class/view-port";
import VisualRender from "../libs/class/visual-render";
import GlobalEvent from "../libs/events/global-event";
import { IUniVector } from "../libs/interface/global";
import Starter from "../libs/starter";

/**
 * @description Ioc is main dependency controller class.
 * This class store all main instances
 * Property get is type of IUniVector (access by key)
 * Example of access : this.get.Browser
 * Also you can generate or bind new Instances with method gen.
 */
class Ioc {

  /**
   * @name get
   * @description get is store variable , We make instance of core classes
   * just one time in whole app live circle.
   */
  public get: IUniVector = {};

  /**
   * @description
   * config is instance of ClientConfig class.
   */
  private config: ClientConfig;

  /**
   * @description
   * Constructor for ioc class is in samo time
   * register for application classes.
   * If class have no args pass `undefined`.
   * After defined line
   *     this.singlton(MobileControls, undefined);
   *     this.singlton(Browser, undefined);
   * We can use it in next line
   *     this.singlton(GlobalEvent, this.get.Browser, this.get.MobileControls);
   * Synchro block code
   * 
   * injectedConfig?: ClientConfig is optimal arg
   */
  constructor(gamesList: any[], injectedConfig?: ClientConfig) {

    if (injectedConfig) {
      this.config = injectedConfig;
    } else {
      this.config = new ClientConfig(gamesList);
    }

    this.loadAddson();

    this.singlton(Sound, undefined);
    this.singlton(MessageBox, undefined);
    this.singlton(MobileControls, undefined);
    this.singlton(Browser, undefined);
    this.singlton(ViewPort, this.config);
    this.singlton(GlobalEvent, [this.get.Browser,
                                this.get.ViewPort,
                                this.get.MobileControls]);
    this.singlton(VisualRender, undefined);
    this.singlton(Starter, this);

  }

  public reLoadNetworking () { /** no empty */ }

  /**
   * @name singlton
   * @description
   * singlton is method for instancing.
   * @param Singlton This arg is type pf any becouse we can pass
   * any class with or without own args.
   * @param args Args is optimal. If our class have args then we pass args,
   * if dont have ti we pass undefined for now.
   */
  public singlton(Singlton: any, args: undefined | any) {
    if (args !== undefined) {
      if (typeof args.length === "number") {
        this.get[Singlton.name] = new Singlton(...args);
      } else {
        this.get[Singlton.name] = new Singlton(args);
      }
    } else {
      this.get[Singlton.name] = new Singlton();
    }
  }

  /**
   * This method return new Instance of passed class.
   */
  public gen(newInstance: any) {
    return new newInstance();
  }

  public getConfig() {
    return this.config;
  }

  private loadAddson(): void {
    this.config.getAddson().forEach(function (addson) {
      if (addson.enabled) {
        scriptManager.load(addson.scriptPath);
        // console.log("Addson: " + addson.name + " loaded.");
      }

    });
  }

}
export default Ioc;
