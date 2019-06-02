# Project : Visual ts game engine #
## Version : Sunshine - 2019 ##

#### 2d canvas game engine based on Matter.js 2D physics engine for the web. ####

 - Writen in typescript current version 3.1.3.
 - Text editor used and recommended: Visual Studio Code. Luanch debugger configuration comes with
   this project.
 - Physics engine based on Matter.js.
 - Multiplatform video chat (for all browsers) implemented. SocketIO used for session staff.
   MultiRTC2 used for data transfer also for video chat. MultiRTC3 alias 'broadcaster' used for video chat.

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/logo.png)

## Client part ##

#### To make all dependency works in build proccess we need some plugins. ####

```javascript
  npm install
```

```javascript
  npm run build
```

<b> Navigate in browser /build/app.html to see client app in action </b>

 -Client part is browser web application. No reloading or redirecting. This is single page
 application. I use html request only for loading local/staged html (like register, login etc.).
 Networking is based on webSocket full-duplex communication only. This is bad for old fasion programmers.
 You must be conform with classic socket connection methodology.
 -webRTC can be used for any proporsion.
   Already implemented :
   -video chat webRTC (SIP) chat and data communication.

 -Class 'Connector' (native webSocket) used for user session staff.
  For main account session staff like login, register etc.

### Client config ###

If you want web app without any networking then setup:

<code>  appUseNetwork: boolean = false; </code>

You want to use communication for multiplayer but you don't want to use server database
account sessions. The setup this on false in main client config class.
<code>  appUseAccountsSystem: boolean = false; </code>

 - Networking is disabled by default.

Find configuration at ./src/lib/client-config.ts

```javascript
/**
   * Addson
   */
  private addson: Addson = [
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
  ];

  /**
   * @description This is main coordinary types of positions
   * Can be "diametric-fullscreen" or "frame".
   * @property drawReference
   * @type  string
   */
  private drawReference: string = "frame";

  /**
   * aspectRatio default value, can be changed in run time.
   */
  private aspectRatio: number = 1.333;

  /**
   * domain is simple url address,
   * recommendent to use for local propose LAN ip
   * like : 192.168.0.XXX if you wanna run ant test app with server.
   */
  private domain: string = "maximumroulette.com";

  /**
   * networkDeepLogs control of dev logs for webRTC context only.
   */
  private networkDeepLogs: boolean = false;

  /**
   * masterServerKey is channel access id used to connect
   * multimedia server channel.
   */
  private masterServerKey: string = "multi-platformer-sever1.maximum";

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
   * @description Important note for this property: if you
   * disable (false) you cant use Account system or any other
   * network. Use 'false' if you wanna make single player game.
   * In other way keep it 'true'.
   */
  private appUseNetwork = false;

  /**
   * appUseAccountsSystem If you don't want to use session
   * in your application just setup this variable to the false.
   */
  private appUseAccountsSystem: boolean = false;

  /**
   * appUseBroadcaster Disable or enable broadcaster for
   * video chats.
   */
  private appUseBroadcaster: boolean = false;

  /**
   * Possible variant by default :
   * "register", "login"
   */
  private startUpHtmlForm: string = "register";

  private gameList: any[];

  /**
   * Implement default gamePlay variable's
   */
  private defaultGamePlayLevelName: string = "level1";
  private autoStartGamePlay: boolean = true;

```

### Start dependency system from app.ts ###

 - Fisrt game template is Platformer.
     This is high level programming in this software. Class Platformer run
     with procedural (method) level1. Class Starter is base class for my canvas part.
     It is injected to the Platformer to make full operated work.
 - gamesList args for ioc constructor is for now just simbolic for now. (WIP)
 - In ioc you can make strong class dependency relations.
   Use it for your own structural changes.

#### Main dependency file ####

```typescript

// Symbolic for now
const plarformerGameInfo = {
  name: "Crypto-Runner",
  title: "PLAY PLATFORMER CRYPTO RUNNER!",
};

// Symbolic for now
const gamesList: any[] = [
  plarformerGameInfo,
];

const master = new Ioc(gamesList);
const appIcon: AppIcon = new AppIcon(master.get.Browser);
master.singlton(Platformer, master.get.Starter);
console.log("Platformer: ", master.get.Platformer);
master.get.Platformer.attachAppEvents();

```

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
|   |   |   |   ├── broadcaster-media.ts
|   |   |   |   ├── broadcaster.ts
|   |   |   |   ├── connector.ts
|   |   |   |   ├── network.ts
|   |   |   ├── visual-methods/
|   |   |   |   ├── sprite-animation.ts
|   |   |   |   ├── texture.ts
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
|   |   ├── engine-config.ts
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

 Config property defined in constructor from ServerConfig class.

```javascript
    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.rtc3ServerPort = 12034;
    this.connectorPort = 1234;
    this.domain = "192.168.0.14";
    this.masterServerKey = "multi-platformer-sever1.maximum";
    this.protocol = "http";
    this.isSecure = false;
    this.appUseAccountsSystem = true;
    this.appUseVideoChat = true;
    this.databaseName = "masterdatabase";
    this.databaseRoot = "mongodb://localhost:27017";
```

<b> - Running server is easy : </b>

```javascript
  npm run rtc
```
With this cmd : <i>npm run rtc</i> we run server.js and connector.ts websocket. Connector is our account session used for login , register etc.
- Implemented video chat based on webRTC protocol.

<b> - Running rtc3 server is also easy : </b>

Command 'npm run broadcaster' is not nessesery for begin.
Features comes with broadcaster:
 - Multiplatform video chat works with other hybrid frameworks or custom implementation throw the native
   mobile application web control (Chrome implementation usually).


```javascript
  npm run broadcaster
```

## Documentation : ##

 Beta version for documentation.
 ![Application documentation](https://maximumroulette.com/applications/visual-typescript-game-engine/build/api-doc/globals.html)


 If you wanna generate doc you will need manual remove comment
 from plugin section in webpack.config.js. Restart 'npm run dev'
 Best way to fully healty build.
 HTML/CSS is not prior in this project.

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

## External licence in this project : ##

 <b>- Networking based on :</b> <br/>
 Muaz Khan MIT License www.WebRTC-Experiment.com/licence <br/>

 <b>- Base physics beased on :</b> <br/>
 Matter.js https://github.com/liabru/matter-js <br/>

 <b>Crypto icons downloaded from :</b>
 https://www.behance.net/JunikStudio

 <b>Sprites downloaded from :</b>
  dumbmanex.com
  opengameart.org/content/animated-flame-texture

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
