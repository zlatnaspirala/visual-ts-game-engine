import Matter = require("matter-js");
import { byId, createAppEvent, htmlHeader } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import { IGamePlayModel, IMultiplayer, IPoint } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement, UniVector } from "../../../libs/types/global";
import Network from "../../../libs/class/networking/network";
// import { DEFAULT_PLAYER_DATA } from "../../../libs/defaults";

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
  public labels: worldElement[] = [];
  public v: any;

  public player: Matter.Body | any = undefined;

  // move to maps 'labes text'
  public hudLives: Matter.Body | any = null;

  public netBodies: UniVector = {}; // worldElement = [];

  private lives: number = 3;
  private preventDoubleExecution: boolean = false;
  private playerStartPositions: IPoint[] = [{x: 120, y: 200}];
  private playerDeadPauseInterval: number = 550;

  private UIPlayerBoard: HTMLDivElement;
  private UIPlayAgainBtn: HTMLDivElement;

  constructor(starter: Starter) {

    this.starter = starter;

    this.addUIPlayerBoard();
    this.showPlayerBoardUI();
    this.attachUpdateLives();

  }

  public addNetPlayer = (myInstance, rtcEvent?) => {

    let root = this;

    this.preventDoubleExecution = false;

    const imgResMyPlayerSprite = [
        require("../imgs/walk-boy2.png"),
        require("../imgs/explosion/explosion.png"),
    ];

    console.log("welcome ", rtcEvent.extra.username);
    const playerRadius = 50;
    let netPlayer: worldElement = Matter.Bodies.circle(
      this.playerStartPositions[0].x,
      this.playerStartPositions[0].y,
      playerRadius, {
        netId: 1000,
        label: rtcEvent.extra.nickname,
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

    netPlayer.collisionFilter.group = -1;
    (netPlayer.render as any).visualComponent.assets.SeqFrame.setNewSeqFrameRegimeType("CONST");
    (netPlayer.render as any).visualComponent.keepAspectRatio = true;
    (netPlayer.render as any).visualComponent.setHorizontalFlip(true);

    const addToScene = true;
      if (addToScene) {
        // this.netPlayer.id = 2;
        this.starter.AddNewBodies(netPlayer as worldElement);
        console.info("Net Player body created.");
        myInstance.netBodies["netObject_" + rtcEvent.userid] = netPlayer;
      }

  };

/*   public createHud () {

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

  } */

  public createPlayer(addToScene: boolean) {

    this.preventDoubleExecution = false;

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

    if (addToScene) {
      this.player.id = 2;
      this.starter.AddNewBodies(this.player as worldElement);
      console.info("Player body created from 'dead'.");
    }
  }

  public playerSpawn(recreatePlayer: boolean) {

    if (this.player === null || this.player === undefined) {
      this.createPlayer(recreatePlayer);
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
            if (this.player === null) { return; }
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
        myInstance.UIPlayAgainBtn = byId("playAgainBtn") as HTMLDivElement;

        myInstance.UIPlayAgainBtn.addEventListener("click", function (){

          const appStartGamePlay = createAppEvent("game-init",
          {
            game: myInstance.player,
          });

          (window as any).dispatchEvent(appStartGamePlay);

        }, false);
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

      if (this.lives === 0 || this.lives < 0) {
          this.starter.destroyBody(collectitem);
          this.player = null;
          if ((byId("playAgainBtn") as HTMLButtonElement)) {
            (byId("playAgainBtn") as HTMLButtonElement).disabled = false;
          }
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
        root.playerSpawn(false);
        root.preventDoubleExecution = false;
      }, this.playerDeadPauseInterval);
    }

  }

  private destroyGamePlay() {
    this.starter.destroyGamePlay();
  }

  private attachUpdateLives = () => {

    let root = this;
    window.addEventListener("update-lives", function (e) {
      root.lives = (e as any).detail.data.lives;
    });

  }

  private addUIPlayerBoard = () => {
    this.UIPlayerBoard = document.createElement("div");
    this.UIPlayerBoard.id = "UIPlayerBoard";
    this.UIPlayerBoard.className = "leftPanelUni";

    document.getElementsByTagName("body")[0].appendChild(this.UIPlayerBoard);
  }

}
export default Platformer;
