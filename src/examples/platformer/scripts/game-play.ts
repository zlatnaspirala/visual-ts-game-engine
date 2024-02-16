import * as Matter from "matter-js";
import BotBehavior from "../../../libs/class/bot-behavior";
import Generator from "../../../libs/class/generator";
import { Counter, netPosOpt, numberOpt } from "../../../libs/class/math";
import Coordinator from "../../../libs/class/networking/coordinator";
import { byId } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import {
  DEFAULT_GAMEPLAY_ROLES,
  DEFAULT_PLAYER_DATA,
  DEFAULT_RENDER_BOUNDS,
} from "../../../libs/defaults";
import { worldElementType } from "../../../libs/interface/global";
import {
  IMultiplayer,
  BaseMultiPlayer,
} from "../../../libs/interface/networking";
import Starter from "../../../libs/starter";
import { worldElement, worldElementParams } from "../../../libs/types/global";
import GameMap from "./map";
import Level1 from "./packs/level1";
import Platformer from "./platformer";

/**
 * @description Finally game start at here
 * @function level1
 * @return void
 */
class GamePlay extends Platformer implements IMultiplayer {
  public multiPlayerRef: BaseMultiPlayer|any={
    root: this,
    init(rtcEvent) {
      console.log("rtcEvent addNewPlayer: ", rtcEvent);
      this.root.addNetPlayer(this.root, rtcEvent);

      console.log('call PLATFORME DB ACTIVE LIST - this ; ', this)
      this.root.starter.ioc.get.Network.connector.getActivePlayers();
    },

    update(multiplayer) {
      if(multiplayer.data.netPos) {
        Matter.Body.setPosition(
          this.root.netBodies["netObject_"+multiplayer.userid],
          { x: multiplayer.data.netPos.x, y: multiplayer.data.netPos.y }
        );

        Matter.Body.setAngle(
          this.root.netBodies["netObject_"+multiplayer.userid],
          -Math.PI*0
        );

        if(multiplayer.data.netDir) {
          if(multiplayer.data.netDir==="left") {
            this.root.netBodies[
              "netObject_"+multiplayer.userid
            ].render.visualComponent.setHorizontalFlip(true);
          } else if(multiplayer.data.netDir==="right") {
            this.root.netBodies[
              "netObject_"+multiplayer.userid
            ].render.visualComponent.setHorizontalFlip(false);
          }
        }
      } else if(multiplayer.data.noMoreLives===true) {
        // What to do with gameplay ?!
        // Just hide or hard variand
        // server database politic make clear player is out of game
        // bis logic - Initator must have credibility

        // Not tested Soft
        this.root.netBodies[
          "netObject_"+multiplayer.userid
        ].render.visible=false;
        console.log(" VISIBLE FALSE FOR ET OBJECT");
        // Hard make exit if netPlayer is initator
        // Hard - exit game - if game logic
      }
    },

    /**
     * If someone leaves all client actions is here
     * - remove from scene
     * - clear object from netObject_x
     */

    preventDoubleLGP: {},

    leaveGamePlay(rtcEvent) {
      console.info("rtcEvent LEAVE GAME: ", rtcEvent.userid);

      if(typeof this.preventDoubleLGP[rtcEvent.userid]==='undefined') {
        this.preventDoubleLGP[rtcEvent.userid]=true;
        setTimeout(() => this.root.starter.ioc.get.Network.connector.getActivePlayers(), 1000);
        this.root.starter.destroyBody(
          this.root.netBodies["netObject_"+rtcEvent.userid]
        );
        delete this.root.netBodies["netObject_"+rtcEvent.userid];
      }
    },
  };

  private generatorOfCollecions: any;
  private generators: any=[];

  private gamePlayWelcomeNote: string=
    "This application was created on visual-ts <br/>\
                                         Example: Real time multiplayer `Platformer` zlatnaspirala@gmail.com <br/>\
                                         General: MIT License <br/>\
                                         Copyright (c) 2019 Nikola Lukic zlatnaspirala@gmail.com Serbia Nis <br/>\
                                         Except: Folder src/libs with licence: <br/>\
                                         GNU LESSER GENERAL PUBLIC LICENSE Version 3 <br/>\
                                         Copyright (c) 2019 maximumroulette.com ";

