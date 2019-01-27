import * as Matter from "matter-js";
import ViewPort from "../libs/class/view-port";
import Ioc from "../libs/ioc";
import { IUniVector } from "./interface/global";
import { worldElement } from "./types/global";

/**
 * Real begin of graphic canvas staff.
 * This is startup also storage for graphic orientend
 * objects. Matter.js/ts also imported here.
 * @param ioc Ioc
 */
class Starter {

  public ioc: Ioc;
  public get: IUniVector = {};
  protected attach;
  protected view: ViewPort;

  /**
   * Map needs more space then our window screen.
   * This property handle global translate and zoom
   * for graphic surface.
   */
  private mapView: any = {};

  /**
   * render is object extended from matter.js
   */
  private render: any;

  /**
   * engine is object extended from matter.js
   */
  private engine: any;

  /**
   * world is object extended from matter.js
   */
  private world: any;

  /**
   * runner is object extended from matter.js
   */
  private runner: any;

  /**
   * mouseConstraint is object extended from matter.js
   */
  private mouseConstraint;

  public constructor(ioc: Ioc) {

    this.ioc = ioc;

    const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Events = Matter.Events,
      Bounds = Matter.Bounds,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      World = Matter.World,
      Bodies = Matter.Bodies;

    // create engine, world
    this.engine = Engine.create();
    this.world = this.engine.world;
    this.view = ioc.get.ViewPort;

    // create renderer
    this.render = Render.create({
      element: (document as Document).body,
      engine: this.engine,
      options: {
        wireframes: false,
      },
    });

    this.setWorldBounds(-this.view.getWidth(100),
      -this.view.getWidth(100),
      this.view.getWidth(100), 3 * this.view.getHeight(100));

    this.render.options.background = "black";

    Render.run(this.render);

    // create runner
    this.runner = Runner.create({
      delta: 1000 / 60,
      isFixed: false,
    });
    Runner.run(this.runner, this.engine);

    console.log("xxx");
    // add mouse control
    const mouse = Mouse.create(this.render.canvas);

    this.mouseConstraint = MouseConstraint.create(this.engine, {
      mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      } as Matter.IMouseConstraintDefinition | any,
    }) as Matter.MouseConstraint;

    World.add(this.world, this.mouseConstraint as any);

    // keep the mouse in sync with rendering
    this.render.mouse = mouse;

    // fit the render viewport to the scene
    (Render as any).lookAt(this.render, {
      min: {
        x: 0,
        y: 0,
      },
      max: {
        x: this.view.getWidth(100),
        y: this.view.getHeight(100),
      },
    });

    if (this.view.config.getDrawRefference() === "diametric-fullscreen") {
      this.view.setCanvasWidth("100vw");
      this.view.setCanvasHeight("100vh");
      console.warn("diametric-fullscreen view constructed");
    }
    this.view.initCanvasDom();
    // console.log(this.engine.bounds);

    this.mapView = {
      translate: 0,
      viewportCentre: {
        x: this.render.options.width * 0.5,
        y: this.render.options.height * 0.5,
      },
      initialEngineBounds: {
        MaxY: this.engine.world.bounds.max.x,
        MaxX: this.engine.world.bounds.max.y,
      },
      boundsScaleTarget: 1,
      boundsScale: {
        x: 1,
        y: 1,
      },
    };

  }

  public getDeltaCentreMouse(): Matter.Vector {
    return Matter.Vector.sub(this.mouseConstraint.mouse.absolute, this.mapView.viewportCentre);
  }

  public getCentreDistMouse(): number {
    return Matter.Vector.magnitude(this.getDeltaCentreMouse());
  }

  public getDeltaCentrePlayer(playerVector: Matter.Vector): Matter.Vector {
    return Matter.Vector.sub(playerVector, this.mapView.viewportCentre);
  }

  public getCentreDistPlayer(playerVector: Matter.Vector): number {
    return Matter.Vector.magnitude(this.getDeltaCentrePlayer(playerVector));
  }

  public getMouseConstraint() {
    return this.mouseConstraint;
  }

  public getMap() {
    return this.mapView;
  }

  public getRender() {
    return this.render;
  }

  public getWorld() {
    return this.world;
  }

  public getEngine() {
    return this.engine;
  }

  public getView() {
    return this.view;
  }

  public AddNewBodies(elements: worldElement) {
    Matter.World.add(this.getWorld(), elements as worldElement);
  }

  public destroyBody(destroyBody) {
    Matter.Composite.remove(this.world, destroyBody);
  }

  public setWorldBounds(minX: number, minY: number, maxX: number, maxY: number) {
    this.world.bounds.min.x = minX;
    this.world.bounds.min.y = minY;
    this.world.bounds.max.x = maxX;
    this.world.bounds.max.y = maxY;
  }

  public destroyGamePlay() {
    this.render.canvas.remove();
    this.render.canvas = null;
    this.render.context = null;
    this.render.textures = {};
  }

}
export default Starter;
