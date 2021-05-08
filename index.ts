'use strict'

/**
 * @description This is part of importing class references.
 * Base classes:
 * Matter.js ,MIT LICENCE
 * https://github.com/liabru/matter-js/blob/master/LICENSE
 * Other classes are part of Visual TS Game Engine LICENCE.
 */

import * as Matter from "matter-js";
import BotBehavior from "./src/libs/class/bot-behavior";
import TextComponent from "./src/libs/class/visual-methods/text";
import TextureComponent from "./src/libs/class/visual-methods/texture";
import SpriteTextureComponent from "./src/libs/class/visual-methods/sprite-animation";
import SpriteStreamComponent from "./src/libs/class/visual-methods/sprite-stream";
import TextureStreamComponent from "./src/libs/class/visual-methods/texture-stream";
import IocSinglePlayerMode from "./src/controllers/ioc-single-player"
import IocMultiPlayerMode from "./src/controllers/ioc";
import Generator from "./src/libs/class/generator";
import Broadcaster from "./src/libs/class/networking/broadcaster";
import Connector from "./src/libs/class/networking/connector";
import Coordinator from "./src/libs/class/networking/coordinator";
import Network from "./src/libs/class/networking/network";
import MobileControls from "./src/libs/class/player-commands";
import * as Type from "./src/libs/types/global";
import * as Interface from "./src/libs/interface/global";
import * as EngineDefaults from "./src/libs/defaults";
import * as System from "./src/libs/class/system";
import * as NMath from "./src/libs/class/math"; 
import Starter from "./src/libs/starter";
import AppIcon from "./src/app-icon";
import ClientConfig from "./src/client-config";
// import GameMap from "./map";

/**
 * @description
 * Module namespace export reference list.
 * Represent lib coming from `npm i visula-ts`
 * @params ClientConfig,
 *          Matter,
 *          IocSinglePlayerMode, IocMultiPlayerMode,
 *          System, Interface, Type, EngineDefaults,
 *          NMath, Starter, BotBehavior,
 *          TextureComponent, TextureStreamComponent,
 *          SpriteTextureComponent, SpriteStreamComponent,
 *          TextComponent, Generator,
 *          AppIcon, Broadcaster, Connector,
 *          Coordinator, Network, MobileControls
 */
export {
  ClientConfig,
  Matter,
  IocSinglePlayerMode,
  IocMultiPlayerMode,
  System,
  Interface,
  Type,
  EngineDefaults,
  NMath,
  Starter,
  BotBehavior,
  TextureComponent,
  TextureStreamComponent,
  SpriteTextureComponent,
  SpriteStreamComponent,
  TextComponent,
  Generator,
  AppIcon,
  Broadcaster,
  Connector,
  Coordinator,
  Network,
  MobileControls
}
