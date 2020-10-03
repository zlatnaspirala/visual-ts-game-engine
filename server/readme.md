
### Prepare server for running: ###

javascript
```
npm install
```

  Fix and report if something missing in dependency if there's a msg like
  'missinig module'.

### Run data/media server based on MultiRTC2.2 vs socket.io : ###

Run this command from root project folder:
javascript
```
npm run rtc
```

 or use :

```
  node ./server/rtc/server.js
```
<pre>
  You can use this server also for video-chat it is already implemented but it is no recommended for latest version of modern browser's.For UTF networking it is ok.
  It is still better to use 'npm run broadcaster' for video chat. I use this server
  for data communication and session staff also any other use...
</pre>

### Run data/media server based on MultiRTC3 PTP: ###

  For now broadcaster use 'server\broadcaster-config.json' for input data.

#### For switching dev(localhost) / prod(public server) use => ####

 localhost running:
 ```
     "isSecure": "false",
 ```

Production server running:
 You need to implement your own certs files/paths.
```
    "isSecure": "true",
```

Config file is json file.

```
{
  "socketURL": "http://maximumroulette.com:9001/",
  "dirPath": "",
  "homePage": "https://maximumroulette.com/applications/visual-typescript-game-engine/basket-ball-chat/app.html",
  "socketMessageEvent": "RTCMultiConnection-Message",
  "socketCustomEvent": "RTCMultiConnection-Custom-Message",
  "port": "9001",
  "enableLogs": "false",
  "autoRebootServerOnFailure": "false",
  "isUseHTTPs": "true",
  "isSecure": "false",
  "sslKey": "/etc/httpd/conf/ssl/maximumroulette.com.key",
  "sslCert": "/etc/httpd/conf/ssl/maximumroulette_com.crt",
  "sslCabundle": "/etc/httpd/conf/ssl/maximumroulette.ca-bundle",
  "sslKeyLocahost": "server/rtc/self-cert/privatekey.pem",
  "sslCertLocahost": "server/rtc/self-cert/certificate.pem",
  "enableAdmin": "false",
  "adminUserName": "username",
  "adminPassword": "password"
}
```
<pre>
 Most important fields are:

For dev:
   - socketURL => http://localhost:9001/
   - isSecure => false

For prodc:
  - socketURL => http://YOUR_DOMAIN:9001/
  - isSecure => true
</pre>

Features comes with broadcaster:
<pre>
 - Multiplatform video chat works with other hybrid frameworks or custom implementation throw the native
   mobile application web control (Chrome implementation usually).
 - Chat in real time, share files with minimum server usage.
 - Implemented dragable video containers with addons script.
</pre>

```javascript
  npm run broadcaster
```

### Install MongoDB follow link: ###

 [Install mongoDB](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-centos-7)

  If you wanna deploy database & server code on same host (without chanse for remote connection)
then use next setup:

For dev:
javascript
```
  this.databaseRoot = "mongodb://localhost:27017";
```

For prod:
javascript
```
  this.databaseRoot = "mongodb://YOUR_DOMAIN:27017";
```

 Must be in samo folder or input full path to the data folder.
 Run :

javascript
```
  mongod --dbpath data
```

  - Deploy mongo on public server looks like:

First action is setup serverMode to 'prod'. In server-config.js file.

javascript
```
  this.databaseRoot = "mongodb://DOMAIN:27017";

  or

  this.databaseRoot = "mongodb://IPADDRESS:27017";
```

javascript
```
  mongod --dbpath data --bind_ip <IPADDRESS>
```

 or

javascript
```
  mongod --dbpath data --bind_ip <DOMAIN>
```

 After running database mongo service you can use :

```
  mongo --host maximumroulette.com:27017
```

 to connect with mongo terminal.

  Basic commands :

```
   show dbs

   use <database_name>

   db.dropDatabase()

```

 Adding password :

 Start mongod normally.

 Attach mongo console :

```
  mongo --host maximumroulette.com --port 27017
```
 Then exec this :

```
use admin
 db.createUser({
   user: "userAdmin",
   pwd: "**********",
   roles: [ { role: "userAdminAnyDatabase", db: "admin"}, "readWriteAnyDatabase"]})

   db.createUser({ user: "userAdmin", pwd: "*********", roles: [ { role: "userAdminAnyDatabase", db: "admin"}, "readWriteAnyDatabase"]})
```

Stop/Restart mongod with :

```bash
sudo service mongod stop
mongod --auth --dbpath database/data --bind_ip maximumroulette.com
```

### Next attach will be :

```
 mongo --host maximumroulette.com --port 27017 -u "userAdmin" --authenticationDatabase "admin" -p
```

### Command for mongod from cmd:

```js

  show dbs

  use <database-name>

  // show collections

  db.getCollectionNames()

  db.<collection-name>.find()

  db.getCollectionNames().forEach(function(x) {db[x].drop()})

  db.platformer.find()

  db.platformer.find().pretty()

```

### Source :

https://docs.mongodb.com/manual/tutorial/enable-authentication/


Config file - server-config:

```

class ServerConfig {

  constructor() {

    /**
     * Define backend staff
     */

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

    // this.dataServeRoutes = ["../data-serve/platformer/class/activeplayers"];

    console.log("Server running under configuration => ", this.serverMode);

    if (this.serverMode == "dev") {
      console.log("-rtc domain dev", this.domain.dev);
    } else if (this.serverMode == "prod") {
      console.log("-rtc domain prod", this.domain.prod);
    }

  }

  /**
   * @returns {any}
   */
  get getAppUseBroadcaster() {
    return this.appUseBroadcaster;
  };

  get getProtocol() {

    if (this.isSecure) {
      this.protocol = "https";
    } else {
      this.protocol = "http";
    }
    return this.protocol;
  }

  get getRtcServerPort() {
    return this.rtcServerPort;
  }

  get getRtc3ServerPort() {
    return this.rtc3ServerPort;
  }

  get getDatabaseRoot() {

    if (this.serverMode == "dev") {
      return this.databaseRoot.dev;
    } else if (this.serverMode == "prod") {
      return this.databaseRoot.prod;
    }

  }

  get IsDatabaseActive() {
    return this.appUseAccountsSystem;
  }

  get getConnectorPort() {
    return this.connectorPort;
  }

  get getRemoteServerAddress() {

    if (this.serverMode == "dev") {
      return (this.isSecure ? "wss" : "ws") + "://" + this.domain.dev + ":" + this.rtcServerPort + "/";
    } else if (this.serverMode == "prod") {
    return (this.isSecure ? "wss" : "ws") + "://" + this.domain.prod + ":" + this.rtcServerPort + "/";
    }

  }

  set setNetworkDeepLog(newState) {
    this.networkDeepLogs = newState;
  }

  get getNetworkDeepLog() {
    return this.networkDeepLogs;
  }

  get getMasterServerKey() {
    return this.masterServerKey;
  }

}
module.exports = ServerConfig;

```

