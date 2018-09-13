
import { Render } from "matter-js";
import { networkInterfaces } from "os";
import IVisualComponent from "../interface/visual-component";
import TextureComponent from "./visual-methods/texture";

/**
 * @description Override method for matter-js render
 * @class VisualRender
 */
class VisualRender {

    constructor() {
        (Render as any).getTexture = this.getTexture;
        (Render as any).drawSolid = this.drawSolid;
        (Render as any).bodies = this.overrideRenderFunction;
    }

    /**
     * Description Override method for Render.bodies
     * @private
     * @method Render.bodies
     * @param {render} render
     * @param {body[]} bodies
     * @param {RenderingContext} context
     */
    private overrideRenderFunction(render, bodies, context) {

    const c = context;
    const engine = render.engine,
            options = render.options,
            showInternalEdges = options.showInternalEdges || !options.wireframes;
    let body, part, i, k;

    for (i = 0; i < bodies.length; i++) {
        body = bodies[i];

        if (!body.render.visible) {
            continue;
        }

        // handle compound parts
        for (k = body.parts.length > 1 ? 1 : 0; k < body.parts.length; k++) {
            part = body.parts[k];

            if (!part.render.visible) {
                continue;
            }

            if (options.showSleeping && body.isSleeping) {
                c.globalAlpha = 0.5 * part.render.opacity;
            } else if (part.render.opacity !== 1) {
                c.globalAlpha = part.render.opacity;
            }

            if (part.render.sprite && part.render.visualComponent && !options.wireframes) {

                // part sprite
                 const sprite = part.render.sprite;

                 const texture = part.render.visualComponent.assets.getImg("tex0");

                 c.translate(part.position.x, part.position.y);
                 c.rotate(part.angle);
                 //() => this.drawSolid(c, part, showInternalEdges, options);
                 if (part.render.visualComponent) {
                    part.render.visualComponent.drawComponent(c, part);
                 }

                 /** else {  c.drawImage(
                        texture,
                        texture.width * -sprite.xOffset * sprite.xScale,
                        texture.height * -sprite.yOffset * sprite.yScale,
                        texture.width * sprite.xScale,
                        texture.height * sprite.yScale);
                }*/

                // revert translation, hopefully faster than save / restore
                 c.rotate(-part.angle);
                 c.translate(-part.position.x, -part.position.y);
            } else {

                this.drawSolid(c, part, showInternalEdges, options);

            }

            c.globalAlpha = 1;
        }
    }
    }

   private getTexture(render, imagePath): HTMLImageElement {

        let image = render.textures[imagePath];

        if (image) {
            return image;
        }
        console.log(".................");
        image = render.textures[imagePath] = new Image();
        image.src = imagePath;

        return image;

    }

    // Draw solid
    private drawSolid(c, part, showInternalEdges, options) {

        // part polygon
        if (part.circleRadius) {
            c.beginPath();
            c.arc(part.position.x, part.position.y, part.circleRadius, 0, 2 * Math.PI);
        } else {
            c.beginPath();
            c.moveTo(part.vertices[0].x, part.vertices[0].y);

            for (let j = 1; j < part.vertices.length; j++) {
                if (!part.vertices[j - 1].isInternal || showInternalEdges) {
                    c.lineTo(part.vertices[j].x, part.vertices[j].y);
                } else {
                    c.moveTo(part.vertices[j].x, part.vertices[j].y);
                }

                if (part.vertices[j].isInternal && !showInternalEdges) {
                    c.moveTo(part.vertices[(j + 1) % part.vertices.length].x, part.vertices[(j + 1) % part.vertices.length].y);
                }
            }

            c.lineTo(part.vertices[0].x, part.vertices[0].y);
            c.closePath();
        }

        if (!options.wireframes) {
            c.fillStyle = part.render.fillStyle;

            if (part.render.lineWidth) {
                c.lineWidth = part.render.lineWidth;
                c.strokeStyle = part.render.strokeStyle;
                c.stroke();
            }

            c.fill();
        } else {
            c.lineWidth = 1;
            c.strokeStyle = "#bbb";
            c.stroke();
        }

    }

}

export default VisualRender;
