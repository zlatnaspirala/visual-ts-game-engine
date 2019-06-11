import Matter = require("matter-js");
import { byId, bytesToSize, getElement, getRandomColor, htmlHeader } from "../../../libs/class/system";
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

  // move to maps 'labes text'
  public hudLives: Matter.Body | any = null;

  private lives: number = 3;
  private preventDoubleExecution: boolean = false;
  private playerStartPositions: IPoint[] = [{x: 120, y: 200}];
  private playerDeadPauseInterval: number = 550;

  private UIPlayerBoard: HTMLDivElement;

  constructor(starter: Starter) {

    this.starter = starter;
    this.v = starter.getView();

    this.UIPlayerBoard = document.createElement("div");
    this.UIPlayerBoard.id = "UIPlayerBoard";
    this.UIPlayerBoard.className = "leftPanelUni";

    document.getElementsByTagName("body")[0].appendChild(this.UIPlayerBoard);
    this.showPlayerBoardUI();

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
      require("../imgs/explosion/explosion.png"),
    ];

    const playerRadius = 50;
    this.player = Matter.Bodies.circle(
      this.playerStartPositions[0].x,
      this.playerStartPositions[0].y,
      playerRadius, {
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
          visualComponent: new SpriteTextureComponent("playerImage",
           imgResMyPlayerSprite,
           { byX: 5, byY: 2 }),
          fillStyle: "blue",
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any,
    } as Matter.IBodyDefinition);
    this.player.collisionFilter.group = -1;
    this.player.render.visualComponent.assets.SeqFrame.setNewSeqFrameRegimeType("CONST");
    this.player.render.visualComponent.keepAspectRatio = true;
    this.player.render.visualComponent.setHorizontalFlip(true);

    if (this.lives < 1) {
       this.starter.AddNewBodies(this.player as worldElement);
       console.info("Player body added to the stage from hard 'dead'.");
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

  public showPlayerBoardUI = () => {

    const myInstance = this;
    fetch("./templates/ui/player-board.html", {
      headers: htmlHeader,
    }).
      then(function (res) {
        return res.text();
      }).then(function (html) {
        myInstance.UIPlayerBoard = byId("UIPlayerBoard") as HTMLDivElement;
        myInstance.UIPlayerBoard.innerHTML = html;
        myInstance.UIPlayerBoard.style.display = "block";
      });

  }

  protected playerDie(collectitem) {

    if (!this.preventDoubleExecution) {
      const root = this;
      this.preventDoubleExecution = true;
      // Hard dead
      // this.starter.destroyBody(collectitem);
      this.player.render.visualComponent.shema = { byX: 4, byY: 4 };
      this.player.render.visualComponent.assets.SeqFrame.setNewValue(1);
      this.lives = this.lives - 1;
      (this.UIPlayerBoard.getElementsByClassName("UIPlayerLives")[0] as HTMLSpanElement).innerText = this.lives.toString();

      if (this.lives === 0) {
          this.starter.destroyBody(collectitem);
          this.player = null;

          /* Re born from hard dead
             hard dead - body removed from scene
          setTimeout(function () {
            root.playerSpawn();
          }, this.playerDeadPauseInterval);
          */

          return;
      }
      setTimeout(function () {
        root.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
        root.player.render.visualComponent.shema = { byX: 5, byY: 2 };
        // Soft dead for now
        Matter.Body.setPosition(root.player, root.playerStartPositions[0]);
        root.playerSpawn();
        root.preventDoubleExecution = false;
      }, this.playerDeadPauseInterval);
    }

  }

  private destroyGamePlay() {
    this.starter.destroyGamePlay();
  }

}
export default Platformer;
