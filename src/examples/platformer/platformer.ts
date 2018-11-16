import { IGamePlayModel } from "../../libs/interface/global";
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

class Platformer implements IGamePlayModel {

  public gameName: string = "platformer";
  public version: number = 0.02;
  public starter: Starter;
  public grounds: worldElement[] = [];
  // shortcut for view size
  public v: any;

  public player: any = {};
  private levelAccess: { [key: string]: (r: Platformer) => void } = {};

  constructor(starter: Starter) {

    this.starter = starter;
    this.v = starter.getView();
    this.levelAccess.level1 = level1;

    // Load level (in same class for now)
    if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      this.init("level1");
    }
    // this.init("level1");

  }

  public attachAppEvents = () => {
    const myInstance = this;
    window.addEventListener("game-init", function (e) {
      console.log(e);
      myInstance.init("level1");
      /*
      setTimeout(function () {
        alert();
        myInstance.destroyGamePlay();
      }, 3000);
      */
    });
  }

  public init = (level: string) => {

    const root = this;
    this.levelAccess[level](root);

  }

  public destroyGamePlay() {
    this.levelAccess = null;
    this.starter.destroyGamePlay();
  }

}
export default Platformer;
