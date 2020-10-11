
# Tutorial 1 Basic - add elements
Adding one statis and one no static element to scene.

### Objective
 Make proof of concept. Make it easy for understanding.

#### Tutorial 1
 - Create single bottom static object and create one free fall ball.
 See `src\examples\tutorials\add-element` folder =>

Instancing game engine libraries.
File: `add-element.ts`
```typescript
/**
 * Import global css
 */
require("./../../../style/animations.css");
require("./../../../style/styles.css");

import AppIcon from "../../../app-icon";
import GamePlayController from "../../../controllers/ioc-single-player";
import Demo1 from "./demo";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const gameInfo = {
  name: "Demo 1",
  title: "Start game play and add new element.",
};

const gamesList: any[] = [
  gameInfo,
];

const master = new GamePlayController(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(Demo1, master.get.Starter);
console.log("Starter : ", master.get.Demo1);

master.get.Demo1.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).demo1 = master.get.Demo1;
```


In demo.ts we work on our gamapley context.
Class dont't implements IGamePlayModel because this is most simple
example we no need player object. From this point you can dev your
own player controller or what ever.

File Demo.ts:
```typescript

import Matter = require("matter-js");
import { IGamePlayModel, IPoint, ISelectedPlayer } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";

/**
 * @author Nikola Lukic
 * @class Demo1 tutorial
 * @param Starter
 * @description This is game logic part
 * we stil use class based methodology.
 * About resource we use require
 */

class Demo1 {

  public gameName: string = "Demo 1 - Add new element";
  public version: number = 1.0;
  public playerCategory = 0x0002;
  public staticCategory = 0x0004;

  public starter: Starter;
  public myFirstGamePlayObject: Matter.Body | any = undefined;
  public preparePlayer: ISelectedPlayer;

  constructor(starter: Starter) {
    this.starter = starter;
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
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });

       this.starter.AddNewBodies([newStaticElement] as worldElement);

  }

  public createPlayer(addToScene: boolean) {

    const playerRadius = 50;
    this.myFirstGamePlayObject = Matter.Bodies.circle(
      400,
      100,
      playerRadius, {
        label: "MYFIRSTOBJECT",
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
          fillStyle: "blue",
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any,
    } as Matter.IBodyDefinition);
    this.myFirstGamePlayObject.collisionFilter.group = -1;

      // hardcode for now
    this.myFirstGamePlayObject.render.sprite.xScale = 0.2;
    this.myFirstGamePlayObject.render.sprite.yScale = 0.2;

    if (addToScene) {
      this.myFirstGamePlayObject.id = 2;
      this.starter.AddNewBodies(this.myFirstGamePlayObject as worldElement);
      console.info("myFirstGamePlayObject body created from 'dead'.");
    }
  }

  protected destroyGamePlayPlatformer() {
    this.starter.destroyGamePlay();
    this.starter.deattachMatterEvents();
  }

}
export default Demo1;

```

### Results must be:

![Platformer](https://github.com/zlatnaspirala/visual-ts/blob/master/nonproject-files/t1.png)

