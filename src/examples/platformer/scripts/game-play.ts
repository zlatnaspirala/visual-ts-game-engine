import * as Matter from "matter-js";
import BotBehavior from "../../../libs/class/bot-behavior";
import { byId } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";
import GameMap from "./map";
import Platformer from "./Platformer";
import Network from "../../../libs/class/networking/network";
import { IMultiplayer } from "../../../libs/interface/global";

/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */
class GamePlay extends Platformer implements IMultiplayer {

  private gamePlayWelcomeNote: string = "This application was created on visual-ts <br/>\
                                         Example: Real time multiplayer `Platformer` zlatnaspirala@gmail.com <br/>\
                                         General: MIT License <br/>\
                                         Copyright (c) 2019 Nikola Lukic zlatnaspirala@gmail.com Serbia Nis <br/>\
                                         Except: Folder src/libs with licence: <br/>\
                                         GNU LESSER GENERAL PUBLIC LICENSE Version 3 <br/>\
                                         Copyright (c) 2019 maximumroulette.com ";
  public multiPlayerRef: any = {
    root: this,
    init: function (rtcEvent) {

      console.log("rtcEvent addNewPlayer: ", rtcEvent);
      this.root.addNetPlayer(this.root, rtcEvent);
      // this.root.attachNetMatterEvent();

    },

    update: function (multiplayer) {

      if (multiplayer.data.netPos) {

        Matter.Body.setPosition(this.root.netBodies["netObject_" + multiplayer.userid], { x: multiplayer.data.netPos.x, y: multiplayer.data.netPos.y })

        Matter.Body.setAngle(
          this.root.netBodies["netObject_" + multiplayer.userid],
          -Math.PI * 0
        );

        if (multiplayer.data.netDir) {
          if (multiplayer.data.netDir === "left") {
            this.root.netBodies["netObject_" + multiplayer.userid].render.visualComponent.setHorizontalFlip(false);
          } else if (multiplayer.data.netDir === "right") {
            this.root.netBodies["netObject_" + multiplayer.userid].render.visualComponent.setHorizontalFlip(true);
          }
        }


      } else if (multiplayer.data.noMoreLives === true) {
        // What to do with gameplay ?!
        // Just hide or hard variand
        // server database politic make clear player is out of game
        // bis logic - Initator must have credibility

        // Not tested Soft
        this.root.netBodies["netObject_" + multiplayer.userid].render.visible = false;
        console.log(" VISIBLE FALSE FOR ET OBJECT");
        // Hard make exit if netPlayer is initator
        // Hard - exit game - if game logic

      }


    },

    /**
     * If someone leaves all client actions is here
     * - remove from scene
     * - clear object from netObject_x
     */
    leaveGamePlay: function (rtcEvent) {

      console.info("rtcEvent LEAVE GAME: ", rtcEvent.userid);
      this.root.starter.destroyBody(this.root.netBodies["netObject_" + rtcEvent.userid]);
      delete this.root.netBodies["netObject_" + rtcEvent.userid];

    }

  };

  constructor(starter: Starter) {

    super(starter);
    if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      this.load();
    }

    // check this with config flag
    this.network = starter.ioc.get.Network;
    this.network.injector = this.multiPlayerRef;

