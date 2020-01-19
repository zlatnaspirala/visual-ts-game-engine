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

/**
 * Manage Level's here
 */


/**
 * @description Finally game start at here
 * @function Init start class and begin with matter.js scene rendering.
 * @return void
 */
class GamePlay extends Platformer {

  private gamePlayWelcomeNote: string = "This application was created on visual-ts <br/>\
                                         Example: Single player `Platformer` zlatnaspirala@gmail.com <br/>\
                                         General: MIT License <br/>\
                                         Copyright (c) 2020 Nikola Lukic zlatnaspirala@gmail.com Serbia Nis <br/>\
                                         Except: Folder src/libs with licence: <br/>\
                                         GNU LESSER GENERAL PUBLIC LICENSE Version 3 <br/>\
                                         Copyright (c) 2020 maximumroulette.com ";

  /**
   * @description deadZoneForBottom Definition and Default value
   * - overrided from map or map2d(generated) by deadLines object
   * DeadLines object in future can be used for enemy static action
   * Next : deadZoneForLeft , deadZoneForRight
   * this.starter.setWorldBounds(-300, -300, 10000, root.deadZoneForBottom);
   * */
  private deadZoneForBottom: number  = 4500;
  private deadZoneForRight: number  = 20000;

  constructor(starter: Starter) {

    super(starter);

    // Implement to the multiplayer solution ...
    // levelManager

    // depend on config
    /* if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      this.load();
    }*/

    // Load in anyway
    // this.load();

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
           typeof ( e as any).detail.data.game.label !== "undefined" &&
           ( e as any).detail.data.game.label === "player")) {
          console.warn("Bad #2 game-init attempt.");
          return;

        } else if ((e as any).detail &&
                  (e as any).detail.data.game === null ) {
          console.info("game-init Player spawn. Player are not destroyed at this moment...");
          myInstance.playerSpawn(true);
          return;

        }

        console.info("Loading map: " + (e as any).detail.data.game)
        myInstance.load((e as any).detail.data.game);
        console.info("Player spawn on game-init");
      } catch (err) { console.error("Very bad in game-init #1", err); }

    });

    window.addEventListener("game-end", function (e) {

      try {
        if ((e as any).detail &&
           (e as any).detail.data.game !== "undefined" &&
           (e as any).detail.data.game !== null
           /*(e as any).detail.data.game === myInstance.gameName*/ ) {

            // myInstance.starter.destroyGamePlay();
            myInstance.destroyGamePlayPlatformer();
            (byId("playAgainBtn") as HTMLButtonElement).disabled = true;
            // try {
              // (byId("openGamePlay") as HTMLButtonElement).disabled = false;
            // } catch(e) {}
            (byId("out-of-game") as HTMLButtonElement).disabled = true;

            myInstance.deattachMatterEvents();

            console.info("game-end global event. Destroying game play. DISCONNECT");

        }
      } catch (err) { console.error("Very bad #00003", err); }

    });

  }

  private deattachMatterEvents() {
    Matter.Events.off(this.starter.getEngine(), undefined, undefined);
    console.info(" Matter.Events.off(this.starter.getEngine(), undefined, undefined); ")
  }

  private attachMatterEvents() {

    const root = this;
    const globalEvent = this.starter.ioc.get.GlobalEvent;
    const playerSpeed = 0.005;

    this.enemys.forEach(function (item) {
      const test = new BotBehavior(item);
      test.patrol();
    });

    Matter.Events.on(this.starter.getEngine(), "beforeUpdate", function (event) {

      if (!root.player) { return; }

      if (root.player && root.player.position.y > root.deadZoneForBottom) {
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

        if (root.player.velocity.x < 0.00001 && root.player.velocity.y == 0 &&
          root.player.currentDir == "idle" ) {
        }

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

        root.player.render.visualComponent.setHorizontalFlip(true);
        root.player.force = {
          x: -playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);
        root.player.currentDir = "left";

      } else if (globalEvent.activeKey[39] && root.player.angularVelocity < limit) {

        root.player.render.visualComponent.setHorizontalFlip(false);
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

  private load(mapPack?) {

    const root = this;

    if (typeof mapPack === "undefined") {
      mapPack = generatedMap;
    }
    const gameMap: GameMap = new GameMap(mapPack);

    /**
     * @description Override data from starter.
     */
    this.starter.setWorldBounds(-300, -300, root.deadZoneForRight, root.deadZoneForBottom);

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

      if (item.enemyLabel === "crapmunch") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 10, byY: 1 });
      } else if (item.enemyLabel === "chopper") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 5, byY: 1 });
      }

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: false,
          label: item.enemyLabel,
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


      root.deadZoneForBottom = item.y;

      enemySprite = new SpriteTextureComponent("deadline", item.tex, { byX: item.tiles.tilesX, byY: item.tiles.tilesY });

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.enemyLabel,
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

  private levelsChooser (): void {

  }

}

export default GamePlay;
