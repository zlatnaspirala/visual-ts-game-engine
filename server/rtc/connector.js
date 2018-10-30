/**
 * @description Session controller
 * based on native webSocket server/client.
 * Supported with mongoDB database platform.
 */
const shared = require("./../common/shared");

class Connector {

  constructor(serverConfig) {

    const self = this;

    this.config = serverConfig;
    this.http = require(this.config.getProtocol).createServer(function(request, response) { }).listen(serverConfig.getConnectorPort);
    let WebSocketServer = require("websocket").server;
    this.wSocket = new WebSocketServer({
      httpServer: this.http,
      autoAcceptConnections: false,
    }).on("request", this.onRequestConn);
    WebSocketServer = null;

    this.wSocket.myRoot = root;

    if (this.config.IsDatabaseActive) {

      let MyDatabase = require("../database/database");
      this.database = new MyDatabase(this.config);
      MyDatabase = null;

    }

    shared.myBase = this;
    shared.regHandler = this.serverHandlerRegister;

  }

  sendData(message, websocket) {

    if (message instanceof String) {
      console.error("Connector.sendData : Message can't be type of string.", message);
      return;
    }

    message.data = JSON.stringify(message.data);

    if (!message) {
      console.error("message no exists!");
      return;
    }

    try {
      websocket.sendUTF(message.data);
    } catch (err) {
      console.error("Error in Connector.sendData", err);
    }

  }

  onRequestConn(socket) {

    const origin = socket.origin + socket.resource;
    this.wSocket = socket.accept(null, origin);

    console.log("Controller session is up. resource tag is: ", socket.resource);

    /**
     * Server message event
     */
    this.wSocket.on("message", function(message) {

      // console.warn("onMessage?:", message);
      /*if (typeof message.utf8Data === "string") {
        console.warn("Received message is type of string.");
      }*/

      if (message.type === "utf8") {

        try {

          let test = JSON.parse(message.utf8Data);
          console.warn("On message, utf8Data parsed : ", test.data);

          if (typeof test.data === "string") {
            console.log("test.data : " + test.data);

            this.send(JSON.stringify({ data: "Welcome here !" }));

          } else {

            if (test.data.action) {

              if (test.data.action === "REGISTER") {
                shared.regHandler(test.data);
              }

            } else {
              console.log("Object but not action in it.");
            }
          }




        } catch (err) {

          console.warn("On message : Message is simple string", err);
        }
      }

    });

    this.wSocket.on("close", function(e) {
      console.warn("Event: onClose");

    });

    this.wSocket.on("error", function(e) {
      console.warn("Event: error");
    });
    console.log("controller constructed.")
  }

  serverHandlerRegister(regTest) {

    // validate
    if (regTest.action === "REGISTER") {
      if (regTest.userRegData) {
        if (shared.validateEmail(regTest.userRegData.email) === null) {

          let test2 = shared.myBase.database.register(regTest.userRegData, shared.myBase);
          console.log(test2)

        }
      }
    }

  }

  onRegisterResponse(result) {

    console.log("onRegisterResponse" + result);
    if (result == "USER_REGISTERED") {
      let nik = require("../email/nocommit")("zlatnaspirala@gmail.com", "USER_REGISTERED", "USER_REGISTERED");
      console.log("test", nik);
    }

  }

}
module.exports = Connector;
