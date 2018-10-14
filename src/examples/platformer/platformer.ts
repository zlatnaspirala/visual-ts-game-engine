import Starter from "../../libs/starter";
import { worldElement } from "../../libs/types/global";
import { level1 } from "./scripts/level1/level1";

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
  public version: number = 0.02;
  public starter: Starter;
  public grounds: worldElement[] = [];
  // shortcut for view size
  public v: any;

  public player: any = {};
  // private globalEvent: GlobalEvent;
  private levelAccess: { [key: string]: (r: Platformer) => void } = {};

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
