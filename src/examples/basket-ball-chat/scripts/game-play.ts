import * as Matter from "matter-js";
import BotBehavior from "../../../libs/class/bot-behavior";
import Broadcaster from "../../../libs/class/networking/broadcaster";
import { byId } from "../../../libs/class/system";
import SpriteTextureComponent from "../../../libs/class/visual-methods/sprite-animation";
import TextComponent from "../../../libs/class/visual-methods/text";
import TextureComponent from "../../../libs/class/visual-methods/texture";
import { DEFAULT_GAMEPLAY_ROLES, DEFAULT_RENDER_BOUNDS } from "../../../libs/defaults";
import { IMultiplayer } from "../../../libs/interface/global";
import Starter from "../../../libs/starter";
import { worldElement } from "../../../libs/types/global";
import Level1 from "../scripts/packs/BasketBallChat-level1";
import BasketBallChat from "./basketBallChat";
import GameMap from "./map";

/**
 * @description Finally game start at here
 * @function Handling muliplayer part and manage whole gam play.
 * @return void
 */
class GamePlay extends BasketBallChat implements IMultiplayer {

  public multiPlayerRef: any = {
    root: this,
    init (rtcEvent) {

      console.log("rtcEvent addNewPlayer: ", rtcEvent);
      this.root.addNetPlayer(this.root, rtcEvent);

    },

    update (multiplayer) {

      if (multiplayer.data.netPos) {

        Matter.Body.setPosition(this.root.netBodies["netObject_" + multiplayer.userid], { x: multiplayer.data.netPos.x, y: multiplayer.data.netPos.y });

        Matter.Body.setAngle(
          this.root.netBodies["netObject_" + multiplayer.userid],
          -Math.PI * 0,
        );

        if (multiplayer.data.netDir) {
          if (multiplayer.data.netDir === "left") {
            this.root.netBodies["netObject_" + multiplayer.userid].render.visualComponent.setHorizontalFlip(false);
          } else if (multiplayer.data.netDir === "right") {
            this.root.netBodies["netObject_" + multiplayer.userid].render.visualComponent.setHorizontalFlip(true);
          }
        }

      } else if (multiplayer.data.noMoreLives === true) {
        // What to do with gameplay ?!
        // Just hide or hard variand
        // server database politic make clear player is out of game
        // bis logic - Initator must have credibility

        // Not tested Soft
        this.root.netBodies["netObject_" + multiplayer.userid].render.visible = false;
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
    leaveGamePlay (rtcEvent) {

      console.info("rtcEvent LEAVE GAME: ", rtcEvent.userid);
      this.root.starter.destroyBody(this.root.netBodies["netObject_" + rtcEvent.userid]);
      delete this.root.netBodies["netObject_" + rtcEvent.userid];

    },

  };

  public broadcaster: Broadcaster;

  /**
   * @description deadZoneForBottom Definition and Default value
   * - overrided from map or map2d(generated) by deadLines object
   * DeadLines object. In future Can be used for enemy static action;
   */
  private deadZoneForBottom: number  = DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_BOTTOM;
  private deadZoneForRight: number  = DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_RIGHT;

  // Basket Ball Chat
  // Modification for new game
  // add bodies
  private ground;
  private rockOptions;
  private rock;
  private anchor;
  private elastic;
  private pyramid;
  private ground2;
  private pyramid2;

  constructor(starter: Starter) {

    super(starter);

    if (this.starter.ioc.getConfig().getAutoStartGamePlay()) {

      // Implement to the multiplayer solution:
      // level feature.
      // Override
      this.deadZoneForBottom = 2500;

      this.load();
    }

    // check this with config flag
    this.network = starter.ioc.get.Network;
    this.network.injector = this.multiPlayerRef;
    this.broadcaster = starter.ioc.get.Broadcaster;

    // MessageBox
    // this.starter.ioc.get.MessageBox.show(this.gamePlayWelcomeNote);

  }

  public attachAppEvents = () => {

    const myInstance = this;

    window.addEventListener("game-init", function (e) {

      try {
        if ((e as any).detail &&
           ((e as any).detail.data.game === "undefined")) {

            console.warn("Bad game-init attempt. No data.game param.");
            return;

        } else if ((e as any).detail &&
                  (e as any).detail.data.game === null ) {

          console.info("game-init Player spawn. data.game === null");
          myInstance.starter.ioc.get.Network.connector.startNewGame(myInstance.gameName);
          myInstance.broadcaster.openOrJoinBtn.click();

          myInstance.initSelectPlayer();
          myInstance.selectPlayer("nidzica");
          myInstance.playerSpawn(true);

          return;

        }

        myInstance.initSelectPlayer();
        myInstance.selectPlayer("nidzica");

        // How to access netwoking
        myInstance.starter.ioc.get.Network.connector.startNewGame(myInstance.gameName);
        myInstance.broadcaster.openOrJoinBtn.click();

        myInstance.load((e as any).detail.data.game);
        console.info("Player spawn. game-init .startNewGame");
      } catch (err) { console.error("Very bad #00001", err); }

    });

    window.addEventListener("game-end", function (e) {

      try {
        if ((e as any).detail &&
           (e as any).detail.data.game !== "undefined" &&
           (e as any).detail.data.game !== null &&
           (e as any).detail.data.game === myInstance.gameName) {

            myInstance.destroyGamePlayPlatformer();
            (byId("playAgainBtn") as HTMLButtonElement).disabled = true;
            (byId("openGamePlay") as HTMLButtonElement).disabled = false;
            (byId("out-of-game") as HTMLButtonElement).disabled = true;

            myInstance.starter.ioc.get.Network.connector.memo.save("activeGame", "none");
            myInstance.starter.ioc.get.Network.nameUI.disabled = (this as any).disabled = false;
            myInstance.starter.ioc.get.Network.connectUI.disabled = (this as any).disabled = false;
            myInstance.deattachMatterEvents();
            // Leave
            myInstance.starter.ioc.get.Network.rtcMultiConnection.leave();
            myInstance.starter.ioc.get.Network.rtcMultiConnection.disconnect();
            myInstance.netBodies = {};
            console.info("game-end global event. Destroying game play. DISCONNECT");

        }
      } catch (err) { console.error("Very bad #00003", err); }

    });

    window.addEventListener("stream-loaded", function (e) {

      try {

        let mediaDom = byId((e as CustomEvent).detail.data.streamId);
        mediaDom = mediaDom.getElementsByTagName("video")[0];

        console.info("Loaded stream: ", byId((e as CustomEvent).detail.data.streamId));
        console.info("Loaded stream: ", mediaDom);

        (myInstance as any).selectedPlayer.setCurrentTile("stream");
        (myInstance.player as any).render.visualComponent.setNewShema((myInstance as any).selectedPlayer);
        (myInstance.player as any).render.visualComponent.assets.SeqFrame.setNewSeqFrameRegimeType("CONST");
        (myInstance.player as any).render.visualComponent.seqFrameX.regimeType = "CONST";
        (myInstance.player as any).render.visualComponent.seqFrameY.regimeType = "CONST";
        (myInstance.player as any).render.visualComponent.assets.SeqFrame.value = 3;

        (myInstance.player as any).render.visualComponent.setStreamTexture(mediaDom);
        console.log("Stream added.");

      } catch (err) { console.error("Very bad #00004", err); }

    });

  }

  private deattachMatterEvents() {
    Matter.Events.off(this.starter.getEngine(), undefined, undefined);
  }

  private overrideOnKeyDown = () => {

    const testRoot = this;

    if (typeof testRoot.player === "undefined" || testRoot.player === null) { return; }
    const vc = testRoot.player.render.visualComponent;
    if (vc.assets.SeqFrame.getValue() === 0 ||
        testRoot.selectedPlayer.spriteTileCurrent === "stream") {
      return;
    }

    testRoot.selectedPlayer.setCurrentTile("run");
    testRoot.player.render.visualComponent.setNewShema(testRoot.selectedPlayer);
    testRoot.player.render.visualComponent.assets.SeqFrame.setNewValue(0);
    testRoot.player.render.visualComponent.seqFrameX.setDelay(8);

  }

  private overrideOnKeyUp = () => {

    const testRoot = this;

    if (typeof testRoot.player === "undefined" || testRoot.player === null) {
      return;
    }
    const vc = testRoot.player.render.visualComponent;
    if (vc.assets.SeqFrame.getValue() === 0 ||
        testRoot.selectedPlayer.spriteTileCurrent === "stream") {
      return;
    }
    testRoot.selectedPlayer.setCurrentTile("idle");
    testRoot.player.render.visualComponent.setNewShema(testRoot.selectedPlayer);
    vc.assets.SeqFrame.setNewValue(2);
    vc.seqFrameX.setDelay(8);

  }

  private attachMatterEvents() {

    const root = this;
    const globalEvent = this.starter.ioc.get.GlobalEvent;
    globalEvent.providers.onkeydown = this.overrideOnKeyDown;
    globalEvent.providers.onkeyup = this.overrideOnKeyUp;
    const playerSpeed = 0.005;

    root.starter.setRenderView(DEFAULT_RENDER_BOUNDS.WIDTH, DEFAULT_RENDER_BOUNDS.HEIGHT);

    this.enemys.forEach(function (item) {
      const test = new BotBehavior(item);
      test.patrol();
    });

    Matter.Events.on(this.starter.getEngine(), "afterUpdate", function () {

      if (root.starter.getMouseConstraint().mouse.button === -1 &&
         (root.player.position.x > 190 && root.player.position.x < 230)) {
        // root.rock = Matter.Bodies.polygon(170, 450, 7, 20, root.rockOptions);
        // Matter.World.add(root.starter.getEngine().world, root.player);
        root.elastic.bodyB = root.player;
        console.log(" eLASTICK TEST");

      } else {
        root.rock = Matter.Bodies.polygon(170, 450, 7, 20, root.rockOptions);
        root.elastic.bodyB = root.rock;
      }

    });

    Matter.Events.on(this.starter.getEngine(), "beforeUpdate", function () {

      if (!root.player) { return; }

      if (root.player && root.player.position.y > root.deadZoneForBottom) {
        root.playerDie(root.player);
      }

      if (root.player) {
        Matter.Body.setAngle(root.player, -Math.PI * 0);
      // Matter.Body.setAngle(root.enemys[0] as Matter.Body, -Math.PI * 0);

        Matter.Bounds.shift(root.starter.getRender().bounds,
        {
          x: root.player.position.x - root.starter.getRender().options.width / 1.3,
          y: root.player.position.y - root.starter.getRender().options.height / 1.3,
        });

        if (root.player.velocity.x < 0.00001 && root.player.velocity.y === 0 &&
          // tslint:disable-next-line: no-empty
          root.player.currentDir === "idle" ) {
            // empty
        } else {
          // console.log(" root.network.rtcMultiConnection.send({  ", root.network.rtcMultiConnection.send );
          root.network.rtcMultiConnection.send({
            netPos: root.player.position,
            netDir: root.player.currentDir,
          });
        }

      }
    });

    const limit = 0.3;

    // at the start of a colision for player
    Matter.Events.on(this.starter.getEngine(), "collisionStart", function (event) {
      root.collisionCheck(event, true);
    });

    // ongoing checks for collisions for player
    Matter.Events.on(this.starter.getEngine(), "collisionActive", function (event) {
      root.collisionCheck(event, true);
    });

    // at the end of a colision for player set ground to false
    Matter.Events.on(this.starter.getEngine(), "collisionEnd", function (event) {
      root.collisionCheck(event, false);
    });

    Matter.Events.on(this.starter.getEngine(), "afterTick", function () {

      if (!root.player) { return; }
      // jump
      if (globalEvent.activeKey[38] && root.player.ground) {

        const s = (root.player.circleRadius * playerSpeed);
        root.player.ground = false;
        root.player.force = {
          x: 0,
          y: -(s),
        };
        Matter.Body.setVelocity(root.player, { x: 0, y: -s });
        // this.player.currentDir = "jump";

      } else if (globalEvent.activeKey[37] && root.player.angularVelocity > -limit) {

        root.player.render.visualComponent.setHorizontalFlip(true);
        root.player.force = {
          x: -playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);
        root.player.currentDir = "left";

      } else if (globalEvent.activeKey[39] && root.player.angularVelocity < limit) {

        root.player.render.visualComponent.setHorizontalFlip(false);
        root.player.force = {
          x: playerSpeed,
          y: 0,
        };
        Matter.Body.applyForce(root.player, { x: root.player.position.x, y: root.player.position.y }, root.player.force);
        root.player.currentDir = "right";

      } else {
        root.player.currentDir = "idle";
      }

    });

    globalEvent.activateKeyDetection();

  }

  private load(mapPack?): void {

    const root = this;

    if (typeof mapPack === "undefined") {
      mapPack = Level1;
    }

    const gameMap: GameMap = new GameMap(mapPack);

    /**
     * @description Override data from starter.
     */
    this.starter.setWorldBounds(
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_LEFT,
      DEFAULT_GAMEPLAY_ROLES.MAP_MARGIN_TOP,
      root.deadZoneForRight,
      root.deadZoneForBottom);

    this.starter.setRenderView( 1200,  600);

    this.starter.getRender().controller.lookAt(this.starter.getRender(), {
      min: {
        x: 0,
        y: 0,
      },
      max: {
        x: 1200,
        y: 600,
      },
    });

    this.playerSpawn(false);

    /*
    gameMap.getStaticBackgrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          isSleeping: false,
          label: "background",
          render: {
            visualComponent: new TextureComponent("wall", item.tex),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      newStaticElement.collisionFilter.group = -1;
      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles.tilesY).
        setHorizontalTiles(item.tiles.tilesX);

    });
    */

    gameMap.getStaticGrounds().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
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
          } as any | Matter.IBodyRenderOptions,
        });

