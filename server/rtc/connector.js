/**
 * @description Session controller
 * based on native webSocket server/client.
 * Supported with mongoDB database platform.
 */
const shared = require("./../common/shared");

class Connector {

  constructor(serverConfig) {

    this.config = serverConfig;
    this.http = require(this.config.getProtocol).createServer(function(request, response) { }).listen(serverConfig.getConnectorPort);
    let WebSocketServer = require("websocket").server;
    this.wSocket = new WebSocketServer({
      httpServer: this.http,
      autoAcceptConnections: false,
    }).on("request", this.onRequestConn);
    WebSocketServer = null;

    if (this.config.IsDatabaseActive) {

      let MyDatabase = require("../database/database");
      this.database = new MyDatabase(this.config);
      MyDatabase = null;

    }

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

    const root = this;
    const origin = socket.origin + socket.resource;
    const websocket = socket.accept(null, origin);

    console.log("Controller session is up. resource tag is: ", socket.resource);

    /**
     * Server message event
     */
    websocket.on("message", function(message) {

      // console.warn("onMessage?:", message);
      /*if (typeof message.utf8Data === "string") {
        console.warn("Received message is type of string.");
      }*/

      if (message.type === "utf8") {

        try {

          let test = JSON.parse(message.utf8Data);
          console.warn("On message, utf8Data parsed : ", test.data);
          shared.whatIs(test);
          this.send(JSON.stringify({ data: "Welcome here !" }));

        } catch (err) {

          console.warn("On message : Message is simple string", err);
        }
      }

    });

    websocket.on("close", function(e) {
      console.warn("Event: onClose");

    });

    websocket.on("error", function(e) {
      console.warn("Event: error");
    });
    console.log("controller constructed.")
  }

  serverHandlerRegister(regTest) {

    console.log("WHAT IS!!!!! :", test)
    // validate
    if (regTest.action === "REGISTER") {

      if (regTest.userRegData) {
        if (shared.validateEmail(regTest.userRegData.email) === null) {
          this.database.register(regTest.userRegData);
          console.log("EMAIL VALID");
        }
      }

    }
    // this.database.register()

  }

}
module.exports = Connector;
