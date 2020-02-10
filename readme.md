# Project : Visual ts game engine #
## Version : `We can fight` - 2020 ##

#### 2d canvas game engine based on Matter.js 2D physics engine for the web. ####

  I use my own concept: `take lib for great benefits`. It means that i import only staff that i can't make
  in proper way in proper time, all other coming from head. For example `Physics` was imported
  in role of npm package for typescript matter.js variant and i keep dependency healthy. In
  networking aspect i use full-duplex connection under web-rtc protocol. Pretty nice working
  combination of physics and realtime-multiplayer connetions. PeerToPeer used for game-play
  and classic websocket(socketio) for session staff. HTMLRequest used only for loading html
  parts in run time (on request) because i want clear single page application with all PWA
  features inside. Also video chat is integrated based on signaling server.
  No video recording for now (next features).

 - Writen in typescript current version 3.7.4.
 - Text editor used and recommended: Last version of Visual Studio Code.
   Luanch debugger configuration comes with this project (for server part).
 - Physics engine based on Matter.js - Matter.ts (npm project).
 - Multiplatform video chat (for all browsers) implemented. SocketIO used for session staff.
   MultiRTC2 used for data transfer also for video chat. MultiRTC3 alias 'broadcaster' used for video chat.

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/logo.png)

## Client part ##

#### To make all dependency works in build proccess we need some plugins. ####

```javascript
  npm install
```

Command:
```javascript
  npm run dev
```

Output:
<pre>

├── build/  (This is auto generated)
|   ├── externals/
|   ├── imgs/
|   ├── styles/
|   ├── templates/
|   ├── app.html
|   ├── manifest.web
|   ├── offline.html
|   ├── visualjs2.js
|   ├── worker.js

</pre>


<b> Navigate in browser /build/app.html to see client app in action </b>

### New way of building multi entryes.

Sufix is `-all` . This is test for multi instancing webpack capabilities.
Thanks for common object definition:

```javascript
let config = {
    module: {},
};
```

Point of Multi entries is to make independent healthy builds end point
for our application. Current export's for 2 solutions looks like
(runs webpack.multicompile.config.js) :

Command:
```javascript
  npm run dev-all
```

Output:
<pre>

├── build/  (This is auto generated)
|   ├── multiplayer/
|   ├── singleplaye/

</pre>


 -Client part is browser web application. No reloading or redirecting. This is single page
 application. I use html request only for loading local/staged html (like register, login etc.).
 Networking is based on webSocket full-duplex communication only. This is bad for old fasion programmers.
 You must be conform with classic socket connection methodology.
 -webRTC can be used for any proporsion.
   Already implemented :
   -video chat webRTC (SIP) chat and data communication.
   -Simple facebook api script.

 -Class 'Connector' (native webSocket) used for user session staff.
  For main account session staff like login, register etc.

### Client config ###

If you want web app without any networking then setup:

<code>  appUseNetwork: boolean = false; </code>

You want to use communication for multiplayer but you don't want to use server database
account sessions. The setup this on false in main client config class.
<code>  appUseAccountsSystem: boolean = false; </code>

 - Networking is disabled or enabled depens on current dev status.

Find configuration for client part at ./src/lib/client-config.ts

