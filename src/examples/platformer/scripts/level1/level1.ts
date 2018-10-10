import * as Matter from "matter-js";
import TextureComponent from "../../../../libs/class/visual-methods/texture";
import Platformer from "../../platformer";
import { playerGroundCheck } from "../common";
import { staticGrounds } from "./map";
import { worldElement } from "../../../../libs/types/global";
/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */

export function level1(r: Platformer): void {

  const globalEvent = r.starter.ioc.get.GlobalEvent;
  const imgRes = [
    require("../../imgs/floor.png"),
    require("../../imgs/target.png")
  ];

  let playerRadius = 6;
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

  //this sensor check if the player is on the ground to enable jumping
   r.playerSensor = Matter.Bodies.rectangle(r.v.getWidth(50), r.v.getHeight(30), r.v.getWidth(playerRadius), 5, {
    isSensor: true,
    render: {
      visible: false,
    },
  });
 

  staticGrounds.forEach((item) => {

    let newStaticElement: worldElement =  Matter.Bodies.rectangle(
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
           olala: true
         },
        } as any | Matter.IBodyRenderOptions,
    });

    r.grounds.push(newStaticElement);

    ((r.grounds[r.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles);

  });

  Matter.World.add(r.starter.getWorld(),
    r.grounds as worldElement
  );

  // add bodies
  Matter.World.add(r.starter.getWorld(), [
    r.player,
  ]);

  /**
  this.globalEvent.attachEvent("onmousemove" , function(event) {
          // let nik = () => this.mouseConstraint.mouse.mouseup(event: MouseEvent);
          const bodiesUnder = Matter.Query.point( [r.player], { x: event.pageX, y: event.pageY });
          if (bodiesUnder.length > 0) {
            const bodyToClick = bodiesUnder[1];
            // console.log(bodyToClick);
          }
  });
  */

  let counter = 0;
  let scaleFactor = 0;

  Matter.Events.on(r.starter.getEngine(), "beforeUpdate", function (event) {
    counter += 1;

    if (counter === 40) {

      // Matter.Body.setStatic(bodyG, true);
      if (scaleFactor > 1) {
        // Matter.Body.scale(bodyF, scaleFactor, scaleFactor);
      }

    }

    Matter.Body.setAngle(r.player, -Math.PI * 0);

    if (counter >= 60 * 2.5) {

      //Matter.Body.setVelocity(r.player, { x: 0, y: -10 });
      counter = 0;
      scaleFactor = 1;

    }
  });

  const game = {
    cycle: 0,
    width: 1200,
    height: 800,
  };

  //at the start of a colision for player
  Matter.Events.on(r.starter.getEngine(), "collisionStart", function (event) {
    playerGroundCheck(event, true, r);
    // touchingPortals(event,portal0,portal1);
    // touchingPortals(event,portal1,portal0);
  });
  //ongoing checks for collisions for player
  Matter.Events.on(r.starter.getEngine(), "collisionActive", function (event) {
    playerGroundCheck(event, true, r);
  });
  //at the end of a colision for player set ground to false
  Matter.Events.on(r.starter.getEngine(), "collisionEnd", function (event) {
    playerGroundCheck(event, false, r);
    // exitingPortal(event,portal0);
    // exitingPortal(event,portal1);
  });

  Matter.Events.on(r.starter.getEngine(), "afterTick", function (event) {

    game.cycle++;

    // jump
    if (globalEvent.activeKey[38] &&
         r.player.ground && r.player.jumpCD < game.cycle) {

      r.player.ground = false;

      r.player.jumpCD = game.cycle + 1; //adds a cooldown to jump
      r.player.force = {
        x: 0,
        y: -0.05,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

    }

    else if (globalEvent.activeKey[37] && r.player.angularVelocity > -limit) {

      r.player.force = {
        x: -0.001,
        y: 0,
      };
      Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);

      // r.player.torque = -spin;

    } else {
      if (globalEvent.activeKey[39] && r.player.angularVelocity < limit) {

        r.player.force = {
          x: 0.001,
          y: 0,
        };
        Matter.Body.applyForce(r.player, { x: r.player.position.x, y: r.player.position.y }, r.player.force);
        // r.player.torque = spin;
      }
    }
  
  });

  globalEvent.activateKeyDetection();

  const limit = 0.3;

  Matter.Events.on(r.starter.getEngine(), "beforeTick", function (event) {

    let deltaCentre = Matter.Vector.sub( r.starter.getMouseConstraint().mouse.absolute, r.starter.getMap().viewportCentre),
    centreDist = Matter.Vector.magnitude(deltaCentre);

// translate the view if mouse has moved over 50px from the centre of viewport
if (centreDist > 50) {
    // create a vector to translate the view, allowing the user to control view speed
    var direction = Matter.Vector.normalise(deltaCentre),
        speed = Math.min(10, Math.pow(centreDist - 50, 2) * 0.0002);

        
    r.starter.getMap().translate = Matter.Vector.mult(direction, speed);

    // prevent the view moving outside the world bounds
    if (r.starter.getRender().bounds.min.x + r.starter.getMap().translate.x < r.starter.getWorld().bounds.min.x)
        r.starter.getMap().translate.x = r.starter.getWorld().bounds.min.x - r.starter.getRender().bounds.min.x;

    if (r.starter.getRender().bounds.max.x + r.starter.getMap().translate.x > r.starter.getWorld().bounds.max.x)
    r.starter.getMap().translate.x = r.starter.getWorld().bounds.max.x - r.starter.getRender().bounds.max.x;

    if (r.starter.getRender().bounds.min.y + r.starter.getMap().translate.y < r.starter.getWorld().bounds.min.y)
    r.starter.getMap().translate.y = r.starter.getWorld().bounds.min.y - r.starter.getRender().bounds.min.y;

    if (r.starter.getRender().bounds.max.y + r.starter.getMap().translate.y > r.starter.getWorld().bounds.max.y)
    r.starter.getMap().translate.y = r.starter.getWorld().bounds.max.y - r.starter.getRender().bounds.max.y;

    // move the view
    Matter.Bounds.translate(r.starter.getRender().bounds, r.starter.getMap().translate);
  }

    /*
    //spin left and right
    const spin = 0.05;
    const limit = 0.3;
    if (globalEvent.activeKey[37] && r.player.angularVelocity > -limit) {
      r.player.torque = -spin;
    } else {
      if (globalEvent.activeKey[39] && r.player.angularVelocity < limit) {
        r.player.torque = spin;
      }
    };
    */
  });

  console.log("LEVEL1 STARTED");

}
