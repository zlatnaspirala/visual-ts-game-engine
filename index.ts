'use strict'

/**
 * @description This is part of importing class references.
 * Base classes:
 * Matter.js ,MIT LICENCE
 * https://github.com/liabru/matter-js/blob/master/LICENSE
 * Other classes are part of Visual TS Game Engine LICENCE.
 */
import SpriteTextureComponent from "./src/libs/class/visual-methods/sprite-animation";
import * as Matter from "matter-js";
import BotBehavior from "./src/libs/class/bot-behavior";
import TextComponent from "./src/libs/class/visual-methods/text";
import TextureComponent from "./src/libs/class/visual-methods/texture";
import IocSinglePlayerMode from "./src/controllers/ioc-single-player"
import IocMultiPlayerMode from "./src/controllers/ioc";

import * as Type from "./src/libs/types/global";
import * as Interface from "./src/libs/interface/global";
import * as EngineDefaults from "./src/libs/defaults";
import * as System from "./src/libs/class/system";
import Starter from "./src/libs/starter";
import AppIcon from "./src/app-icon";

// import GameMap from "./map";

/**
 * @description
 * Module namespace export reference list.
 */

export { Matter,
         IocSinglePlayerMode,
         IocMultiPlayerMode,
         System,
         Interface,
         Type,
         EngineDefaults,
         Starter,
         TextureComponent,
         BotBehavior,
         SpriteTextureComponent,
         TextComponent,
         AppIcon }