```javascript
import { Addson } from "./libs/types/global";

/**
 * ClientConfig is config file for whole client part of application.
 * It is a better to not mix with server config staff.
 * All data is defined like default private property values.
 * Use mmethod class to get proper.
 * Class don't have any args passed.
 */
class ClientConfig {

  /**
   * Addson - Role is : "no dependencies scripts only"
   * All addson are ansync loaded scripts.
   *  - hackerTimer is for better performace also based on webWorkers. Load this script on top.
   *  - Cache is based on webWorkers.
   *  - dragging is script for dragging dom elements taken from stackoverflow.com.
   *  - facebook addson is simple fb api implementation.
   *  - adapter is powerfull media/communication fixer(Objective : working on all moder browsers).
   */
  private addson: Addson = [
    {
      name: "cache",
      enabled: true,
      scriptPath: "externals/cacheInit.ts",
    },
    {
      name: "hackerTimer",
      enabled: true,
      scriptPath: "externals/hack-timer.js",
    },
    {
      name: "dragging",
      enabled: true,
      scriptPath: "externals/drag.ts",
    },
    {
      name: "adapter",
      enabled: true,
      scriptPath: "externals/adapter.js",
    },
    {
      name: "facebook",
      enabled: true,
      scriptPath: "externals/fb.js",
    }
  ];

  /**
   * @description This is main coordinary types of positions
   * Can be "diametric-fullscreen" or "frame".
   *  - diametric-fullscreen is simple fullscreen canvas element.
   *  - frame keeps aspect ratio in any aspect.
   * @property drawReference
   * @type  string
   */
  private drawReference: string = "frame";

  /**
   * aspectRatio default value, can be changed in run time.
   * This is 800x600, 1.78 is also good fit for lot of desktop monitors screens
   */
  private aspectRatio: number = 1.333;

  /**
   * domain is simple url address,
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  private domain: string = "maximumroulette.com";

  /**
   * @description Important note for this property: if you
   * disable (false) you cant use Account system or any other
   * network. Use 'false' if you wanna make single player game.
   * In other way keep it 'true'.
   */
  private appUseNetwork = true;

  /**
   * networkDeepLogs control of dev logs for webRTC context only.
   */
  private networkDeepLogs: boolean = false;

  /**
   * masterServerKey is channel access id used to connect
   * multimedia server channel.Both multiRTC2/3
   */
  private masterServerKey: string = "maximumroulette.server1";

  /**
   * rtcServerPort Port used to connect multimedia server.
   * Default value is 12034
   */
  private rtcServerPort: number = 12034;

  /**
   * connectorPort is access port used to connect
   * session web socket.
   */
  private connectorPort: number = 1234;

  /**
   * broadcasterPort Port used to connect multimedia server MultiRTC3.
   * I will use it for explicit video chat multiplatform support.
   * Default value is 9001
   */
  private broadcasterPort: number = 9001;

  /**
   * broadcaster socket.io address.
   * Change it for production regime
   */
  private broadcastSockRoute: string = "http://localhost:9001/";

  /**
   * broadcaster socket.io address.
   * Change it for production regime
   */
  private broadcastAutoConnect: boolean = true;

  /**
   * broadcaster rtc session init values.
   * Change it for production regime
   */
  private broadcasterSessionDefaults: any = {
    sessionAudio: false,
    sessionVideo: false,
    sessionData: true,
    enableFileSharing: false
  };

  /**
   * appUseAccountsSystem If you don't want to use session
   * in your application just setup this variable to the false.
   */
  private appUseAccountsSystem: boolean = true;

  /**
   * appUseBroadcaster Disable or enable broadcaster for
   * video chats.
   */
  private appUseBroadcaster: boolean = true;

  private stunList: string[] = [
    "stun:stun.l.google.com:19302",
    "stun:stun1.l.google.com:19302",
    "stun:stun2.l.google.com:19302",
    "stun:stun.l.google.com:19302?transport=udp"
  ];
  /**
   * Possible variant by default :
   * "register", "login"
   */
  private startUpHtmlForm: string = "register";

  private gameList: any[];

  /**
   * Implement default gamePlay variable's
   */
  private defaultGamePlayLevelName: string = "public";
  private autoStartGamePlay: boolean = false;

  /**
   * constructor will save interest data for game platform
   */
  constructor(gameList: any[]) {

    // Interconnection Network.Connector vs app.ts
    this.gameList = gameList;

  }

   ...


```

### Start dependency system from app.ts ###

 - Fisrt game template is Platformer.
     This is high level programming in this software. Class Platformer run
     with procedural (method) level1. Class Starter is base class for my canvas part
     (matter.js/ts).
     It is injected to the Platformer to make full operated work.
 - gamesList args for ioc constructor is for now just simbolic for now. (WIP)
 - In ioc you can make strong class dependency relations.
   Use it for your own structural changes. If you want to make light version for build
   than use ioc to remove everything you don't need in build.

  ioc.ts files located at: `src\controllers`. In ioc file i import choosen classes and
  create instance or bind. Ioc also save (singleton) instance's and we never make same
  class instance again (this is the role). We just call game.ioc.get.NAME_OF_INSTANCE.
  Object `.get` is key access object not array.
  Best practice is to use only one ioc. In that way you will get clear build without
  big shared in most time unnecessary data. If you application is big project.Than
  best way is still use one ioc.ts for per web page. In that way i use refresh
  or redirect moment to load optimised script bundle for current page.

#### Main dependency file ####

 - Current version:
```typescript

/**
 * Import global css
 */
require("./style/animations.css");
require("./style/styles.css");

import AppIcon from "./app-icon";
import GamePlay from "./examples/platformer/scripts/game-play";
import Ioc from "./controllers/ioc";

/**
 * plarformerGameInfo
 * This is strong connection.
 * html-components are on the same level with app.ts
 * Put any parameters here.
 */
const plarformerGameInfo = {
  name: "Platformer",
  title: "Start Platformer game play",
};

const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(GamePlay, master.get.Starter);
console.log("Platformer: ", master.get.GamePlay);

master.get.GamePlay.attachAppEvents();

/**
 * Make it global for fast access in console testing.
 * (window as any).platformer = master.get.GamePlay;
 */
(window as any).master = master;
(window as any).platformer = master.get.GamePlay;


```
#### About runup gameplay ####

