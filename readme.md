#To make all dependency works in build proccess we need some plugins.

<code>
  npm install
</code>

## Start dependency system from app.ts

Fisrt game template is Platformer.

In progress...
## Main dependency file ##

```c#
/** Import css */
require("./styles/styles.css");
require("./styles/favicon.ico");
require("./styles/android-icon.png");

import Platformer from "./examples/platformer/platformer";
import Ioc from "./libs/ioc";

const master = new Ioc();
master.singlton(Platformer, master.get.Starter);
```

# Fix code format : #

```
tslint -c tslint.json 'src/**/*.ts' --fix
```