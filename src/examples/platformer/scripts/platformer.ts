import Matter = require("matter-js");
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import { IGamePlayModel, IPoint } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";

/**
 * @author Nikola Lukic
 * @class Platformer
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use requir
 */

class Platformer implements IGamePlayModel {

  public gameName: string = "platformer";
  public version: number = 0.2;
  public playerCategory = 0x0002;
  public staticCategory = 0x0004;

  public starter: Starter;
  public grounds: worldElement[] = [];
  public enemys: worldElement[] = [];
  public deadLines: worldElement[] = [];
  public v: any;

  public player: Matter.Body | any = null;
  public hudLives: Matter.Body | any = null;

  private lives: number = 3;
  private preventDoubleExecution: boolean = false;
  private playerStartPositions: IPoint[] = [{x: 120, y: 200}];

  constructor(starter: Starter) {

    this.starter = starter;
    this.v = starter.getView();

  }

  public attachAppEvents = () => {
    const myInstance = this;
    window.addEventListener("game-init", function (e) {
      console.log("Event triggered: ", e);
    });
  }

  public createHud () {

    const playerRadius = 50;
    this.hudLives = Matter.Bodies.rectangle(50, 220, 300, 200, {
      label: "HUD",
      isStatic: true,
      render: {
        visualComponent: new TextComponent("Platformer demo"),
        fillStyle: "blue",
        sprite: {
          xScale: 1,
          yScale: 1,
        },
      } as any,
    } as Matter.IBodyDefinition);
    this.hudLives.collisionFilter.group = -1;

    this.starter.AddNewBodies(this.hudLives as worldElement);

  }

  public createPlayer() {

    const imgResMyPlayerSprite = [
      require("../imgs/walk-boy2.png"),
    ];

    const playerRadius = 50;
    this.player = Matter.Bodies.circle(120, 200, playerRadius, {
      label: "player",
      density: 0.0005,
      friction: 0.01,
      frictionAir: 0.06,
      restitution: 0.3,
      ground: true,
      jumpCD: 0,
      portal: -1,
      collisionFilter: {
        category: this.playerCategory,
      } as any,
      render: {
        visualComponent: new SpriteTextureComponent("playerImage", imgResMyPlayerSprite, { byX: 5, byY: 2 }),
        fillStyle: "blue",
        sprite: {
          xScale: 1,
          yScale: 1,
        },
      } as any,
    } as Matter.IBodyDefinition);
    this.player.collisionFilter.group = -1;
    this.player.render.visualComponent.keepAspectRatio = true;
    this.player.render.visualComponent.setHorizontalFlip(true);

    if (this.lives < 3) {
      // this.starter.AddNewBodies(this.player as worldElement);
    }
  }

  public playerSpawn() {

     if (this.player === null) {
       this.createPlayer();
     } else if (this.player.type === "body") {
       // empty for now
     }

  }

  public collisionCheck(event, ground: boolean) {

    const pairs = event.pairs;
    for (let i = 0, j = pairs.length; i !== j; ++i) {
      const pair = pairs[i];
      if (pair.activeContacts) {

        if (pair.bodyA.label === "player" && pair.bodyB.label === "bitcoin") {
          const collectitem = pair.bodyB;
          this.starter.destroyBody(collectitem);
        }

        if (pair.bodyA.label === "player" && pair.bodyB.label === "enemy_crapmunch") {
          const collectitem = pair.bodyA;
          this.playerDie(collectitem);
        } else if (pair.bodyB.label === "player" && pair.bodyA.label === "enemy_crapmunch") {
          const collectitem = pair.bodyB;
          this.playerDie(collectitem);
        }

        pair.activeContacts.forEach((element) => {
          if (element.vertex.body.label === "player" &&
            element.vertex.index > 5 && element.vertex.index < 8) {
            (this.player as any).ground = ground;
          } else if (element.vertex.body.label === "player") {
            (this.player as any).ground = false;
          }
        });
        }
      }

  }

  protected playerDie(collectitem) {

    if (!this.preventDoubleExecution) {
      this.preventDoubleExecution = true;
      const root = this;

      // Hard dead
      // this.starter.destroyBody(collectitem);

      // Soft dead for now
      Matter.Body.setPosition(this.player, this.playerStartPositions[0]);

      this.lives = this.lives - 1;

      setTimeout(function () {
        root.playerSpawn();
        root.preventDoubleExecution = false;
      }, 500);
    }

  }

  private destroyGamePlay() {
    this.starter.destroyGamePlay();
  }

}
export default Platformer;