In client-config :

`Disabled at the moment for single-player solution.`
javascript
```
  private autoStartGamePlay: boolean = false;
```

 If you setup 'autoStartGamePlay' to false you need to run gamePlay
 with :

javascript
```
  master.get.GamePlay.load()
```
 Note : Only singleton object instance from master start with upcase letters.

### Project structure ###

 - build/ is autogenerated. Don't edit or add content in this folder.
 - src/ is main client part (Browser web application).
   Main file : app.ts
 - src/libs/ is common and smart pack of classes, interfaces etc.
   easy access.
 - server/ folder is fully indipendent server size. I use one git repo
   but consider '/server' represent standalone application. There's server
   package.json independently from client part also config is not the common.
   I just like it like that.

<pre>

├── package.json
├── package-lock.json
├── webpack.config.js
├── tsconfig.json
├── tslint.json
├── launch.json
├── workplace.code-workspace
├── LICENCE
logo.png
LICENSE
├── build/  (This is auto generated)
|   ├── externals/
|   ├── templates/
|   ├── imgs/
|   ├── styles/
|   |   └── favicon.ico
|   ├── visualjs2.js
|   ├── app.html
├── src/
|   ├── style/
|   |   ├── styles.css
|   ├── controllers/
|   |   ├── ioc.ts
|   |   ├── ioc-single-player.ts
|   ├── libs/
|   |   ├── class/
|   |   |   ├── networking/
|   |   |   |   ├── rtc-multi-connection/
|   |   |   |   |   ├── FileBufferReader.js
|   |   |   |   |   ├── RTCMultiConnection2.js
|   |   |   |   |   ├── RTCMultiConnection3.js
|   |   |   |   |   ├── linkify.js
|   |   |   |   |   ├── getHTMLMediaElement.js
|   |   |   |   |   ├── socket.io.js
|   |   |   |   ├── broadcaster.ts
|   |   |   |   ├── connector.ts
|   |   |   |   ├── network.ts
|   |   |   ├── visual-methods/
|   |   |   |   ├── sprite-animation.ts
|   |   |   |   ├── text.ts
|   |   |   |   ├── texture.ts
|   |   |   ├── bot-behavior.ts
|   |   |   ├── browser.ts
|   |   |   ├── math.ts
|   |   |   ├── position.ts
|   |   |   ├── resources.ts
|   |   |   ├── sound.ts
|   |   |   ├── system.ts
|   |   |   ├── view-port.ts
|   |   |   ├── visual-render.ts
|   |   ├── interface/
|   |   |   ├── drawI.ts
|   |   |   ├── global.ts
|   |   |   ├── visual-components.ts
|   |   ├── multiplatform/
|   |   |   ├── mobile/
|   |   |   |   ├── player-controls.ts
|   |   |   ├── global-event.ts
|   |   ├── types/
|   |   |   ├── global.ts
|   |   ├── client-config.ts
|   |   ├── ioc.ts
|   |   ├── starter.ts
|   ├── icon/ ...
|   ├── examples/
|   |   ├── platformer/
|   ├── html-components/
|   |   ├── register.html
|   |   ├── login.html
|   |   ├── games-list.html
|   |   ├── user-profile.html
|   |   ├── store.html
|   |   ├── broadcaster.html
|   ├── index.html
|   ├── app-icon.ts
|   └── app.ts
|   └── manifest.web
└── server/
|   ├── package.json
|   ├── package-lock.json
|   ├── server-config.js
|   ├── database/
|   |   ├── database.js
|   |   ├── common/
|   |   ├── email/
|   |   |   ├── templates/
|   |   |   |   ├── confirmation.html.js
|   |   |   ├── nocommit.js (no commited for now)
|   |   └── data/ (ignored - db system folder)
|   ├── rtc/
|   |   ├── server.ts
|   |   ├── connector.ts
|   |   ├── self-cert/

</pre>


## Server part ##

### Installed database : mongodb@3.1.8 ###

-No typescript here, we need keep state clear no.
Node.js is best options.For email staff i choose :
 npm i gmail-send .

-Run services database server (Locally and leave it alive for develop proccess):

```javascript
  npm run dataserver
```

Looks like this :
 ```node
  mongod --dbpath ./server/database/data
 ```

Fix : "failed: address already in use" :

```javascript
  netstat -ano | findstr :27017

  taskkill /PID typeyourPIDhere /F
```

<b>Also important "Run Visual Studio Code as Administrator".</b>

 -Command for kill all node.js procces for window users :

```node
  taskkill /im node.exe /F
```


