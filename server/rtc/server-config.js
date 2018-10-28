
class ServerConfig {

  constructor() {

    console.log("TEST CONNEXCTOR");
    this.networkDeepLogs = false;
    this.rtcServerPort = 12034;
    this.domain = "192.168.0.14";
    this.masterServerKey = "multi-platformer-sever1.maximum";
    this.connectorPort = 1234;
    this.appUseAccountsSystem = true;
    this.isSecure = false;

  }

  get getRtcServerPort() {
    return this.rtcServerPort;
  }

  get getIsAppUseAccountsSystem() {
    return this.appUseAccountsSystem;
  }

  get getConnectorPort() {
    return this.connectorPort;
  }

  get getRemoteServerAddress() {
    return (this.isSecure ? "wss" : "ws") + "://" + this.domain + ":" + this.rtcServerPort + "/";
  }

  set getNetworkDeepLog(newState) {
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
