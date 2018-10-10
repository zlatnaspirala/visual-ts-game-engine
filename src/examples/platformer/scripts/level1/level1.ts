import * as Matter from "matter-js";
import TextureComponent from "../../../../libs/class/visual-methods/texture";
import { worldElement } from "../../../../libs/types/global";
import Platformer from "../../platformer";
import { playerGroundCheck } from "../common";
import { staticGrounds } from "./map";
/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */

export function level1(r: Platformer): void {

  const globalEvent = r.starter.ioc.get.GlobalEvent;
  const imgRes = [
    require("../../imgs/floor.png"),
    require("../../imgs/target.png"),
  ];

  const playerRadius = 6;
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
      visualComponent: new TextureComponent(imgRes),
      // wireframes: true,
      fillStyle: "blue",
      sprite: {
        xScale: r.v.getHeight(0.1),
        yScale: r.v.getHeight(0.1),
        lalala: true,
      },
    } as any,
  } as Matter.IBodyDefinition);
  r.player.collisionFilter.group = -1;
  r.player.render.visualComponent.keepAspectRatio = true;

  staticGrounds.forEach((item) => {

    const newStaticElement: worldElement = Matter.Bodies.rectangle(
      r.v.getWidth(item.x),
      r.v.getHeight(item.y),
      r.v.getWidth(item.w),
      r.v.getHeight(item.h),
      {
        isStatic: true,
        label: "ground",
        render: {
          visualComponent: new TextureComponent(item.tex),
          sprite: {
            olala: true,
          },
        } as any | Matter.IBodyRenderOptions,
      });

    r.grounds.push(newStaticElement);

    ((r.grounds[r.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles);

  });

  Matter.World.add(r.starter.getWorld(),
    r.grounds as worldElement,
  );

  // add bodies
  Matter.World.add(r.starter.getWorld(), [
    r.player,
  ]);

  Matter.Events.on(r.starter.getEngine(), "beforeUpdate", function(event) {

    Matter.Body.setAngle(r.player, -Math.PI * 0);

    Matter.Bounds.shift(r.starter.getRender().bounds,
      {
        x: r.player.position.x - window.innerWidth / 5,
        y: r.player.position.y - window.innerHeight / 2,
      });

  });

  const limit = 0.3;

  // at the start of a colision for player
  Matter.Events.on(r.starter.getEngine(), "collisionStart", function(event) {
    playerGroundCheck(event, true, r);
    // touchingPortals(event,portal0,portal1);
    // touchingPortals(event,portal1,portal0);
  });
  // ongoing checks for collisions for player
  Matter.Events.on(r.starter.getEngine(), "collisionActive", function(event) {
    playerGroundCheck(event, true, r);
  });
  // at the end of a colision for player set ground to false
  Matter.Events.on(r.starter.getEngine(), "collisionEnd", function(event) {
    playerGroundCheck(event, false, r);
    // exitingPortal(event,portal0);
    // exitingPortal(event,portal1);
  });

  Matter.Events.on(r.starter.getEngine(), "afterTick", function(event) {

    // jump
    if (globalEvent.activeKey[38] && r.player.ground) {

      r.player.ground = false;

      // r.player.jumpCD = game.cycle + 1; //adds a cooldown to jump
      r.player.force = {
        x: 0,
        y: -0.05,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    } else if (globalEvent.activeKey[37] && r.player.angularVelocity > -limit) {

      r.player.force = {
        x: -0.001,
        y: 0,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    } else if (globalEvent.activeKey[39] && r.player.angularVelocity < limit) {

      r.player.force = {
        x: 0.001,
        y: 0,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    }

  });

  globalEvent.activateKeyDetection();

  Matter.Events.on(r.starter.getEngine(), "beforeTick", function(event) {

    // let ctx = r.starter.getRender().canvas.getContext("2d");
    // ctx.translate(window.innerWidth / 25, window.innerHeight / 25);
    // ctx.scale(this.zoom, this.zoom);
    // ctx.translate(-window.innerWidth / 25, -window.innerHeight / 25);

  });

}
