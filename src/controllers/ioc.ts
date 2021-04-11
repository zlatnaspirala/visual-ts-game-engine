
import Browser from "../libs/class/browser";
import Broadcaster from "../libs/class/networking/broadcaster";
import Network from "../libs/class/networking/network";
import { scriptManager } from "../libs/class/system";
import ViewPort from "../libs/class/view-port";
import VisualRender from "../libs/class/visual-render";
import ClientConfig from "../client-config";
import GlobalEvent from "../libs/events/global-event";
import { IUniVector } from "../libs/interface/global";
import Starter from "../libs/starter";
import MessageBox from "../libs/class/messager-box";

/**
 * Ioc is main dependency controller class.
 * This class store all main instances
 * Property get is type of IUniVector (access by key)
 * Example of access : this.get.Browser
 * Also you can generate or bind new Instances with method gen.
 */
class Ioc {

  /**
   * get is store variable , We make instance of core classes
   * just one time in whole app live circle.
   */
  public get: IUniVector = {};

  /**
   * config is instance of ClientConfig class.
   */
  private config: ClientConfig;

  /**
   * Constructor for ioc class is in samo time
   * register for application classes.
   */
  constructor(gamesList: any[]) {

    this.config = new ClientConfig(gamesList);

    this.loadAddson();
    this.singlton(MessageBox, undefined);
    this.singlton(Browser, undefined);
    this.singlton(ViewPort, this.config);
    this.singlton(GlobalEvent, [this.get.Browser,
                                this.get.ViewPort,
                                this.get.MobileControls]);
    this.singlton(VisualRender, undefined);

    if (this.config.didAppUseNetwork()) {

      this.singlton(Network, this.config);

      if (this.config.didAppUseBroadcast()) {
        this.singlton(Broadcaster, this.config);
      }

    }

    this.singlton(Starter, this);

  }

  public reLoadNetworking () {

    if (this.config.didAppUseNetwork()) {

      this.singlton(Network, this.config);

      if (this.config.didAppUseBroadcast()) {
        this.singlton(Broadcaster, this.config);
      }

    }

  }

  /**
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
        console.log("Addson: " + addson.name + " loaded.");
      }

    });
  }

}
export default Ioc;
