
import Matter = require("matter-js");
import { byId, createAppEvent, htmlHeader } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import { IGamePlayModel, IPoint, ISelectedPlayer } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement, UniVector } from "../../../libs/types/global";
import { DEFAULT_GAMEPLAY_ROLES, DEFAULT_PLAYER_DATA } from "../../../libs/defaults";
import Network from "../../../libs/class/networking/network";
import SpriteStreamComponent from "../../../libs/class/visual-methods/sprite-stream";
import TextureComponent from "../../../libs/class/visual-methods/texture";

/**
 * @author Nikola Lukic
 * @class Demo1 tutorial
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use require
 */

class Demo1 implements IGamePlayModel {

  public gameName: string = "Demo 1 - Add new element";
  public version: number = 1.0;
  public playerCategory = 0x0002;
  public staticCategory = 0x0004;

  public starter: Starter;
  public player: Matter.Body | any = undefined;
  public preparePlayer: ISelectedPlayer;
  private playerStartPositions: IPoint[] = [{x: 400, y: 100}];

  constructor(starter: Starter) {

    this.starter = starter;

    this.preparePlayer = {
      labelName: "nidzica",
      poster: require("./imgs/players/nidzica/posterNidzica.png"),
      resource: [
        require("./imgs/players/nidzica/nidzica-running.png"),
        require("./imgs/explosion/explosion.png"),
        require("./imgs/players/nidzica/nidzica-idle.png"),
      ],
      type: "sprite",
      spriteTile: {
                    run: { byX: 5, byY: 1 },
                    idle: { byX: 3, byY: 1 },
                    stream: { byX: 1, byY: 1 }
                  },
      spriteTileCurrent: "run",
      setCurrentTile: function(key: string) {
        this.spriteTileCurrent = key;
      }
    };


  }

  public attachAppEvents() {

    const root = this;

      console.log("App event");
      root.createPlayer(true);
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
            // visualComponent: new TextureComponent("imgGround",[require("./imgs/backgrounds/wall3.png")]),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });

      //  (newStaticElement.render as any).visualComponent.setVerticalTiles(2).
      //    setHorizontalTiles(1);
        this.starter.AddNewBodies([newStaticElement] as worldElement);

  }

  public createPlayer(addToScene: boolean) {

    const playerRadius = 50;
    this.player = Matter.Bodies.circle(
      this.playerStartPositions[0].x,
      this.playerStartPositions[0].y,
      playerRadius, {
        label: "player",
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
          // visualComponent: sptTexCom,
          fillStyle: "blue",
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any,
    } as Matter.IBodyDefinition);
    this.player.collisionFilter.group = -1;

      // hardcode for now
      this.player.render.sprite.xScale = 0.2;
      this.player.render.sprite.yScale = 0.2;

    if (addToScene) {
      this.player.id = 2;
      this.starter.AddNewBodies(this.player as worldElement);
      console.info("Player body created from 'dead'.");
    }
  }

  protected destroyGamePlayPlatformer() {
    this.starter.destroyGamePlay();
    this.starter.deattachMatterEvents();
  }

}
export default Demo1;
