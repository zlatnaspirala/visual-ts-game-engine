# Project : Visual ts #
## Version : new era - 2018/2019 ##

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

```c#
tslint -c tslint.json 'src/**/*.ts' --fix
```
