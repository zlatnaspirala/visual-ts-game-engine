# Project: Visual TS
## Current Version `1.0.0` 2025 BETA

### Status:
- From 1.0.0 new networking driver based on kurento media server.
- From 0.7.0 Migrate to webpack5 version
  [If you have some trouble try to deleting node_modules/ and install again]

#### 2d canvas game engine based on Matter.js 2D physics engine for the web supported with kurento/OVServer and visual GUI tool 2d map creator/python3.

I use my own concept: `take lib only for the great benefits`. It means that i import only stuff that i can't make in proper way in proper time, all other coming from head. For example `Physics` was imported in role of npm package for typescript matter.js/ts variant and i keep dependency healthy. 

Old networking point [If you dont want kurento in backend and you wanna your own server code]
It is nice if you wanna try. This works on 5$ VPS (node.js).
https://github.com/zlatnaspirala/visual-ts-game-engine/tree/POINT_WITH_OWN_SERVER_OLD

In networking aspect i use full-duplex connection under web-rtc protocol. Pretty nice working combination of physics and realtime-multiplayer connetions. HTMLRequest used only for loading html parts in run time (on request) and accounts{wip}  because i want clear single page application with all PWA features inside. Also video chat is integrated based on OV server/kurento.
You can start recording canvas gameplay with implemented `record-canvas`.

### For npm users

Take a look project examples on:
https://github.com/zlatnaspirala/visual-ts-examples

It is nice starter project. Fixed all deps to make `npm i visual-ts` usable.

[API Documentation](https://maximumroulette.com/apps/visual-ts/multiplayer/api-doc/)

### For github users

`git clone --recurse-submodules https://github.com/zlatnaspirala/visual-ts-game-engine`
After this command you can run GUI Python map creator tool.

### Whats good in this project:

- visual-ts correspondent with RocketCraftingServer/mongoDB in context of session accounts.
- Fast `full-duplex` connections based on webRTC [middleware/node.js] based on kurento OV server.
- Multiplatform/Realtime Multiplayer features + Video chat comes with visual-ts.
- No need for forums just follow stackoverflow.com and wc3.
- Easy stage/production switch
- Fast rebuild - Build single endpoint, Rebuild all
- Luanch/Attacher debugger options implemented [for visual code]
- Lib is not to much `inself` closed. Every intervention or used
  feature is exposed in high level in that way you can make very fast
  implementation of your own logic what ever will be.
- You are not forced to use typescript you can always downgrade to javascript this comes
  with typescript inself.
- Example multiplayer
- Migrated to webpack5

### Simple there is nothing between you and making the app.

- Written in typescript current version 4.2.4.
- Package tool used webpack 5.5.0.
- Text editor used and recommended: Last version of `Visual Studio Code` [1.95.x].
  Luanch debugger configuration comes with this project (for server part).
  Or run server on `Javascript Debug Terminal`.
- Physics engine based on `Matter.js - Matter.ts` (npm project).
- Mobile controls / Tested on android
  Based on touch area bounds LEFT , UP, RIGHT (for platformer based gameplay, for now).

## Logo

![](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/master/src/icon/favicon-96x96.png)

## Landscape logo

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/nonproject-files/logo.png)

### VisualTsGameEngine GUI tool 2d Map Creator made in python:

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/nonproject-files/creatorlogo.png)

#### Much more easyest way to make yor gameplay table sets is `creator-2dmap` python script. After installation of all needed modules vie pip3 for python3, you need to run:

@Note If you use
`git clone --recurse-submodules https://github.com/zlatnaspirala/visual-ts-game-engine`

Then run creator@dmap with `npm run creator`

```js
  // Windows
  python.exe tool.py
  // Macos - linux
  python3 ./tool.py
```

Possible bug on oldies linux os mint. Bug related with tkinter lib.

You need to change self.absolutePacksPath from defaults.py config file.
Put example platformer pack folder path: `src\examples\platformer\scripts\packs` but path must be absolute, my personal path is (For windows users : use double \ for escape ):

This is example for windows users:

```bash
E:\\web_server\\xampp\htdocs\\PRIVATE_SERVER\\visual-ts\\project\\visual-ts\\src\\examples\\platformer\\scripts\\packs\\"
```

