
import Matter = require("matter-js");
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";

/**
 * @author Nikola Lukic
 * @class Sprite Animation tutorial
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use require
 * I use images from add-element folder.
 * This is demo but for real release this
 * is bad praticle.
 */

class DemoSpriteAnimation {

  public gameName: string = "Demo 1 - Add sprite object";
  public version: number = 1.0;
  public playerCategory = 0x0002;
  public staticCategory = 0x0004;
  public starter: Starter;

  constructor(starter: Starter) {
    this.starter = starter;
  }

  public attachAppEvents() {

    const root = this;

    console.log("attachAppEvents is good place to start operating with physics.");

    let spriteOptions = {
      delay: 1,
      pos: {
        x: 100,
        y: 200,
      },
      tile: {
        x: 1,
        y: 1,
      },
    };
    root.createMySprite(spriteOptions);

    spriteOptions = {
      delay: 10,
      pos: {
        x: 400,
        y: 200,
      },
      tile: {
        x: 1,
        y: 1,
      },
    };
    root.createMySprite(spriteOptions);

    spriteOptions = {
      delay: 30,
      pos: {
        x: 700,
        y: 200,
      },
      tile: {
        x: 5,
        y: 5,
      },
    };
    root.createMySprite(spriteOptions);

    root.addGround();

  }

  public addGround() {

       const newStaticElement: worldElement = Matter.Bodies.rectangle(400, 550, 1000, 90,
        {
          isStatic: true,
          isSleeping: false,
          label: "ground",
          collisionFilter: {
            group: this.staticCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgGround", [require("../add-element/imgs/backgrounds/wall3.png")]),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });

       (newStaticElement.render as any).visualComponent.setVerticalTiles(4);
       // setHorizontalTiles(1);
       this.starter.AddNewBodies([newStaticElement] as worldElement);

  }

  /**
   * @description How to create sprite
   * with different options
   */

  public createMySprite(spriteOptions: any) {

    const playerRadius = 50;
    // tslint:disable-next-line:prefer-const
    let myObject = Matter.Bodies.circle(
      spriteOptions.pos.x,
      spriteOptions.pos.y,
      playerRadius, {
        label: "mySprite",
        density: 0.0005,
        friction: 0.01,
        frictionAir: 0.06,
        restitution: 0.3,
        ground: true,
        jumpCD: 0,
        portal: -1,
        collisionFilter: {
          category: this.playerCategory,
        } as any,
        render: {
          visualComponent: new SpriteTextureComponent(
            "explosion",
            require("../add-element/imgs/explosion/explosion.png"),
            ({ byX: 4, byY: 4 } as any),
          ),
          fillStyle: "blue",
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any,
    } as Matter.IBodyDefinition);
    myObject.collisionFilter.group = -1;
    this.starter.AddNewBodies(myObject as worldElement);
    (myObject as any).render.visualComponent.seqFrameX.setDelay(spriteOptions.delay);

    (myObject.render as any).visualComponent.setVerticalTiles(spriteOptions.tile.x).
      setHorizontalTiles(spriteOptions.tile.y);

    (myObject.render as any).visualComponent.keepAspectRatio = true;

    console.info("my sprite body created from 'dead'.");

  }

  protected destroyGamePlayPlatformer() {
    this.starter.destroyGamePlay();
    this.starter.deattachMatterEvents();
  }

}
export default DemoSpriteAnimation;
