import * as Matter from "matter-js";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import Platformer from "../platformer";
import { playerGroundCheck } from "./common";
  /**
   * @description Finally game start at here
   * @function level1
   * @return void
   */

export function level1(r: Platformer): void {

    const globalEvent = r.starter.ioc.get.GlobalEvent;

    const imgRes = [require("../imgs/floor.png"),
                    require("../imgs/target.png")];

    r.player = Matter.Bodies.circle(r.v.getWidth(50), r.v.getHeight(30), r.v.getWidth(20), {
      label: "target",
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
          // visualComponent : new TextureComponent(imgRes),
          wireframes: true,
          fillStyle: "blue",
          sprite: {
             texture: imgRes,
          },
      } as any,
    } as Matter.IBodyDefinition );
    r.player.collisionFilter.group = -1;

    const playerRadius = 20;
    //this sensor check if the player is on the ground to enable jumping
    r.playerSensor = Matter.Bodies.rectangle(r.v.getWidth(50), r.v.getHeight(30), playerRadius, 5, {
      isSensor: true,
      render: {
        visible: false,
      },
    });

    r.playerSensor.collisionFilter.group = -1;

    r.ground = Matter.Bodies.rectangle(r.v.getWidth(50), r.v.getHeight(90), r.v.getWidth(50), r.v.getHeight(5), {
        isStatic: true,
        label: "ground",
        render: {
            visualComponent : new TextureComponent(imgRes),
            sprite: {
                lalala: true,
            },
        } as Matter.IBodyRenderOptions | any,
    });

    r.ground.render.visualComponent.setVerticalTiles(3);

    // add bodies
    Matter.World.add(r.starter.getWorld(), [
        r.ground,
        r.player,
        r.playerSensor,
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

    Matter.Events.on(r.starter.getEngine(), "beforeUpdate", function(event) {
            counter += 1;

            if (counter === 40) {

               // Matter.Body.setStatic(bodyG, true);
              if (scaleFactor > 1) {
               // Matter.Body.scale(bodyF, scaleFactor, scaleFactor);
              }

            }

            // Matter.Body.setAngle(r.player, -Math.PI * 0);

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
    Matter.Events.on(r.starter.getEngine(), "collisionStart", function(event) {
        playerGroundCheck(event, true, r );
        // touchingPortals(event,portal0,portal1);
        // touchingPortals(event,portal1,portal0);
    });
    //ongoing checks for collisions for player
    Matter.Events.on(r.starter.getEngine(), "collisionActive", function(event) {
        playerGroundCheck(event, true, r );
    });
    //at the end of a colision for player set ground to false
    Matter.Events.on(r.starter.getEngine(), "collisionEnd", function(event) {
        playerGroundCheck(event, false, r );
        // exitingPortal(event,portal0);
        // exitingPortal(event,portal1);
    });

    Matter.Events.on(r.starter.getEngine(), "afterTick", function(event) {

    /*
    //set sensor velocity to zero so it collides properly
    //r.v.getWidth(50), r.v.getHeight(30)
    Matter.Body.setVelocity(r.playerSensor, {
        x: 0,
        y: 0
      })
      //move sensor to below the player
      Matter.Body.setPosition(r.playerSensor, {
      x: r.player.position.x,
      y: r.player.position.y + playerRadius
    });
    */
  });

    globalEvent.activateKeyDetection();

    const limit = 0.3;

    Matter.Events.on(r.starter.getEngine(), "beforeTick", function(event) {

    game.cycle++;

    // console.log(globalEvent.activeKey[38])
    //jump
    if (globalEvent.activeKey[38] && r.player.ground && r.player.jumpCD < game.cycle) {

      r.player.jumpCD = game.cycle + 10; //adds a cooldown to jump
      r.player.force = {
        x: 0,
        y: -0.9,
      };
      Matter.Body.applyForce( r.player, {x: r.player.position.x, y: r.player.position.y}, r.player.force);

    }

    if (globalEvent.activeKey[37] && r.player.angularVelocity > -limit) {

        r.player.force = {
            x: -0.005,
            y: 0,
          };
        Matter.Body.applyForce( r.player, {x: r.player.position.x, y: r.player.position.y}, r.player.force);

        // r.player.torque = -spin;

    } else {
      if (globalEvent.activeKey[39] && r.player.angularVelocity < limit) {

        r.player.force = {
            x: 0.005,
            y: 0,
          };
        Matter.Body.applyForce( r.player, {x: r.player.position.x, y: r.player.position.y}, r.player.force);

        // r.player.torque = spin;
      }
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
