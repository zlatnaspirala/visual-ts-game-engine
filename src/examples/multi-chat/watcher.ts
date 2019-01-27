import { IGamePlayModel } from "../../libs/interface/global";
import Starter from "../../libs/starter";
import { worldElement } from "../../libs/types/global";

/**
 * @author Nikola Lukic
 * @class Platformer
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use requir
 */

class Watcher {

  public gameName: string = "Watcher";
  public version: number = 0.01;
  public user: any = {};

  constructor(starter: Starter) {

    // test
  }

  public attachAppEvents = () => {
    const myInstance = this;
    window.addEventListener("app-init", function (e) {
      console.log(e);
    });
  }

}
export default Watcher;
