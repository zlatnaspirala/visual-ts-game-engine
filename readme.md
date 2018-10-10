# Project : Visual ts game engine #
## Version : new era - 2018/2019 ##

![visualTS](https://github.com/zlatnaspirala/visual-ts/blob/master/logo.png)

#### To make all dependency works in build proccess we need some plugins. ####

<pre>
 <b> npm install </b>
</pre>

## Start dependency system from app.ts ##

 - Fisrt game template is Platformer.
     
## Main dependency file ##

```typescript
/** Import css */
require("./styles/styles.css");
require("./styles/favicon.ico");
require("./styles/android-icon.png");

import Platformer from "./examples/platformer/platformer";
import Ioc from "./libs/ioc";

const master = new Ioc();
master.singlton(Platformer, master.get.Starter);
```

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