![Creator 2d map](https://github.com/zlatnaspirala/creator-2dmap/blob/master/creator-2d-map.image.png)
This is separated and added like git submodules.

- This is freeware / opensource. There is no any limitation in this project.
  You can use video stream as gamePlay objects , multiplayer feature is also free.
- Please don't use fake email address to test public maximumroulette.com platformer example.
  Project even in dev stage is totally `production` approach. You can't pass registration with fake email.
  Just clone, install and run in local (client & server). You need to install and run also MongoDB on
  your system. Change flag in databased confimed to the `true` value to skip registration confirmation process.

## Client part

#### To make all dependency works in build proccess we need some plugins.

```javascript
  npm install
```

Command (current: single player solution build):

```javascript
  npm run dev
  // or
  npm run dev-all
```

Output for (npm run dev):

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

### New way of building multi entries.

Command is `npm run dev-all` . This is test for multi instancing webpack capabilities.
Webpack in this case use `webpack.multicompile.config.js`.
Thanks for common object definition:

This is best place to manage status of your build action.
Just comment or uncomment specific webpack object in this place =>

`webpack.multicompile.config.js`

```javascript
module.exports = [
  webPackModuleMultiPlayerSolution,
  webPackModuleSingleSimpleSolution,
  webPackModuleMultiChatBasketBall,
  webPackModuleTutorialsDemo1,
  // webPackModuleTutorialsDemo2  DISABLE HERE WHOLE SUB BUILD
];
```

Point of Multi entries is to make independent healthy builds end point
for our application. Current export's for 3 solutions looks like
(runs webpack.multicompile.config.js) :

Command:

```javascript
  npm run dev-all
```

Output (npm run dev-all):

<pre>

├── build/  (This is auto generated)
|   ├── multiplayer/
|   ├── singleplaye/
|   ├── demo1/
|   ├── demo2/
|   ├── sprite-animation/
|   ├── basket-ball-chat/ [WIP]

</pre>

-Client part is browser web application. No reloading or redirecting. This is single page
application. I use html request only for loading local/staged html (like register, login etc.).
Networking is based on webSocket full-duplex communication only. This is good cross for old
fasion native programmers not for web server REST oriented skills. No `mix` in communication usage.
You must be conform with classic socket connection methodology and your own idea about connections.
webRTC can be used for many proporsion.

Already implemented:

- video chat webRTC (SIP) chat and data communication.
  based on multiRTC3 for all modern browser's and hybryd implementation
  (android, ios etc.) (UDP/TCP). Running on socket.
- Bonus connections options - Coordinator another brodcaster.
  Parallel multiRTC connections. Coordinator is disabled by default
  but can be used in same way just like broadcaster.
- Simple facebook api script (addson).

-Class 'Connector' (native webSocket) used for user session staff.

- For main account session staff like login, register etc.

### Client config

If you want web app without any networking then setup:

<code> appUseNetwork: boolean = false; </code>

You want to use communication for multiplayer but you don't want to use server database
account sessions. The setup this on false in main client config class.
<code> appUseAccountsSystem: boolean = false; </code>

- Networking is disabled or enabled depens on current dev status.

Find configuration for client part at ./src/lib/client-config.ts

Please read [About Client Configuration](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/master/client-config-readme.md)

### Start dependency system from app.ts

- First game template is Platformer.
  This is high level programming in this software. Class Platformer run
  with . Class Starter is base class for my canvas part
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

#### Main dependency file

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

const gamesList: any[] = [plarformerGameInfo];

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

### Recording your game

Setup in `client-config.ts`:

```ts
  public recordCanvasOption: any = {
    injectCanvas: () => document.getElementsByTagName("canvas")[0],
    frameRequestRate: 30,
    videoDuration: 20,
    outputFilename: "record-gameplay.mp4",
    mineType: "video/mp4",
    resolutions: '800x600'
  }
```

You can use this call:

```ts
platformer.starter.ioc.get.RecordGamePlay.recordCanvas.run();
```

#### About runup gameplay

@Note Somethimes i override autoStartGamePlay!

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

### Project structure

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
|   |   |   |   ├── coordinator.ts
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
|   |   |   ├── controls.ts
|   |   |   ├── drawI.ts
|   |   |   ├── global.ts
|   |   |   ├── visual-components.ts
|   |   |   ├── networking.ts
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
|   |   ├── platformer-single-player/
|   |   ├── basket-ball-chat/
|   |   ├── tutorials/      (Most simple example of usage)
|   |   |   ├── add-camera-stream-to-gameplay/
|   |   |   ├── add-element/
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

### About Dev Prodc regime

Enum: `dev`, `prod`, `mongodb.net` or `mongodb.net-dev`

Explanation for:
this.serverMode = "mongodb.net-dev";
If you wanna use mongod.net database but you wanna use it from localhost.
Multiplayer (with videochat or realtime net) still use `https`.
For single player variant you can use `http`.

### Audios

Audios are not loaded by defoult if you use it in IOC controller.
You create audio instance from code.
You can mute it all.

#### Add new sound

- Open webpack and add line:
  [After this you need to restart webpack.]

```
new CopyWebpackPlugin([
  ...
  // Audios
  {from: "./src/examples/platformer-single-player/audios/player/dead.mp3", to: "audios/newAudio1.mp3"}
  {from: "./src/examples/platformer-single-player/audios/player/dead.mp3", to: "audios/newAudio2.mp3"}
], { debug: 'warn' })
```

- Find nice place for creating instance:

```js
myInstance.starter.ioc.get.Sound.createAudio(
  "./audios/newAudio1.mp3",
  "newAudio1"
);
myInstance.starter.ioc.get.Sound.createAudio(
  "./audios/newAudio2.mp3",
  "newAudio2"
);
```

- Find place where you wanna run play:

```js
root.starter.ioc.get.Sound.playById("jump");
```


### General networking config:

#### About generating localhost certs

[Read more about cert](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/server/rtc/apache-local-cert/help.md)
serverMode `dev` od `prod` use `https` protocol to make full works on both regime (If you using multiplayer example).
You need to install cert (mmc.exe) (for User or local Mashine), also in browser:

![](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/nonproject-files/browser-selfsign-allow.png)


### GUI Tools

To get GUI tools first download python3 for your OS.
`creator2dmap` is python3 canvas oriented application.

```javascript
  cd tools
  git submodule init
  git submodule update
  // or
  git clone --recurse-submodules https://github.com/zlatnaspirala/visual-ts-game-engine

  // update
  git fetch
  git merge
```

In this way you will get project: https://github.com/zlatnaspirala/creator-2dmap
intro `tools/creator2dmap/` folder.

Start application with:

```
  python.exe tool.py (win)
  ./python3 tool.py (macos)
```

## Documentation:

Follow link for API: [WIP]
[Application documentation](https://maximumroulette.com/apps/visual-ts/multiplayer/api-doc/)

Possible to install from (It's good for instancing new clear base project):

```
  npm i --save visual-ts
```

Take a look this repo (it is example for approach `npm i visual-ts`)
https://github.com/zlatnaspirala/visual-ts-module

If you wanna generate doc you will need manual remove comment
from plugin section in webpack.config.js. Restart 'npm run dev'

If you wanna insert some new html page just define it intro
webpack.config.js:

```javascript
plugins : [
        new HtmlWebpackPlugin({
            filename: '/templates/myGameLobby.html',
            template: 'src/html-components/myGameLobby.html'
        }),
...
```

- See register and login example.

### Code format :

```javascript
  npm run fix
  npm run tslint
```

or use :

```javascript
  tslint -c tslint.json 'src/**/*.ts' --fix
  tslint -c tslint.json 'src/**/*.ts'
```

## Abour visual tools

Based on python3 tk tech.It is standalone git project imported like
git submodule.

https://github.com/zlatnaspirala/creator-2dmap

[Important - About tools setup](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/tools/readme.md)

After setup run python app from cli with command:

```javascript
  npm run creator
```

![Creator 2d map](https://github.com/zlatnaspirala/visual-ts-game-engine/blob/dev/nonproject-files/creator2dmap.png)

</br>

## Public stage server / Tutorial demos

ACTUALLY SERVER IS RUNNING - You need to register.

#### Basic examples - How to create instance of engine. With minimum elements and features.

- #### [Static object vs Free](https://maximumroulette.com/apps/visual-ts/demo1/app.html)
- #### [Webcam stream loaded as player skin](https://maximumroulette.com/apps/visual-ts/demo2/app.html)

#### Platformer example without networking, without account session

- #### [Single player platformer](https://maximumroulette.com/apps/visual-ts/singleplayer/app.html)

#### Multiplayer - Without Account session

- #### [Video chat platformer](https://maximumroulette.com/apps/visual-ts/basket-ball-chat/app.html)

#### Multiplayer/webCam inside gamePlay - With Account session

- #### [Video chat platformer](https://maximumroulette.com/apps/visual-ts/multiplayer/app.html)

</br>

## Licence && Credits

Visual Typescript Game engine is under:

#### MIT License generaly

except ./src/lib. Folder lib is under:
#### GNU LESSER GENERAL PUBLIC LICENSE Version 3

### External licence in this project:

<b>- Networking based on:</b> <br/>
Kurento OpenVidu server [openvidu-browser-2.20.0]
https://openvidu.io/<br/>

<b>- Base physics beased on :</b> <br/>
Matter.js https://github.com/liabru/matter-js <br/>

<b>Sprites downloaded from (freebies/no licence sites):</b>

- https://craftpix.net/
- https://dumbmanex.com
- https://opengameart.org/content/animated-flame-texture
- https://www.gameart2d.com/
- https://www.behance.net/JunikStudio

<b>In Dreams by Scott Buckley | www.scottbuckley.com.au</b>
Music promoted by https://www.chosic.com/free-music/all/
Attribution 4.0 International (CC BY 4.0)
https://creativecommons.org/licenses/by/4.0/
</br>

## Todo list for 2025

<b>I'am still far a away from project objective :</b>

- Create examples demos in minimum 20 game play variants
  (table games, actions , platformers , basic demo trow the api doc etc.).

</br>

![Platformer](https://github.com/zlatnaspirala/visual-ts/blob/master/nonproject-files/platformer-typescript.png)

## Donate my work

### https://buy.stripe.com/test_7sIcQ13nz0pq8zS8ww

## Please join this project and make collaboration
