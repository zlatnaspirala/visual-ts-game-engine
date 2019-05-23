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

  private load () {

    const root = this;
    const gameMap = new GameMap(this.starter);

    // Override data from starter.
    this.starter.setWorldBounds(0, 0, 10000, 3000);

    const imgRes = [
      require("../imgs/floor.png"),
      require("../imgs/target.png"),
    ];

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
        category: 1,
        group: 1,
        mask: 1,
      },
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
          collisionFilter: {
            category: item.collisionFilter.category,
            group: item.collisionFilter.group,
            mask: item.collisionFilter.mask,
          },
          render: {
            visualComponent: new TextureComponent("wall", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      newStaticElement.collisionFilter.group = -1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
        setHorizontalTiles(item.tiles);

    });

    gameMap.getStaticGrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "ground",
          collisionFilter: {
            category: 1,
            group: 1,
            mask: 1,
          },
          render: {
            visualComponent: new TextureComponent("imgGround", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      // newStaticElement.collisionFilter.group = -1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
        setHorizontalTiles(item.tiles);

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
            category: 1,
            group: 0,
            mask: 1,
          },
          render: {
            visualComponent: new TextureComponent("imgCollectItem", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      // newStaticElement.collisionFilter.group = -1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
        setHorizontalTiles(item.tiles);

    });

    this.starter.AddNewBodies(this.grounds as worldElement);
    this.starter.AddNewBodies(this.player as worldElement);

    this.attachMatterEvents();
    }

}

export default GamePlay;
