
class ServerConfig {

  constructor() {

    /**
     * Define backend staff
     * 
     * @version 0.2.0 WIP
     * Implementing multiRTC3 for data streaming operation
     */
    this.version = "0.2.0";

     // enum : 'dev', 'prod', `mongodb.net` or `mongodb.net-dev`
    // this.serverMode = "mongodb.net";
    this.serverMode = "mongodb.net-dev";

    this.ownHosting = false;
    this.ownHttpHostPort = 443;
    this.ownHostingVirtualHostsEnabled = false;
    this.ownHostingVirtualHosts = [
      {
        dir: "/var/www/html/apps/ultimate-roulette/",
        name: "roulette.maximumroulette.com"
      },
      {
        dir: "/var/www/html/apps/barbarian-road-mashines/beta/",
        name: "rocketcraft.maximumroulette.com"
      }
    ];

    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.rtc3ServerPort = 9001;
    this.connectorPort = 9010;

    /**
     * @description
     * Represent prop for many handling in aspect of 
     * what is actual ServerMode.
     * It's simple and nice solution, we never n
     */
    this.domain = {
      dev: "localhost",
      prod: "maximumroulette.com"
    };

    /**
     * @description
     * Represent Public Channel, webrtc session name.
     * Interest prop for manipulation.
     * This can be upgraded to the Object type.
     */
    this.masterServerKey = "multi-platformer-sever1.maximum";

    /**
     * @description
     * Strongly recommended https for local also for production
     */
    this.protocol = "https";

    this.isSecure = false;

    /**
     * @description
     * Just for help if needed if you wanna use pem.
     * No pem currently used at the moment.
     */
    this.certPathSelfOrigin = {
      pKeyPath:  "./rtc/apache-local-cert/server.key",
      pCertPath: "./rtc/apache-local-cert/server.crt",
      pCBPath:   "./rtc/apache-local-cert/server.csr",
    };

    /**
     * @description
     * Just for help if needed.
     */
    this.certPathSelf = {
      pKeyPath: "./server/rtc/apache-local-cert/server.key",
      pCertPath: "./server/rtc/apache-local-cert/server.crt",
      pCBPath: "./server/rtc/apache-local-cert/server.csr",
    };

    // production
    this.certPathProd = {
      pKeyPath: "/etc/letsencrypt/live/maximumroulette.com/privkey.pem",
      pCertPath: "/etc/letsencrypt/live/maximumroulette.com/cert.pem",
      pCBPath: "/etc/letsencrypt/live/maximumroulette.com/fullchain.pem"
    };

    this.appUseAccountsSystem = true;
    this.appUseBroadcaster = true;
    this.databaseName = "masterdatabase";

    this.databaseRoot = {
      dev: "mongodb://localhost:27017" ,
      prod: "mongodb://userAdmin:*************@localhost:27017/admin",
      freeService: "mongodb+srv://userAdmin:s_JmRVjxWh5JsqC@cluster0.piqav.mongodb.net/masterdatabase?retryWrites=true&w=majority"
    };

    this.specialRoute = {
      "default": "/var/www/html/applications/visual-typescript-game-engine/last-build/multiplayer"
    };

    // this.dataServeRoutes = ["../data-serve/platformer/class/activeplayers"];

    console.log("Server running under configuration => ", this.serverMode);

    if (this.serverMode == "dev") {
      console.log("-rtc domain dev", this.domain.dev);
    } else if (this.serverMode == "prod") {
      console.log("-rtc domain prod", this.domain.prod);
    }

    console.log("-rtc masterServerKey", this.masterServerKey);
    console.log("-rtc rtcServerPort", this.rtcServerPort);
    console.log("-rtc rtc3/broadcaster is enabled", this.appUseBroadcaster);
    console.log("-rtc rtc3ServerPort", this.rtc3ServerPort);
    console.log("-rtc connectorPort", this.connectorPort);
    console.log("-rtc protocol", this.protocol);
    console.log("-rtc isSecure", this.isSecure);
    console.log("-rtc appUseAccountsSystem", this.appUseAccountsSystem);
    console.log("-rtc databaseName", this.databaseName);

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
    } else if (this.serverMode === "mongodb.net" || this.serverMode === "mongodb.net-dev") {
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
    } else if (this.serverMode == "mongodb.net" || this.serverMode === "mongodb.net-dev") {
      return this.databaseRoot.freeService;
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
    } else if (this.serverMode == "mongodb.net") {
      return (this.isSecure ? "wss" : "ws") + "://" + this.domain.prod + ":" + this.rtcServerPort + "/";
    } else if (this.serverMode == "mongodb.net-dev") {
      return (this.isSecure ? "wss" : "ws") + "://" + this.domain.dev + ":" + this.rtcServerPort + "/";
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
