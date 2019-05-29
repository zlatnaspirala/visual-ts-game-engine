import * as Matter from "matter-js";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextureComponent from "../../../libs/class/visual-methods/texture";
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

  constructor(starter: Starter) {

    super(starter);

    if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      this.load();
    }

  }

  private attachMatterEvents () {

    const root = this;
    const globalEvent = this.starter.ioc.get.GlobalEvent;
    const playerSpeed = 0.005;

    // Disabled for now.
    // Matter.Events.on(this.starter.getEngine(), "beforeTick", function (event) {});

    Matter.Events.on(this.starter.getEngine(), "beforeUpdate", function (event) {

      Matter.Body.setAngle(root.player, -Math.PI * 0);

      Matter.Body.setAngle(root.enemys[0] as Matter.Body, -Math.PI * 0);

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

    // TEST
    setInterval (function () {

      Matter.Body.setVelocity(root.enemys[0] as Matter.Body, { x: 15, y: -1 });

     // Matter.Body.applyForce(root.enemys[2] as Matter.Body,
   //     { x: (root.enemys[2] as Matter.Body).position.x, y: (root.enemys[2] as Matter.Body).position.y }, { x: 25, y: 1 }  );

    }, 2000);

  }

  private load () {

    const root = this;
    const gameMap: GameMap = new GameMap();

    const playerCategory = 0x0002,
          staticCategory = 0x0004;

    // Override data from starter.
    this.starter.setWorldBounds(0, 0, 10000, 3000);

    const imgResMyPlayerSprite = [
      require("../imgs/walk-boy2.png"),
    ];

    const playerRadius = 50;

    this.player = Matter.Bodies.circle(100, 100, playerRadius, {
      label: "player",
      density: 0.0005,
      friction: 0.01,
      frictionAir: 0.06,
      restitution: 0.3,
      ground: true,
      jumpCD: 0,
      portal: -1,
      collisionFilter: {
        category: playerCategory,
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

    gameMap.getStaticBackgrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "background",
        //  collisionFilter: {
         //   category: backgroundCategory,
            // group: item.collisionFilter.group,
            // mask: item.collisionFilter.mask,
        //  } as any,
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
            group: staticCategory,
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

    gameMap.getCollectitems().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.colectionLabel,
          collisionFilter: {
            group: staticCategory,
            mask: playerCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgCollectItem", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });

      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
        setHorizontalTiles(item.tiles);

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
            group: staticCategory,
            mask: playerCategory,
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

    gameMap.getEnemys().forEach((item) => {

      let enemySprite;
      enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 7, byY: 1 });

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
            group: staticCategory,
            mask: playerCategory,
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
      this.starter.AddNewBodies(newStaticElement as worldElement);
      // this.enemys.push(newStaticElement);

    });

    this.starter.AddNewBodies(this.grounds as worldElement);
    this.starter.AddNewBodies(this.player as worldElement);
    this.starter.AddNewBodies(this.enemys as worldElement);

    this.attachMatterEvents();

    }

}

export default GamePlay;