    // MessageBox
    this.starter.ioc.get.MessageBox.show(this.gamePlayWelcomeNote);

  }

  public attachAppEvents = () => {

    const myInstance = this;

    window.addEventListener("game-init", function (e) {

      try {
        if ((e as any).detail &&
           ((e as any).detail.data.game !== "undefined" &&
           ( e as any).detail.data.game !== null &&
           ( e as any).detail.data.game.label === "player")) {
          console.warn("Bad #00002 game-init attempt.");
          return;

        } else if ((e as any).detail &&
                  (e as any).detail.data.game === null ) {
          console.info("game-init Player spawn. data.game === null");
          myInstance.starter.ioc.get.Network.connector.startNewGame(myInstance.gameName);
          myInstance.playerSpawn(true);
          return;

        }

        // How to access netwoking
        myInstance.starter.ioc.get.Network.connector.startNewGame(myInstance.gameName);
        myInstance.load();
        console.info("Player spawn. game-init .startNewGame");
      } catch (err) { console.error("Very bad #00001", err); }

    });

    window.addEventListener("game-end", function (e) {

      try {
        if ((e as any).detail &&
           (e as any).detail.data.game !== "undefined" &&
           (e as any).detail.data.game !== null &&
           (e as any).detail.data.game === myInstance.gameName) {

            myInstance.starter.destroyGamePlay();
            (byId("playAgainBtn") as HTMLButtonElement).disabled = true;
            (byId("openGamePlay") as HTMLButtonElement).disabled = false;
            (byId("out-of-game") as HTMLButtonElement).disabled = true;

            myInstance.starter.ioc.get.Network.connector.memo.save("activeGame", "none");
            myInstance.starter.ioc.get.Network.nameUI.disabled = (this as any).disabled = false;
            myInstance.starter.ioc.get.Network.connectUI.disabled = (this as any).disabled = false;
            myInstance.deattachMatterEvents();
            // Leave
            myInstance.starter.ioc.get.Network.rtcMultiConnection.leave();
            myInstance.starter.ioc.get.Network.rtcMultiConnection.disconnect();
            myInstance.netBodies = {};
            console.info("game-end global event. Destroying game play. DISCONNECT");

        }
      } catch (err) { console.error("Very bad #00003", err); }

    });

  }

  private deattachMatterEvents() {
    Matter.Events.off(this.starter.getEngine(), undefined, undefined);
  }

  private attachMatterEvents() {

    const root = this;
    const globalEvent = this.starter.ioc.get.GlobalEvent;
    const playerSpeed = 0.005;
    const deadZoneByY = 2700;

    this.enemys.forEach(function (item) {
      const test = new BotBehavior(item);
      test.patrol();
    });

    Matter.Events.on(this.starter.getEngine(), "beforeUpdate", function (event) {

      if (!root.player) { return; }

      if (root.player && root.player.position.y > deadZoneByY) {
        root.playerDie(root.player);
      }

      if (root.player) {
        Matter.Body.setAngle(root.player, -Math.PI * 0);
      // Matter.Body.setAngle(root.enemys[0] as Matter.Body, -Math.PI * 0);

        Matter.Bounds.shift(root.starter.getRender().bounds,
        {
          x: root.player.position.x - 400,
          y: root.player.position.y - 300,
        });

        root.network.rtcMultiConnection.send({
          netPos: root.player.position,
          netDir: root.player.currentDir
        });

      }
    });

    const limit = 0.3;

    // at the start of a colision for player
    Matter.Events.on(this.starter.getEngine(), "collisionStart", function (event) {
      root.collisionCheck(event, true);
    });

    // ongoing checks for collisions for player
    Matter.Events.on(this.starter.getEngine(), "collisionActive", function (event) {
      root.collisionCheck(event, true);
    });

    // at the end of a colision for player set ground to false
    Matter.Events.on(this.starter.getEngine(), "collisionEnd", function (event) {
      root.collisionCheck(event, false);
    });

    Matter.Events.on(this.starter.getEngine(), "afterTick", function (event) {

      if (!root.player) { return; }
      // jump
      if (globalEvent.activeKey[38] && root.player.ground) {

        const s = (root.player.circleRadius * playerSpeed);
        root.player.ground = false;
        root.player.force = {
          x: 0,
          y: -(s),
        };
        Matter.Body.setVelocity(root.player, { x: 0, y: -s });
        // this.player.currentDir = "jump";

      } else if (globalEvent.activeKey[37] && root.player.angularVelocity > -limit) {

        root.player.render.visualComponent.setHorizontalFlip(false);
        root.player.force = {
          x: -playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);
        root.player.currentDir = "left";

      } else if (globalEvent.activeKey[39] && root.player.angularVelocity < limit) {

        root.player.render.visualComponent.setHorizontalFlip(true);
        root.player.force = {
          x: playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);
        root.player.currentDir = "right";

      } else {
        root.player.currentDir = "idle";
      }

    });

    globalEvent.activateKeyDetection();

  }

  private load() {

    const root = this;
    const gameMap: GameMap = new GameMap();

    // Override data from starter.
    this.starter.setWorldBounds(-300, -300, 10000, 2700);

    this.playerSpawn(false);

    gameMap.getStaticBackgrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "background",
          render: {
            visualComponent: new TextureComponent("wall", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      newStaticElement.collisionFilter.group = -1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles.tilesY).
        setHorizontalTiles(item.tiles.tilesX);

    });

    gameMap.getStaticGrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "ground",
          collisionFilter: {
            group: this.staticCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgGround", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });

      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles.tilesX).
        setHorizontalTiles(item.tiles.tilesY);

    });

    gameMap.getCollectItems().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.colectionLabel,
          collisionFilter: {
            group: this.staticCategory,
             mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgCollectItem1", item.tex),
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      (newStaticElement.render as any).visualComponent.setVerticalTiles(item.tiles.tilesY).
        setHorizontalTiles(item.tiles.tilesX);
      this.grounds.push(newStaticElement);

    });

    gameMap.getEnemys().forEach((item) => {

      let enemySprite;

      if (item.colectionLabel === "enemy_crapmunch") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 10, byY: 1 });
      } else if (item.colectionLabel === "enemy_chopper") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 5, byY: 1 });
      }

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: false,
          label: item.colectionLabel,
          density: 0.0005,
          friction: 0.01,
          frictionAir: 0.06,
          restitution: 0.3,
          collisionFilter: {
            group: this.staticCategory,
            mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: enemySprite,
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any | Matter.IBodyRenderOptions,
        });

      (newStaticElement.render as any).visualComponent.keepAspectRatio = true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);
      this.enemys.push(newStaticElement);

    });

    gameMap.getDeadLines().forEach((item) => {

      let enemySprite;
      enemySprite = new SpriteTextureComponent("deadline", item.tex, { byX: item.tiles.tilesX, byY: item.tiles.tilesY });

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.colectionLabel,
          density: 0.0005,
          friction: 0.01,
          frictionAir: 0.06,
          restitution: 0.3,
          collisionFilter: {
            group: -1,
            mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: enemySprite,
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any | Matter.IBodyRenderOptions,
        });

      (newStaticElement.render as any).visualComponent.keepAspectRatio = true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);

      this.deadLines.push(newStaticElement);

    });

    gameMap.getStaticBanners().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "Label Text",
          render: {
            visualComponent: new TextComponent(item.text, item.options!),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      newStaticElement.collisionFilter.group = -1;
      this.labels.push(newStaticElement);

    });

    this.starter.AddNewBodies(this.grounds as worldElement);
    this.starter.AddNewBodies(this.enemys as worldElement);
    this.starter.AddNewBodies(this.deadLines as worldElement);
    this.starter.AddNewBodies(this.player as worldElement);
    this.starter.AddNewBodies(this.labels as worldElement);
    // this.createHud();
    this.attachMatterEvents();

  }

}

export default GamePlay;
