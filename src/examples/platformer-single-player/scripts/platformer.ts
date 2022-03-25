import Matter = require("matter-js");
import { byId, createAppEvent, htmlHeader } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import { DEFAULT_GAMEPLAY_ROLES, DEFAULT_PLAYER_DATA } from "../../../libs/defaults";
import { IGamePlayModel, IPoint, ISelectedPlayer } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";
import Level1 from "./packs/level1";
import Level2 from "./packs/level2";
import Level3 from "./packs/level3";
import Level4 from "./packs/level4";
import Level5 from "./packs/level5";
import Level6 from "./packs/level6";

// Prepare audios
require("../audios/map-themes/mishief-stroll.mp4");

/**
 * @author Nikola Lukic
 * @class Platformer Single player solution.
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

  public selectedPlayer: ISelectedPlayer;
  private selectPlayerArray: ISelectedPlayer[] = [];
  private lives: number = DEFAULT_PLAYER_DATA.INITIAL_LIVES;
  private preventDoubleExecution: boolean = false;
  private playerStartPositions: IPoint[] = [{x: 120, y: 200}];
  private playerDeadPauseInterval: number = 550;

  private UIPlayerBoard: HTMLDivElement;
  private UIPlayAgainBtn: HTMLDivElement;
  private UISoundOptionDom: HTMLDivElement;

  private levelMaps: any = {
    generatedMap: Level1,
    Level1,
    Level2,
    Level3,
    Level4,
    Level5,
    Level6,
  };

  constructor(starter: Starter) {

    this.starter = starter;
    // this.starter.getEngine().enableSleeping = true;
    this.initSelectPlayer();
    this.addUIPlayerBoard();
    this.showPlayerBoardUI();
    this.attachUpdateLives();

   // this.starter.ioc.get.Sound.audioBox['surfaceLevel'].play();

  }

  public initSelectPlayer() {

    // Create UI for basic select player features.
    // Register

    /*
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
    */

    this.selectPlayerArray.push({
      labelName: "nidzica",
      poster: require("../imgs/players/nidzica/posterNidzica.png"),
      resource: [
        require("../imgs/players/nidzica/nidzica-running.png"),
        require("../imgs/explosion/explosion.png"),
        require("../imgs/players/nidzica/nidzica-idle.png"),
      ],
      type: "sprite",
      spriteTile: {run: { byX: 5, byY: 1 }, idle: { byX: 3, byY: 1 }},
      spriteTileCurrent: "run",
      setCurrentTile(key: string) {
        this.spriteTileCurrent = key;
      },
    });

    this.selectPlayerArray.push({
      labelName: "smartGirl",
      poster: require("../imgs/players/smart-girl/poster.png"),
      resource: [
        require("../imgs/players/smart-girl/smart-girl.png"),
        require("../imgs/explosion/explosion.png"),
        require("../imgs/players/smart-girl/smart-girl-idle.png"),
      ],
      type: "sprite",
      spriteTile: {run: { byX: 5, byY: 1 }, idle: { byX: 5, byY: 1 }},
      spriteTileCurrent: "idle",
      setCurrentTile(key: string) {
        this.spriteTileCurrent = key;
      },
    });

  }

  public createPlayer(addToScene: boolean) {

    const sptTexCom = new SpriteTextureComponent(
      "playerImage",
      (this.selectedPlayer.resource as any),
      ( { byX: 5, byY: 1 } as any),
    );

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
        jumpAmp: 0.35,
        portal: -1,
        collisionFilter: {
          category: this.playerCategory,
        } as any,
        render: {
          visualComponent: sptTexCom,
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
      this.player.render.visualComponent.keepAspectRatio = true;
      // hardcode for now
      this.player.render.sprite.xScale = 0.2;
      this.player.render.sprite.yScale = 0.2;
    }
    this.player.render.visualComponent.setHorizontalFlip(false);

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

    const myInstance = this;

    const pairs = event.pairs;
    for (let i = 0, j = pairs.length; i !== j; ++i) {
      const pair = pairs[i];
      if (pair.activeContacts) {

        // single player teleport
        // collectItemPoint used , this is next type :
        // nextLevelItem or teleport
        // Destroy world , player create next game play
        if (pair.bodyA.label === "player" && pair.bodyB.label.indexOf("Level") !== -1) {
          const nextLevelItem = pair.bodyB.label;
          myInstance.nextLevel(nextLevelItem);
        }

        if (pair.bodyA.label === "player" && pair.bodyB.label === "collectItemPoint") {
          const collectitem = pair.bodyB;
          this.starter.destroyBody(collectitem);
          this.starter.ioc.get.Sound.playById('collectItem');
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
    fetch("./templates/ui/single-player-board.html", {
      headers: htmlHeader,
    }).
    then(function (res) {
      return res.text();
    }).then(function (html) {
      myInstance.UIPlayerBoard = byId("UIPlayerBoard") as HTMLDivElement;
      myInstance.UIPlayerBoard.innerHTML = html;
      myInstance.UIPlayerBoard.style.display = "block";
      myInstance.UIPlayAgainBtn = byId("playAgainBtn") as HTMLDivElement;
      myInstance.UISoundOptionDom = byId("soundOptionDom") as HTMLDivElement;

      /**
       * @description In gameplay Enable od disable sounds.
       * New aproach `()=>` next migration.
       */
      myInstance.UISoundOptionDom.addEventListener("click", function(e) {
      if ((e.currentTarget as HTMLElement).innerHTML == "Sound:Off") {
        myInstance.starter.ioc.get.Sound.audioBox.bgMusic.pause();
        myInstance.starter.ioc.get.Sound.audioBox.noSound = true;
        (e.currentTarget as HTMLElement).innerText = "Sound:On";
      } else {
        myInstance.starter.ioc.get.Sound.audioBox.noSound = false;
        myInstance.starter.ioc.get.Sound.playById('bgMusic');
        (e.currentTarget as HTMLElement).innerText = "Sound:Off";
      }
      });

      myInstance.UIPlayAgainBtn.addEventListener("click", function () {

        // hard
         myInstance.destroyGamePlayPlatformer();

         (this as any).disabled = true;
         byId("UIPlayerLives").innerText = "3";
         myInstance.lives = DEFAULT_PLAYER_DATA.INITIAL_LIVES;

         const appStartGamePlay = createAppEvent("game-init",
        {
          mapName: "Level1",
          game: myInstance.levelMaps.Level1,
        });

         (window as any).dispatchEvent(appStartGamePlay);

         myInstance.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
         myInstance.selectedPlayer.spriteTileCurrent = "run";
         myInstance.player.render.visualComponent.setNewShema(myInstance.selectedPlayer);
         myInstance.player.render.visualComponent.seqFrameX.setDelay(8);

      }, false);

    });

    // Select Player feature - Load UI
    fetch("./templates/ui/select-player.html", {
      headers: htmlHeader,
    }).
    then(function (res) {
      return res.text();
    }).then(function (html) {

      const popup = byId("popup") as HTMLDivElement;
      popup.innerHTML = html;
      popup.style.display = "block";

      myInstance.selectPlayerArray.forEach(function (itemPlayer) {

        const local = document.createElement("div");
        local.id = "" + itemPlayer.labelName;
        local.className = "bounceIn";
        local.setAttribute("style", "width:30%;display:inline-block;cursor:pointer;text-align:center;padding: 9px;");
        local.innerHTML = "<span> Name:" +
          itemPlayer.labelName +
          "</span> <img src='" +
          itemPlayer.poster +
          "' width='150px' height='150px' class='selectPlayerItemBox' />";

        local.addEventListener("click", function () {

          myInstance.selectPlayer(itemPlayer.labelName);
          const appStartGamePlay = createAppEvent(
            "game-init",
            {
              mapName: "Level1",
              game: myInstance.levelMaps.Level1,
            },
          );
          (window as any).dispatchEvent(appStartGamePlay);

          popup.innerHTML = "";
          document.body.removeChild(popup);

          // Play music in background
          myInstance.starter.ioc.get.Sound.createAudio("./audios/sb_indreams.mp3", "bgMusic");
          myInstance.starter.ioc.get.Sound.createAudio("./audios/collect-item.mp3", "collectItem");
          myInstance.starter.ioc.get.Sound.createAudio("./audios/dead.mp3", "dead");
          myInstance.starter.ioc.get.Sound.createAudio("./audios/jump.mp3", "jump");
          // Correct bg Music
          myInstance.starter.ioc.get.Sound.audioBox.bgMusic.volume = 0.3;
        }, false);

        byId("listOfPlayers").appendChild(local);
        // popup.appendChild(local);

      });

    });

  }

  protected selectPlayer(labelName: string = "nidzica") {

    this.selectPlayerArray.forEach((element) => {
      if (element.labelName === labelName) {
        this.selectedPlayer = element;
      }
    });

  }

  protected playerDie(collectitem) {

    if (!this.preventDoubleExecution) {
      const root = this;
      this.preventDoubleExecution = true;
      // Hard dead
      // this.starter.destroyBody(collectitem);
      console.info("What is destroyed : ", collectitem);
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

          this.starter.ioc.get.Sound.playById('dead');
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
        root.selectedPlayer.spriteTileCurrent = "run";
        // create general method !
        root.player.render.visualComponent.setNewShema(root.selectedPlayer);
        root.starter.ioc.get.Sound.playById('dead');

        setTimeout(function () {
        // Soft dead for now
        Matter.Body.setPosition(root.player, root.playerStartPositions[0]);
        root.playerSpawn(false);
        root.preventDoubleExecution = false;
      }, this.playerDeadPauseInterval * 10);

      }, this.playerDeadPauseInterval);
    }

  }

  protected destroyGamePlayPlatformer() {
    this.starter.destroyGamePlay();
    this.starter.deattachMatterEvents();
    this.grounds = [];
    this.enemys = [];
    this.deadLines = [];
    this.labels = [];
  }

  private attachUpdateLives = () => {

    const root = this;
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

  /**
   * @description Jump intro new wourld.
   * @param data
   * @type Void
   */
  private nextLevel(data) {

    const root = this;

    if (data.indexOf("Level") !== -1) {

      const appEndGamePlay = createAppEvent("game-end", { game: "Level1" });
      (window as any).dispatchEvent(appEndGamePlay);
      // this.player = null;
      root.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
      root.selectedPlayer.spriteTileCurrent = "run";
      root.player.render.visualComponent.setNewShema(root.selectedPlayer);
      root.player.render.visualComponent.seqFrameX.setDelay(8);
      Matter.Body.setPosition(root.player, root.playerStartPositions[0]);

      setTimeout(function () {
        const appStartGamePlay = createAppEvent("game-init", {
          mapName: data,
          game: root.levelMaps[data],
        });
        (window as any).dispatchEvent(appStartGamePlay);
      }, DEFAULT_GAMEPLAY_ROLES.RESPAWN_INTERVAL);

    }

  }

}
export default Platformer;