      this.grounds.push(newStaticElement);

      ((this.grounds[this.grounds.length - 1] as Matter.Body).render as any).visualComponent.setVerticalTiles(item.tiles.tilesX).
        setHorizontalTiles(item.tiles.tilesY);

    });

    gameMap.getCollectItems().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
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
          } as any | Matter.IBodyRenderOptions,
        });
      (newStaticElement.render as any).visualComponent.setVerticalTiles(item.tiles.tilesY).
        setHorizontalTiles(item.tiles.tilesX);
      this.grounds.push(newStaticElement);

    });

    gameMap.getEnemys().forEach((item) => {

      let enemySprite;

      if (item.enemyLabel === "crapmunch") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 10, byY: 1 });
      } else if (item.enemyLabel === "chopper") {
        enemySprite = new SpriteTextureComponent("enemy", item.tex, { byX: 5, byY: 1 });
      }

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
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
          } as any | Matter.IBodyRenderOptions,
        });

      (newStaticElement.render as any).visualComponent.keepAspectRatio = true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);
      this.enemys.push(newStaticElement);

    });

    gameMap.getDeadLines().forEach((item) => {

      let enemySprite;

      root.deadZoneForBottom = item.y;

      enemySprite = new SpriteTextureComponent("deadline", item.tex, { byX: item.tiles.tilesX, byY: item.tiles.tilesY });

      const newStaticElement: worldElement = Matter.Bodies.rectangle(
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
          } as any | Matter.IBodyRenderOptions,
        });

      (newStaticElement.render as any).visualComponent.keepAspectRatio = true;
      (newStaticElement.render as any).visualComponent.setHorizontalFlip(true);

      this.deadLines.push(newStaticElement);

    });

    gameMap.getStaticBanners().forEach((item) => {

      const newStaticElement: worldElement = Matter.Bodies.rectangle(item.x, item.y, item.w, item.h,
        {
          isStatic: true,
          label: "Label Text",
          render: {
            visualComponent: new TextComponent(item.text, item.options!),
            sprite: {
              olala: true,
            },
          } as any | Matter.IBodyRenderOptions,
        });
      newStaticElement.collisionFilter.group = -1;
      this.labels.push(newStaticElement);

    });

    // Elasticks objects.
    this.ground = Matter.Bodies.rectangle(395, 600, 815, 50,
       { isStatic: true,
         collisionFilter: {group: -1},
       }),
       this.rockOptions = {
        density: 0.004 ,
        collisionFilter: {
          category: this.playerCategory,
        } as any,
      },
      this.rock = Matter.Bodies.polygon(170, 450, 8, 20, this.rockOptions),
      this.anchor = { x: 170, y: 450 },
      this.elastic = Matter.Constraint.create({
        pointA: this.anchor,
        bodyB: this.rock,
        stiffness: 0.05,
      });

    this.pyramid = Matter.Composites.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
      return Matter.Bodies.rectangle(
        x, y, 25, 40,
        { collisionFilter: {
            category: root.staticCategory,
          } as any,
        });
    });

    this.ground2 = Matter.Bodies.rectangle(610, 250, 200, 20, { isStatic: true });

    this.pyramid2 = Matter.Composites.pyramid(550, 0, 5, 10, 0, 0, function (x, y) {
        return Matter.Bodies.rectangle(x, y, 25, 40,
          { collisionFilter: {
            category: root.staticCategory,
          } as any,
        });
    });

    this.starter.AddNewBodies(this.grounds as worldElement);
    this.starter.AddNewBodies(this.enemys as worldElement);
    this.starter.AddNewBodies(this.deadLines as worldElement);
    this.starter.AddNewBodies(this.player as worldElement);
    this.starter.AddNewBodies(
      [this.ground, this.pyramid, this.ground2, this.pyramid2, this.rock, this.elastic] as worldElement);
    this.starter.AddNewBodies(this.labels as worldElement);
    this.attachMatterEvents();

  }

}

export default GamePlay;
