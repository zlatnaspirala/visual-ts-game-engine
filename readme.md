# Project : Visual ts game engine #
## Version : new era - 2018/2019 ##

### 2d canvas game engine based on Matter.js 2D physics engine for the web. ###
 Writen in typescript current version 3.1.3.  

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/logo.png)

#### To make all dependency works in build proccess we need some plugins. ####

<pre>
 <b> npm install </b>
</pre>

## Start dependency system from app.ts ##

 - Fisrt game template is Platformer.
     
## Main dependency file ##

```typescript
/**
 * Import global css
 */
require("./style/styles.css");

import AppIcon from "./app-icon";
import Platformer from "./examples/platformer/platformer";
import Ioc from "./libs/ioc";

const master = new Ioc();
const appIcon: AppIcon = new AppIcon(master.get.Browser);

master.singlton(Platformer, master.get.Starter);

```

## Project structure ##

<pre>
├── package.json
├── webpack.config.js
├── tsconfig.json
├── package-lock.json
├── tslint.json
├── src/
|   ├── style /
|   ├── libs /
|   ├── examples /
|   ├── index.html
|   ├── app-icon.ts
|   └── app.ts
└── server/
    └── server.ts
</pre>

## Fix code format : ##

```javascript
  tslint -c tslint.json 'src/**/*.ts' --fix
  tslint -c tslint.json 'src/**/*.ts'
```
or use : 

```javascript
  npm run fix
  npm run tslint
```
