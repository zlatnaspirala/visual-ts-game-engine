
import Matter = require("matter-js");
import { GeneratorOptions, worldElementType } from "../interface/global";
import Starter from "../starter";
import { worldElement } from "../types/global";
import { Counter } from "./math";

/**
 * @description
 * Generator is class for self creating wourld elements.
 * @param options
 * @interface GeneratorOptions
 */
class Generator {

  private options: GeneratorOptions;
  private genType: string = "rect";
  private counter: Counter;
  private newParamsElement: any = {};
  private starter: Starter;
  private destroyAfter: number = 2000;
  private emit: number[] = [5];

  public logic () {

    var root = this;
    let newStaticElements = [];

    if (this.genType === worldElementType.RECT ) {
      this.emit.forEach(() => {
        let localElement = Matter.Bodies.rectangle(
          this.newParamsElement.x,
          this.newParamsElement.y,
          this.newParamsElement.w,
          this.newParamsElement.h,
          this.newParamsElement.arg2);
        newStaticElements.push(localElement)
        this.starter.AddNewBodies(localElement)
      });
    } else if (this.genType ===  worldElementType.CIRCLE) {
      this.emit.forEach(() => {
        let localElement = Matter.Bodies.circle(
          this.newParamsElement.x,
          this.newParamsElement.y,
          this.newParamsElement.playerRadius,
          this.newParamsElement.arg2);
          newStaticElements.push(localElement)
        this.starter.AddNewBodies(localElement);
        }
      );
    }
    // interest idea sequence destry also sequence add
    setTimeout(() => {
      root.starter.destroyBody(newStaticElements)
    }, root.destroyAfter)
  }

  constructor(options) {

    if (options === undefined) {
      console.error("You need to pass options arg for Generator Class.")
      return null;
    }

    this.options = options;

    if (options.genType === undefined) {
      this.genType = "rect";
    } else {
      this.genType = options.genType;
    }

    if (options.emit === undefined) {
      this.emit = [1,1,1];
    } else {
      this.emit = options.emit;
    }

    this.counter = this.options.counter;
    this.newParamsElement = options.newParamsElement;
    this.starter = options.starter;
    this.counter.onRepeat = this.logic.bind(this);
    this.counter.setDelay(20);
    console.log("Generator constructed.");
  }

}

export default Generator;
