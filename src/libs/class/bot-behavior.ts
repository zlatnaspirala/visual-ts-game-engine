import Matter = require("matter-js");
import { IBotBehaviorOptions } from "../interface/global";
import { worldElement } from "../types/global";

class BotBehavior implements IBotBehaviorOptions {

  public patrolType: string = "left-right";
  public patrolPeriod: number = 3000;
  public patrolLoop: boolean = true;
  public patrol: () => void;
  private patrolDirection: number = 1;
  private enemy: worldElement;

  public constructor(enemy: any, options?: IBotBehaviorOptions) {
    this.enemy = enemy;
    if (options) {
      this.patrolType = options.patrolType;
      if (this.patrolType === "left-right") {
        this.patrol = this.patrolLeftRight;
      } else if (this.patrolType === "up-down") {
        this.patrol = this.patrolUpDown;
      }
      this.patrolPeriod = options.patrolPeriod;
      this.patrolLoop = options.patrolLoop;
      console.log("bot options loaded");
    } else {
      // console.log("bot default options loaded.");
      this.patrol = this.patrolLeftRight;
    }
  }

  private patrolUpDown() {

    const root = this;
    setTimeout(function () {
      Matter.Body.setVelocity(root.enemy as Matter.Body,
        { x: 0, y: 15 * root.patrolDirection });
      root.checkPatrol();
    }, this.patrolPeriod);

  }

  private patrolLeftRight() {

    const root = this;
    setTimeout(function () {
      Matter.Body.setVelocity(root.enemy as Matter.Body,
        { x: 15 * root.patrolDirection, y: -1 });
      root.checkPatrol();
    }, this.patrolPeriod);

  }

  private checkPatrol() {

    if (this.patrolLoop) {
      this.patrolDirection *= -1;
      this.patrol();
    }

  }

}
export default BotBehavior;
