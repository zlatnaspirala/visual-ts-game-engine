import Matter = require("matter-js");
import GamePlay from "../../examples/platformer/scripts/game-play";
import { UniVector } from "../types/global";
import ViewPort from "./view-port";

class Bot {

  private periods: [] = [];
  private patrolDirection: number = 1;
  private enemy: any;
  private patrolPeriod: number = 3000;
  private patrolLoop: boolean = true;

  constructor(enemy: any) {
    this.enemy = enemy;
    //
  }

  public patrol() {

    const root = this;
    setTimeout(function () {
      Matter.Body.setVelocity(root.enemy as Matter.Body,
      root.checkPatrol();
    }, this.patrolPeriod);

  }

  public checkPatrol() {

    if (this.patrolLoop) {
      this.patrolDirection *= -1;
      this.patrol();
    }

  }

}
export default Bot;