  /**
   * @description deadZoneForBottom Definition and Default value
   * - overrided from map or map2d(generated) by deadLines object
   * DeadLines object. In future Can be used for enemy static action;
   */
  private deadZoneForBottom: number=DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_BOTTOM;
  private deadZoneForRight: number=DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_RIGHT;

  constructor (starter: Starter) {
    super(starter);

    if(this.starter.ioc.getConfig().getAutoStartGamePlay()) {
      // Implement to the multiplayer solution:
      // level feature.
      // Override
      this.deadZoneForBottom=2500;

      this.load();
    }

    // check this with config flag
    this.network=starter.ioc.get.Network;
    this.broadcaster = starter.ioc.get.Broadcaster;
    // this.coordinator = starter.ioc.get.Network.coordinator;

    // MessageBox
    // this.starter.ioc.get.MessageBox.show(this.gamePlayWelcomeNote);
  }

  public attachAppEvents=() => {
    const myInstance=this;
    window.addEventListener("game-init", function(e) {
      console.info("game-init Player spawn. e => ", (e as any).detail);
      try {
        if((e as any).detail&&(e as any).detail.data.game==="undefined") {
          console.warn("Bad game-init attempt.");
          return;
        } else if((e as any).detail&&(e as any).detail.data.game===null) {
          console.info("game-init Player spawn. data.game === null");
          myInstance.starter.ioc.get.Network.connector.startNewGame(
            myInstance.gameName
          );
          myInstance.initSelectPlayer();
          myInstance.selectPlayer("nidzica");
          myInstance.playerSpawn(true);
          myInstance.broadcaster.activateDataStream(myInstance.multiPlayerRef);
          myInstance.starter.ioc.get.Connector.inGamePlay = true;
          return;
        }
        myInstance.initSelectPlayer();
        myInstance.selectPlayer("nidzica");

        // How to access netwoking
        myInstance.starter.ioc.get.Network.connector.startNewGame(
          myInstance.gameName
        );
        myInstance.load((e as any).detail.data.game);

        /**
         * @description
         * Very important - You can activate also coordinator like supre extra multiPeer
         * Connections in the same time but it is not stable in 100%.
         */
        myInstance.broadcaster.activateDataStream(myInstance.multiPlayerRef);
        console.info("Player spawn. game-init .startNewGame");

        // Play music in background
        myInstance.starter.ioc.get.Sound.createAudio("./audios/sb_indreams.mp3", "bgMusic");
        myInstance.starter.ioc.get.Sound.createAudio("./audios/collect-item.mp3", "collectItem");
        myInstance.starter.ioc.get.Sound.createAudio("./audios/dead.mp3", "dead");
        myInstance.starter.ioc.get.Sound.createAudio("./audios/jump.mp3", "jump");
        // Correct bg Music
        myInstance.starter.ioc.get.Sound.audioBox.bgMusic.volume=0.3;
        sessionStorage.setItem('current-level', (e as any).detail.data.mapName)
        myInstance.starter.ioc.get.Connector.inGamePlay = true;
      } catch(err) {
        console.error("Very bad #00001", err);
      }
    });

    window.addEventListener("game-end", function(e) {
      try {
        if(
          (e as any).detail&&
          (e as any).detail.data.game!=="undefined"&&
          (e as any).detail.data.game!==null&&
          (e as any).detail.data.game===myInstance.gameName
        ) {
          myInstance.destroyGamePlayPlatformer();
          (byId("playAgainBtn") as HTMLButtonElement).disabled=true;
          (byId("soundOptionDom") as HTMLButtonElement).disabled=true;
          (byId("openGamePlay") as HTMLButtonElement).disabled=false;
          (byId("out-of-game") as HTMLButtonElement).disabled=true;

          myInstance.starter.ioc.get.Network.connector.memo.save(
            "activeGame",
            "none"
          );

          console.info("Game end. THIS ", this);
          console.info("Game end. ", myInstance.starter.ioc.get.Network.nameUI);
          myInstance.starter.ioc.get.Broadcaster.leaveRoomBtn.click();
          // ??? check this later
          // myInstance.starter.ioc.get.Network.nameUI.disabled = (this as any).disabled = false;
          // myInstance.starter.ioc.get.Network.connectUI.disabled = (this as any).disabled = false;
          myInstance.starter.ioc.get.Connector.inGamePlay = false;
          myInstance.deattachMatterEvents();
          // Leave
          myInstance.starter.ioc.get.Network.rtcMultiConnection.connection.leave();
          myInstance.starter.ioc.get.Network.rtcMultiConnection.connection.disconnect();
          myInstance.netBodies={};
          console.info(
            "game-end global event. Destroying game play. DISCONNECT"
          );
        }
      } catch(err) {
        console.error("Very bad #1", err);
      }
    });
  };

