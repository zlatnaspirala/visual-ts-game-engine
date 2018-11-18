import * as Matter from "matter-js";
import SpriteTextureComponent from "../../../../libs/class/visual-methods/sprite-animation";
import TextureComponent from "../../../../libs/class/visual-methods/texture";
import { worldElement } from "../../../../libs/types/global";
import Platformer from "../../platformer";
import { collisionCheck } from "../common";
import GameMap from "./map";
/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */

export function level1(r: Platformer): void {

  const globalEvent = r.starter.ioc.get.GlobalEvent;
  const gameMap = new GameMap(r.starter);

  r.starter.setWorldBounds(
    -r.starter.getView().getWidth(100),
    -r.starter.getView().getWidth(100),
    r.starter.getView().getWidth(100) * 3,
    r.starter.getView().getWidth(100) * 3,
  );

  const imgRes = [
    require("../../imgs/floor.png"),
    require("../../imgs/target.png"),
  ];

  const imgResMyPlayerSprite = [
    require("../../imgs/walk-boy2.png"),
  ];

  const playerRadius = 5;
  r.player = Matter.Bodies.circle(r.v.getWidth(50), r.v.getHeight(30), r.v.getWidth(playerRadius), {
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
      // wireframes: true,
      fillStyle: "blue",
      sprite: {
        xScale: 1,
        yScale: 1,
      },
    } as any,
  } as Matter.IBodyDefinition);
  r.player.collisionFilter.group = -1;
  r.player.render.visualComponent.keepAspectRatio = true;
  r.player.render.visualComponent.setHorizontalFlip(true);

  gameMap.getStaticBackgrounds().forEach((item) => {

    const newStaticElement: worldElement = Matter.Bodies.rectangle(
      r.v.getWidth(item.x),
      r.v.getHeight(item.y),
      r.v.getWidth(item.w),
      r.v.getHeight(item.h),
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
    r.grounds.push(newStaticElement);

    ((r.grounds[r.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
      setHorizontalTiles(item.tiles);

  });

  gameMap.getStaticGrounds().forEach((item) => {

    const newStaticElement: worldElement = Matter.Bodies.rectangle(
      r.v.getWidth(item.x),
      r.v.getHeight(item.y),
      r.v.getWidth(item.w),
      r.v.getHeight(item.h),
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
    r.grounds.push(newStaticElement);

    ((r.grounds[r.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
      setHorizontalTiles(item.tiles);

  });

  gameMap.getCollectitems().forEach((item) => {

    const newStaticElement: worldElement = Matter.Bodies.rectangle(
      r.v.getWidth(item.x),
      r.v.getHeight(item.y),
      r.v.getWidth(item.w),
      r.v.getHeight(item.h),
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
    r.grounds.push(newStaticElement);

    ((r.grounds[r.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles).
      setHorizontalTiles(item.tiles);

  });

  r.starter.AddNewBodies(r.grounds as worldElement);
  r.starter.AddNewBodies(r.player as worldElement);

  Matter.Events.on(r.starter.getEngine(), "beforeUpdate", function (event) {

    Matter.Body.setAngle(r.player, -Math.PI * 0);

    Matter.Bounds.shift(r.starter.getRender().bounds,
      {
        x: r.player.position.x - (window as any).innerWidth / 5,
        y: r.player.position.y - (window as any).innerHeight / 2,
      });

  });

  const limit = 0.3;

  // at the start of a colision for player
  Matter.Events.on(r.starter.getEngine(), "collisionStart", function (event) {
    collisionCheck(event, true, r);
  });

  // ongoing checks for collisions for player
  Matter.Events.on(r.starter.getEngine(), "collisionActive", function (event) {
    collisionCheck(event, true, r);
  });

  // at the end of a colision for player set ground to false
  Matter.Events.on(r.starter.getEngine(), "collisionEnd", function (event) {
    collisionCheck(event, false, r);
  });

  Matter.Events.on(r.starter.getEngine(), "afterTick", function (event) {

    // jump
    if (globalEvent.activeKey[38] && r.player.ground) {

      r.player.ground = false;
      r.player.force = {
        x: 0,
        y: -(r.starter.getView().getHeight(0.03)),
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);


    } else if (globalEvent.activeKey[37] && r.player.angularVelocity > -limit) {

      r.player.render.visualComponent.setHorizontalFlip(false);
      r.player.force = {
        x: -r.starter.getView().getHeight(0.001),
        y: 0,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    } else if (globalEvent.activeKey[39] && r.player.angularVelocity < limit) {

      r.player.render.visualComponent.setHorizontalFlip(true);
      r.player.force = {
        x: r.starter.getView().getHeight(0.001),
        y: 0,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    }

  });

  globalEvent.activateKeyDetection();

  Matter.Events.on(r.starter.getEngine(), "beforeTick", function (event) {

    // let ctx = r.starter.getRender().canvas.getContext("2d");
    // ctx.translate(window.innerWidth / 25, window.innerHeight / 25);
    // ctx.scale(this.zoom, this.zoom);
    // ctx.translate(-window.innerWidth / 25, -window.innerHeight / 25);
    // console.log("XXX", r.player.position.y);
  });

}
