
import Browser from "./class/browser";
import Network from "./class/networking/network";
import ViewPort from "./class/view-port";
import VisualRender from "./class/visual-render";
import ClientConfig from "./client-config";
import { IUniVector } from "./interface/global";
import GlobalEvent from "./multiplatform/global-event";
import Starter from "./starter";

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

  constructor(gamesList: any[]) {

    this.config = new ClientConfig(gamesList);
    this.singlton(Browser, undefined);
    this.singlton(ViewPort, this.config);
    this.singlton(GlobalEvent, this.get.Browser);
    this.singlton(VisualRender, undefined);
    this.singlton(Network, this.config);
    this.singlton(Starter, this);
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
      this.get[Singlton.name] = new Singlton(args);
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

}
export default Ioc;
