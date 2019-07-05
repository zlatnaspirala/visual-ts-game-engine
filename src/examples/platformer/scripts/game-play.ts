import * as Matter from "matter-js";
import BotBehavior from "../../../libs/class/bot-behavior";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import Ioc from "../../../libs/ioc";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";
import GameMap from "./map";
import Platformer from "./Platformer";

/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */
class GamePlay extends Platformer {

  private network;

  constructor(starter: Starter) {

    super(starter);
    // myInstance.starter.ioc.get.Network
    if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      this.load();
    }

  }

  public attachAppEvents = () => {

    const myInstance = this;

    window.addEventListener("game-init", function (e) {

      if (e) {
        console.log("Test !?!?", e);
      }
      // How to access netwoking
      myInstance.starter.ioc.get.Network.connector.startNewGame();
      myInstance.load();
      console.log("game-init event triggered test: ", e);

    });
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

    // Disabled for now.
    // Matter.Events.on(this.starter.getEngine(), "beforeTick", function (event) {});

    Matter.Events.on(this.starter.getEngine(), "beforeUpdate", function (event) {

      if (root.player && root.player.position.y > deadZoneByY) {
        root.playerDie(root.player);
      }

      if (root.player) { Matter.Body.setAngle(root.player, -Math.PI * 0); }
      // Matter.Body.setAngle(root.enemys[0] as Matter.Body, -Math.PI * 0);

      Matter.Bounds.shift(root.starter.getRender().bounds,
        {
          x: root.player.position.x - 400,
          y: root.player.position.y - 300,
        });

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

      // jump
      if (globalEvent.activeKey[38] && root.player.ground) {

        const s = (root.player.circleRadius * playerSpeed);
        root.player.ground = false;
        root.player.force = {
          x: 0,
          y: -(s),
        };
        Matter.Body.setVelocity(root.player, { x: 0, y: -s });

      } else if (globalEvent.activeKey[37] && root.player.angularVelocity > -limit) {

        root.player.render.visualComponent.setHorizontalFlip(false);
        root.player.force = {
          x: -playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);

      } else if (globalEvent.activeKey[39] && root.player.angularVelocity < limit) {

        root.player.render.visualComponent.setHorizontalFlip(true);
        root.player.force = {
          x: playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);

      }

    });

    globalEvent.activateKeyDetection();

  }

  private load() {

    const root = this;
    const gameMap: GameMap = new GameMap();

    // Override data from starter.
    this.starter.setWorldBounds(-300, -300, 10000, 2700);

    this.playerSpawn();

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
            visualComponent: new TextComponent(item.text),
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
    this.createHud();
    this.attachMatterEvents();

  }

}

export default GamePlay;
