import GlobalEvent from "../../libs/global-event/global-event";
import Starter from "../../libs/starter";
import { level1 } from "./scripts/level1/level1";
import { staticItem, worldElement } from "../../libs/types/global";

/**
 * @author Nikola Lukic
 * @class Platformer
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use require
 */

class Platformer {

  public gameName: string = "platformer";
  public version: number = 0.1;

  public player: any = {};
  public playerSensor: any = {};

  public starter: Starter;
  private levelAccess: {[key: string]: (r: Platformer) => void} = {};

  public grounds: worldElement[] = [];
  // shortcut for view size
  public v: any;
  private globalEvent: GlobalEvent;

  constructor(starter: Starter) {

    this.starter = starter;
    this.levelAccess.level1 = level1;
    this.v = starter.getView();

    // Load level (in same class for now)
    this.init("level1");
  }

  private init(level: string) {

    const root = this;
    this.levelAccess[level](root);

  }

}
export default Platformer;
