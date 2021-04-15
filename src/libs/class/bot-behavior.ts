
import * as Matter from "matter-js";
import { IBotBehaviorOptions } from "../interface/global";
import { worldElement } from "../types/global";

class BotBehavior implements IBotBehaviorOptions {

  public patrolType: string = "left-right";
  public patrolPeriod: number = 3000;
  public patrolLoop: boolean = true;
  public patrol: () => void = () => {};
  public intesity: number = 20;
  private patrolDirection: number = 1;
  private enemy: Matter.Body | any;
  private imageFlip: boolean = false;

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
      console.info("Enemy Bot options loaded.");
    } else {
      console.info("Enemy Bot default options loaded.");
      this.patrol = this.patrolLeftRight;
    }
  }

  private patrolUpDown() {

    const root = this;
    setTimeout(function () {
      root.imageFlip = !root.imageFlip;
      root.enemy.render.visualComponent.setHorizontalFlip(root.imageFlip);
      Matter.Body.setVelocity(root.enemy as Matter.Body,
        { x: 0, y: root.intesity * root.patrolDirection });
      root.checkPatrol();
    }, this.patrolPeriod);

  }

  private patrolLeftRight() {

    const root = this;
    setTimeout(function () {
      root.imageFlip = !root.imageFlip;
      root.enemy.render.visualComponent.setHorizontalFlip(root.imageFlip);
      Matter.Body.setVelocity(root.enemy as Matter.Body,
        { x: root.intesity * root.patrolDirection, y: -1 });
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
