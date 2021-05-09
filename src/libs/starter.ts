import * as Matter from "matter-js";
import Ioc from "../controllers/ioc";
import ViewPort from "../libs/class/view-port";
import { DEFAULT_GAMEPLAY_ROLES, DEFAULT_RENDER_BOUNDS } from "./defaults";
import { IUniVector } from "./interface/global";
import { worldElement } from "./types/global";
import LocalDevice from "./class/local-devices";

/**
 * @description
 * Real begin of graphic canvas staff.
 * This is startup also storage for graphic orientend
 * objects. Matter.js/ts also imported here.
 * @param ioc Ioc
 */
class Starter {

  public ioc: Ioc;
  public get: IUniVector = {};
  public localDevice: LocalDevice = new LocalDevice();

  protected attach;
  protected view: ViewPort;

  /**
   * mouseConstraint is object extended from matter.js
   */
  protected mouseConstraint;

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

  public constructor(ioc: Ioc) {

    const root = this;
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
        width: DEFAULT_RENDER_BOUNDS.WIDTH,
        height: DEFAULT_RENDER_BOUNDS.HEIGHT,
        wireframes: false,
      },
    });

    this.setWorldBounds(
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_LEFT,
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_TOP,
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_RIGHT,
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_BOTTOM,
    );

    this.render.options.background = "black";

    Render.run(this.render);

    // create runner
    this.runner = Runner.create({
      delta: 1000 / 60,
      isFixed: false,
    });
    Runner.run(this.runner, this.engine);

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
        x: DEFAULT_RENDER_BOUNDS.WIDTH,
        y: DEFAULT_RENDER_BOUNDS.WIDTH,
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

  public AddNewBodies = (elements: worldElement) => {
    Matter.World.add(this.getWorld(), elements as worldElement);
  }

  public destroyBody = (destroyBody) => {
    try {
    Matter.Composite.remove(this.getWorld(), destroyBody);
    } catch(err) {
      console.log(err)
    }
  }

  public setRenderView(renderWidth, renderHeight): void {
    this.render.options.width = renderWidth;
    this.render.options.height = renderHeight;
  }

  public setWorldBounds(minX: number, minY: number, maxX: number, maxY: number) {
    this.world.bounds.min.x = minX;
    this.world.bounds.min.y = minY;
    this.world.bounds.max.x = maxX;
    this.world.bounds.max.y = maxY;
  }

  public destroyGamePlay() {
    console.log("Destroy world.");
    Matter.World.clear(this.world, false);
  }

  public deattachMatterEvents(): void {
    Matter.Events.off(this.getEngine(), undefined, undefined);
    console.info("Matter.Events.off");
  }

}
export default Starter;
