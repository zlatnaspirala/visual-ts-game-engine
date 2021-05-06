
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
  private emit: any[] = [];
  private delayForce = [];

  public logic () {

    var root = this;
    let newStaticElements = [];

    if (this.genType === worldElementType.RECT ) {

      this.emit.forEach((opt, index) => {
        if (opt.force !== undefined) {
          this.newParamsElement.arg2.force = opt.force;
        }
        let localElement: Matter.Body;
        if (opt.initDelay !== undefined) {
          setTimeout(() => {
            if (opt.force !== undefined) {
              this.newParamsElement.arg2.force = opt.force;
            }
            localElement = Matter.Bodies.rectangle(
              this.newParamsElement.x,
              this.newParamsElement.y,
              this.newParamsElement.w,
              this.newParamsElement.h,
              this.newParamsElement.arg2);
            newStaticElements.push(localElement)
            this.starter.AddNewBodies(localElement)
            if (this.delayForce[index] !== undefined) {
              const clone = { ...this.delayForce[index].force };
              setTimeout(() => {
                localElement.force = clone;
              }, this.delayForce[index].delta);
            }
          }, opt.initDelay);

        } else {

          localElement = Matter.Bodies.rectangle(
            this.newParamsElement.x,
            this.newParamsElement.y,
            this.newParamsElement.w,
            this.newParamsElement.h,
            this.newParamsElement.arg2);
          newStaticElements.push(localElement)
          this.starter.AddNewBodies(localElement)

          if (this.delayForce[index] !== undefined) {
            setTimeout(() => {
              const clone = { ...this.delayForce[index].force };
              newStaticElements[newStaticElements.length - 1].force = clone;
            }, this.delayForce[index].delta);
          }
        }
      })
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
      this.emit = [1];
    } else {
      this.emit = options.emit;
    }

    if (options.destroyAfter !== undefined) {
      this.destroyAfter = options.destroyAfter;
    }

    if (options.delayForce !== undefined) {
      this.delayForce = options.delayForce;
    }

    this.counter = this.options.counter;
    this.newParamsElement = options.newParamsElement;
    this.starter = options.starter;
    this.counter.onRepeat = this.logic.bind(this);
    this.counter.setDelay(20);
    // console.log("Generator constructed. default-> counter.setDelay(20); ");
  }

}

export default Generator;
