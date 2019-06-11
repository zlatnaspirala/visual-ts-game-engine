
class ServerConfig {

  constructor() {

    /**
     * Define backend staff
     */
    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.rtc3ServerPort = 9001;
    this.connectorPort = 1234;
    this.domain = "localhost";
    this.masterServerKey = "multi-platformer-sever1.maximum";
    this.protocol = "http";
    this.isSecure = false;
    this.appUseAccountsSystem = true;
    this.appUseVideoChat = true;
    this.databaseName = "masterdatabase";
    this.databaseRoot = "mongodb://localhost:27017";

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
    console.log("-rtc databaseRoot", this.databaseRoot);

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
