import Matter = require("matter-js");
import { byId, createAppEvent, htmlHeader } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import { IGamePlayModel, IPoint, ISelectedPlayer } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement, UniVector } from "../../../libs/types/global";
import TextureComponent from "../../../libs/class/visual-methods/texture";
// import { DEFAULT_PLAYER_DATA } from "../../../libs/defaults";

require("../audios/map-themes/mishief-stroll.mp4");

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
  public version: number = 0.3;
  public playerCategory = 0x0002;
  public staticCategory = 0x0004;

  public starter: Starter;
  public grounds: worldElement[] = [];
  public enemys: worldElement[] = [];
  public deadLines: worldElement[] = [];
  public labels: worldElement[] = [];
  public v: any;
  public player: Matter.Body | any = undefined;

  // move to maps 'labels text'
  public hudLives: Matter.Body | any = null;

  public selectedPlayer : ISelectedPlayer;
  private selectPlayerArray = [];
  private lives: number = 3;
  private preventDoubleExecution: boolean = false;
  private playerStartPositions: IPoint[] = [{x: 120, y: 200}];
  private playerDeadPauseInterval: number = 550;

  private UIPlayerBoard: HTMLDivElement;
  private UIPlayAgainBtn: HTMLDivElement;

  constructor(starter: Starter) {

    this.starter = starter;

    // dev
    this.initSelectPlayer();
    this.addUIPlayerBoard();
    this.showPlayerBoardUI();
    this.attachUpdateLives();

    // no sub dir in build
    this.starter.ioc.get.Sound.createAudio("audios/mishief-stroll.mp4", "surfaceLevel", true); // .play();
    // sthis.starter.ioc.get.Sound.audioBox['surfaceLevel'].play();

  }

  private initSelectPlayer() {

    // Create UI for basic select player features.
    // Register
    this.selectPlayerArray.push({
      labelName: "robot",
      poster: require("../imgs/players/robot/poster.png"),
      resource:  [
        require("../imgs/players/robot/1.png"),
        require("../imgs/players/robot/2.png"),
        require("../imgs/players/robot/3.png"),
        require("../imgs/players/robot/4.png"),
        require("../imgs/players/robot/5.png"),
        require("../imgs/players/robot/6.png"),
        require("../imgs/players/robot/7.png"),
        require("../imgs/players/robot/8.png"),
      ],
      type: "frameByFrame"
    });

    this.selectPlayerArray.push({
      labelName: "cryptoBoy",
      poster: require("../imgs/players/crypto-boy/poster.png"),
      resource: [
        require("../imgs/players/crypto-boy/walk.png"),
        require("../imgs/explosion/explosion.png"),
      ],
      type: "sprite",
      spriteTile: { byX: 5, byY: 2 }
    });

    this.selectPlayerArray.push({
      labelName: "smartGirl",
      poster: require("../imgs/players/smart-girl/poster.png"),
      resource: [
        require("../imgs/players/smart-girl/smart-girl.png"),
        require("../imgs/explosion/explosion.png"),
      ],
      type: "sprite",
      spriteTile: { byX: 5, byY: 1 }
    });

  }

  private selectPlayer(labelName: string = "cryptoBoy") {

    this.selectPlayerArray.forEach((element, index) => {

      if (element.labelName == labelName) {

        this.selectedPlayer = element;

        if (element.type == "frameByFrame") {
         this.selectedPlayer.texCom = new TextureComponent("playerImage",
           (this.selectedPlayer.resource as any))
        } else if (element.type == "sprite") {
          this.selectedPlayer.texCom = new SpriteTextureComponent("playerImage",
           (this.selectedPlayer.resource as any),
           (this.selectedPlayer.spriteTile as any))
        }


      }

    });

  }

  public createPlayer(addToScene: boolean) {

    let root = this;
    this.preventDoubleExecution = false;
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
          visualComponent: root.selectedPlayer.texCom,
          fillStyle: "blue",
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any,
    } as Matter.IBodyDefinition);
    this.player.collisionFilter.group = -1;

    if (this.player.render.visualComponent instanceof SpriteTextureComponent) {
      this.player.render.visualComponent.assets.SeqFrame.setNewSeqFrameRegimeType("CONST");
      this.player.render.visualComponent.keepAspectRatio = true;
    } else {
      // this.player.render.visualComponent.assets.SeqFrame.setNewSeqFrameRegimeType("CONST");
      this.player.render.visualComponent.keepAspectRatio = true;
      // hardcode
      this.player.render.sprite.xScale = 0.2;
      this.player.render.sprite.yScale = 0.2;
    }
    // this.player.render.visualComponent.setHorizontalFlip(false);
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

        if (pair.bodyA.label === "player" && pair.bodyB.label === "collectItemPoint") {
          const collectitem = pair.bodyB;
          this.starter.destroyBody(collectitem);
        }

        if (pair.bodyA.label === "player" && pair.bodyB.label === "crapmunch") {
          const collectitem = pair.bodyA;
          this.playerDie(collectitem);
        } else if (pair.bodyB.label === "player" && pair.bodyA.label === "crapmunch") {
          const collectitem = pair.bodyB;
          this.playerDie(collectitem);
        }

        pair.activeContacts.forEach((element) => {
          if (element.vertex.body.label === "player" &&
            element.vertex.index > 5 && element.vertex.index < 8 &&
            this.player !== null) {
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

      myInstance.UIPlayAgainBtn.addEventListener("click", function () {

        const appStartGamePlay = createAppEvent("game-init",
        {
          game: myInstance.player,
        });

        (window as any).dispatchEvent(appStartGamePlay);

      }, false);
    });

    // Select Player feature - Load UI
    fetch("./templates/ui/select-player.html", {
      headers: htmlHeader,
    }).
    then(function (res) {
      return res.text();
    }).then(function (html) {

      var popup = byId("popup") as HTMLDivElement;
      popup.innerHTML = html;
      popup.style.display = "block";

      myInstance.selectPlayerArray.forEach(function(itemPlayer) {

        var local = document.createElement("div");
        local.id = "" + itemPlayer.labelName;
        local.className = "bounceIn";
        var localStyle = "width: 30%;display:flex;";
        local.setAttribute("style", "width: 30%;display:inline-block;cursor:pointer;");
        // local. = "login-button";
        local.innerHTML = "<span> Name:" + itemPlayer.labelName + "</span> <img src='" + itemPlayer.poster + "' width='150px' height='150px' />";

        local.addEventListener("mouseenter", function(e) {
          // console.log("add");
          // (e.target as any).classList.add('bounceIn');
        })
        local.addEventListener("mouseleave", function(e) {
         //  console.log("remove");
         // (e.target as any).classList.remove('bounceIn');
        })

        local.addEventListener("click", function() {

          myInstance.selectPlayer(itemPlayer.labelName);

          const appStartGamePlay = createAppEvent("game-init",
          {
            game: myInstance.selectedPlayer,
          });

          (window as any).dispatchEvent(appStartGamePlay);

          popup.innerHTML = "";
          document.body.removeChild(popup);

        }, false);

        byId('listOfPlayers').appendChild(local);
        // popup.appendChild(local);

      });


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
          /*
             Re born from hard dead
             hard dead - body removed from scene

              setTimeout(function () {
                root.playerSpawn();
              }, this.playerDeadPauseInterval);

          */

          return;
      }
      setTimeout(function () {
        root.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
        root.player.render.visualComponent.shema = root.selectedPlayer.spriteTile;
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