  private deattachMatterEvents() {
    Matter.Events.off(this.starter.getEngine(), undefined, undefined);
  }

  private overrideOnKeyDown=() => {
    const testRoot=this;

    if(typeof testRoot.player==="undefined"||testRoot.player===null) {
      return;
    }
    const vc=testRoot.player.render.visualComponent;
    if(vc.assets.SeqFrame.getValue()===0) {
      return;
    }

    testRoot.selectedPlayer.setCurrentTile("run");
    testRoot.player.render.visualComponent.setNewShema(testRoot.selectedPlayer);
    testRoot.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
    testRoot.player.render.visualComponent.seqFrameX.setDelay(8);
  };

  private overrideOnKeyUp=() => {
    const testRoot=this;

    if(typeof testRoot.player==="undefined"||testRoot.player===null) {
      return;
    }
    const vc=testRoot.player.render.visualComponent;
    if(vc.assets.SeqFrame.getValue()===2) {
      return;
    }
    testRoot.selectedPlayer.setCurrentTile("idle");
    testRoot.player.render.visualComponent.setNewShema(testRoot.selectedPlayer);
    vc.assets.SeqFrame.setNewValue(2);
    vc.seqFrameX.setDelay(8);
  };

  private attachMatterEvents() {
    const root=this;
    const globalEvent=this.starter.ioc.get.GlobalEvent;
    globalEvent.providers.onkeydown=this.overrideOnKeyDown;
    globalEvent.providers.onkeyup=this.overrideOnKeyUp;
    const playerSpeed=DEFAULT_PLAYER_DATA.SPEED_AMP;

    root.starter.setRenderView(
      DEFAULT_RENDER_BOUNDS.WIDTH,
      DEFAULT_RENDER_BOUNDS.HEIGHT
    );

    this.enemys.forEach(function(item) {
      const test=new BotBehavior(item);
      test.patrol();
    });

    Matter.Events.on(
      this.starter.getEngine(),
      "beforeUpdate",
      function(event) {
        if(!root.player) {
          return;
        }

        if(root.player&&root.player.position.y>root.deadZoneForBottom) {
          root.playerDie(root.player);
        }

        if(root.player) {
          Matter.Body.setAngle(root.player, -Math.PI*0);
          // Matter.Body.setAngle(root.enemys[0] as Matter.Body, -Math.PI * 0);

          Matter.Bounds.shift(root.starter.getRender().bounds, {
            x:
              root.player.position.x-
              root.starter.getRender().options.width/1.5,
            y:
              root.player.position.y-
              root.starter.getRender().options.height/1.5,
          });

          if(
            root.player.velocity.x<0.1&&
            numberOpt(root.player.velocity.y)===0&&
            root.player.currentDir==="idle"
          ) {
            // empty
            // console.info("IDLE STOPS", root.player.currentDir)
          } else {
            if(root.broadcaster.connection.getAllParticipants().length>0) {
              root.broadcaster.connection.send({
                netPos: netPosOpt(root.player.position),
                netDir: root.player.currentDir,
              });
            }
          }
        }

        root.generatorOfCollecions.counter.getValue();
      }
    );

    const limit=0.3;

    // at the start of a colision for player
    Matter.Events.on(
      this.starter.getEngine(),
      "collisionStart",
      function(event) {
        root.collisionCheck(event, true);
      }
    );

    // ongoing checks for collisions for player
    Matter.Events.on(
      this.starter.getEngine(),
      "collisionActive",
      function(event) {
        root.collisionCheck(event, true);
      }
    );

    // at the end of a colision for player set ground to false
    Matter.Events.on(
      this.starter.getEngine(),
      "collisionEnd",
      function(event) {
        root.collisionCheck(event, false);
      }
    );

    Matter.Events.on(this.starter.getEngine(), "afterTick", function(event) {
      if(!root.player) {
        return;
      }
      // jump
      if(globalEvent.activeKey[38]&&root.player.ground) {
        const s=root.player.jumpAmp*playerSpeed;
        root.player.ground=false;
        root.player.force={
          x: 0,
          y: -s,
        };
        Matter.Body.setVelocity(root.player, { x: 0, y: -s });
        // this.player.currentDir = "jump";
        root.starter.ioc.get.Sound.playById('jump');
      } else if(
        globalEvent.activeKey[37]&&
        root.player.angularVelocity>-limit
      ) {
        root.player.render.visualComponent.setHorizontalFlip(true);
        root.player.force={
          x: -playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(
          root.player,
          { x: root.player.position.x, y: root.player.position.y },
          root.player.force
        );
        root.player.currentDir="left";
      } else if(
        globalEvent.activeKey[39]&&
        root.player.angularVelocity<limit
      ) {
        root.player.render.visualComponent.setHorizontalFlip(false);
        root.player.force={
          x: playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(
          root.player,
          { x: root.player.position.x, y: root.player.position.y },
          root.player.force
        );
        root.player.currentDir="right";
      } else {
        root.player.currentDir="idle";
      }
    });

    globalEvent.activateKeyDetection();
  }

  private load(mapPack?): void {
    const root=this;

    if(typeof mapPack==="undefined") {
      mapPack=Level1;
    }

    // HARDCODE Test
    // mapPack = Level6;

    const gameMap: GameMap=new GameMap(mapPack);

    /**
     * @description Override data from starter.
     */
    this.starter.setWorldBounds(
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_LEFT,
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_TOP,
      root.deadZoneForRight,
      root.deadZoneForBottom
    );

    this.playerSpawn(false);

    gameMap.getStaticBackgrounds().forEach(item => {
      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          isSleeping: false,
          label: "background",
          render: {
            visualComponent: new TextureComponent("wall", item.tex),
            sprite: {
              olala: true,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );
      newStaticElement.collisionFilter.group=-1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length-1] as Matter.Body)
        .render as any).visualComponent
        .setVerticalTiles(item.tiles.tilesY)
        .setHorizontalTiles(item.tiles.tilesX);
    });

    gameMap.getStaticGrounds().forEach(item => {
      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          isSleeping: false,
          label: "ground",
          collisionFilter: {
            group: this.staticCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgGround", item.tex),
            sprite: {
              olala: true,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );

      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length-1] as Matter.Body)
        .render as any).visualComponent
        .setVerticalTiles(item.tiles.tilesX)
        .setHorizontalTiles(item.tiles.tilesY);
    });

    gameMap.getCollectItems().forEach(item => {
      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.colectionLabel,
          collisionFilter: {
            group: this.staticCategory,
            mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: new TextureComponent("imgCollectItem1", item.tex),
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );
      (newStaticElement.render as any).visualComponent
        .setVerticalTiles(item.tiles.tilesY)
        .setHorizontalTiles(item.tiles.tilesX);
      this.grounds.push(newStaticElement);
    });

    gameMap.getEnemys().forEach(item => {
      let enemySprite;

      if(item.enemyLabel==="crapmunch") {
        enemySprite=new SpriteTextureComponent("enemy", item.tex, {
          byX: 10,
          byY: 1,
        });
      } else if(item.enemyLabel==="chopper") {
        enemySprite=new SpriteTextureComponent("enemy", item.tex, {
          byX: 5,
          byY: 1,
        });
      }

      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: false,
          label: item.enemyLabel,
          density: 0.0005,
          friction: 0.01,
          frictionAir: 0.06,
          restitution: 0.3,
          collisionFilter: {
            group: this.staticCategory,
            mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: enemySprite,
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );

      (newStaticElement.render as any).visualComponent.keepAspectRatio=true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);
      this.enemys.push(newStaticElement);
    });

    gameMap.getDeadLines().forEach(item => {
      let enemySprite;

      root.deadZoneForBottom=item.y;

      enemySprite=new SpriteTextureComponent("deadline", item.tex, {
        byX: item.tiles.tilesX,
        byY: item.tiles.tilesY,
      });

      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: item.enemyLabel,
          density: 0.0005,
          friction: 0.01,
          frictionAir: 0.06,
          restitution: 0.3,
          collisionFilter: {
            group: -1,
            mask: this.playerCategory,
          } as any,
          render: {
            visualComponent: enemySprite,
            sprite: {
              olala: true,
              xScale: 1,
              yScale: 1,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );

      (newStaticElement.render as any).visualComponent.keepAspectRatio=true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);

      this.deadLines.push(newStaticElement);
    });

    gameMap.getStaticBanners().forEach(item => {
      const newStaticElement: worldElement=Matter.Bodies.rectangle(
        item.x,
        item.y,
        item.w,
        item.h,
        {
          isStatic: true,
          label: "Label Text",
          render: {
            visualComponent: new TextComponent(item.text, item.options!),
            sprite: {
              olala: true,
            },
          } as any|Matter.IBodyRenderOptions,
        }
      );
      newStaticElement.collisionFilter.group=-1;
      this.labels.push(newStaticElement);
    });

    this.starter.AddNewBodies(this.grounds as worldElement);
    this.starter.AddNewBodies(this.enemys as worldElement);
    this.starter.AddNewBodies(this.deadLines as worldElement);
    this.starter.AddNewBodies(this.player as worldElement);
    this.starter.AddNewBodies(this.labels as worldElement);

    /**
     * @description
     * Test Generator
     */
    // Create text and sprite
    let textureGenerator=require("../imgs/collect-items/tileYellow_09.png");
    let enemyTex=new TextureComponent("gen", textureGenerator);
    const newParamsElement: worldElementParams|any={
      x: 300,
      y: 300,
      w: 30,
      h: 30,
      playerRadius: 30,
      arg2: {
        isStatic: false,
        label: "enemy",
        density: 0.0005,
        friction: 0.01,
        frictionAir: 0.06,
        restitution: 0.3,
        collisionFilter: {
          group: 0x0002,
          mask: 0x0004,
        } as any,
        render: {
          visualComponent: enemyTex,
          sprite: {
            xScale: 1,
            yScale: 1,
          },
        } as any|Matter.IBodyRenderOptions,
      },
    };

    // Force initial
    this.generatorOfCollecions=new Generator({
      genType: worldElementType.RECT,
      emit: [
        { force: { x: 0.02, y: -0.01 } },
        { force: { x: -0.02, y: -0.01 } },
        { force: { x: 0.02, y: -0.01 } },
        { force: { x: -0.01, y: -0.02 } },
        { force: { x: 0.01, y: -0.02 } },
        { force: { x: -0.01, y: -0.02 } }
      ],
      delayForce: [
        { delta: 500, force: { x: -0.02, y: -0.01 } },
        { delta: 1500, force: { x: 0.02, y: -0.02 } },
        { delta: 2000, force: { x: -0.02, y: -0.01 } },
        { delta: 500, force: { x: -0.03, y: -0.01 } },
        { delta: 1500, force: { x: 0.03, y: -0.02 } },
        { delta: 2000, force: { x: -0.03, y: -0.01 } }
      ],
      counter: new Counter(0, 1, 1, "REPEAT"),
      newParamsElement: newParamsElement,
      starter: this.starter,
      destroyAfter: 3000
    });

    this.attachMatterEvents();
  }
}

export default GamePlay;