### Networking multimedia communication : WebSocketServer running on Node.js ###

 Text-based protocol SIP (Session Initiation Protocol) used for signaling and controlling multimedia sessions.

 #### General networking config: ####

 Config property defined in constructor from ServerConfig class
 in interest way. With two defined flags dev & prod it is easy resolved
 boring problem with migration localhost - public server :

```javascript
    // enum : 'dev' or 'prod'
    this.serverMode = "dev";

    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.rtc3ServerPort = 9001;
    this.connectorPort = 1234;

    this.domain = {
      dev: "localhost",
      prod: "maximumroulette.com"
    };

    this.masterServerKey = "maximumroulette.server1";
    this.protocol = "http";
    this.isSecure = false;

    // localhost
    this.certPathSelf = {
      pKeyPath: "./server/rtc/self-cert/privatekey.pem",
      pCertPath: "./server/rtc/self-cert/certificate.pem",
      pCBPath: "./server/rtc/self-cert/certificate.pem",
    };

    // production
    this.certPathProd = {
      pKeyPath: "/etc/httpd/conf/ssl/maximumroulette.com.key",
      pCertPath: "/etc/httpd/conf/ssl/maximumroulette_com.crt",
      pCBPath: "/etc/httpd/conf/ssl/maximumroulette.ca-bundle"
    };

    this.appUseAccountsSystem = true;
    this.appUseBroadcaster = true;
    this.databaseName = "masterdatabase";

    this.databaseRoot = {
      dev: "mongodb://localhost:27017" ,
      prod: "mongodb://userAdmin:********@maximumroulette.com:27017/admin"
    };

    this.specialRoute = {
      "default": "/var/www/html/applications/visual-typescript-game-engine/build/app.html"
    };
```

<b> - Running server is easy : </b>

```javascript
  npm run rtc
```

With this cmd : <i>npm run rtc</i> we run server.js and connector.ts websocket.
Connector is our account session used for login , register etc.
Implemented video chat based on webRTC protocol.Running rtc3 server is integrated.

If you wanna disable session-database-rtc2 features and run only `broadcaster`:

Features comes with broadcaster:
 - Multiplatform video chat works with other hybrid frameworks
   or custom implementation throw the native mobile application
   web control (Chrome implementation usually).


## Documentation : ##

 Follow link for API:
 [Application documentation](https://maximumroulette.com/applications/visual-typescript-game-engine/build/api-doc/globals.html)

 Possible to install from (It's good for instancing new clear base project):
```
   npm visual-ts
```

 If you wanna generate doc you will need manual remove comment
 from plugin section in webpack.config.js. Restart 'npm run dev'
 Best way to fully healty build.

If you wanna insert some new html page just define it intro
webpack.config.js :

```javascript
plugins : [
        new HtmlWebpackPlugin({
            filename: '/templates/myGameLobby.html',
            template: 'src/html-components/myGameLobby.html'
        }),
...
```
 - See register and login example.

### Code format : ###

```javascript
  npm run fix
  npm run tslint
```
or use :

```javascript
  tslint -c tslint.json 'src/**/*.ts' --fix
  tslint -c tslint.json 'src/**/*.ts'
```

## Licence ##

  Visual Typescript Game engine is under:
  #### MIT License generaly ####
  except ./src/lib. Folder lib is under:
  #### GNU LESSER GENERAL PUBLIC LICENSE Version 3 ####

## External licence in this project : ##

 <b>- Networking based on :</b> <br/>
 Muaz Khan MIT License www.WebRTC-Experiment.com/licence <br/>

 <b>- Base physics beased on :</b> <br/>
 Matter.js https://github.com/liabru/matter-js <br/>

 <b>Sprites downloaded from (freebies/no licence sites):</b>

 - https://craftpix.net/
 - https://dumbmanex.com
 - https://opengameart.org/content/animated-flame-texture
 - https://www.gameart2d.com/
 - https://www.behance.net/JunikStudio


## Todo list for 2019 ##

  <b>I'am still far a away from project objective :</b>

 - Make visual nodes for editor mode in game play.
 - Item's selling for crypto values.
 - Create examples demos in minimum 20 game play variants
  (table games, actions , platformers , basic demo trow the api doc etc.).
 - Implementing AR and webGL2.

![Platformer](https://github.com/zlatnaspirala/visual-ts/blob/master/platformer-typescript.png)

## [Live demo Platformer](https://codepen.io/zlatnaspirala/full/exxvQq) ##

## Donate this project ##

<b>Donate with any crypto value</b>
<a href="https://coingate.com/pay/visual-ts-game-engine" rel="noopener noreferrer nofollow" target="_blank"><img alt="CoinGate Payment Button" src="https://static.coingate.com/images/buttons/4.png" /></a>
