
class ServerConfig {

  constructor() {

    /**
     * Define backend staff
     */
    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.rtc3ServerPort = 9001;
    this.connectorPort = 1234;
    // this.domain = "maximumroulette.com";
    this.domain = "localhost";
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
    this.appUseVideoChat = true;
    this.databaseName = "masterdatabase";
    // this.databaseRoot = "mongodb://userAdmin:********@maximumroulette.com:27017/admin";
    this.databaseRoot = "mongodb://localhost:27017";

    this.specialRoute = {
      "default": "/var/www/html/applications/visual-typescript-game-engine/build/app.html"
    };

    // this.dataServeRoutes = ["../data-serve/platformer/class/activeplayers"];

    console.log("Server running under configuration: ");
    console.log("-rtc domain", this.domain);
    console.log("-rtc masterServerKey", this.masterServerKey);
    console.log("-rtc rtcServerPort", this.rtcServerPort);
    console.log("-rtc rtc3ServerPort", this.rtc3ServerPort);
    console.log("-rtc connectorPort", this.connectorPort);
    console.log("-rtc protocol", this.protocol);
    console.log("-rtc isSecure", this.isSecure);
    console.log("-rtc appUseAccountsSystem", this.appUseAccountsSystem);
    console.log("-rtc databaseName", this.databaseName);
    // console.log("-rtc databaseRoot", this.databaseRoot);

  }

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
    return this.databaseRoot;
  }

  get IsDatabaseActive() {
    return this.appUseAccountsSystem;
  }

  get getConnectorPort() {
    return this.connectorPort;
  }

  get getRemoteServerAddress() {
    return (this.isSecure ? "wss" : "ws") + "://" + this.domain + ":" + this.rtcServerPort + "/";
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
