
class Connector {

  constructor(serverConfig) {

    this.config = serverConfig;

    let protocol = "";
    if (this.config.isSecure) {
      protocol = "https";
    } else {
      protocol = "http";
    }

    this.http = require(protocol).createServer(function(request, response) { }).listen(serverConfig.connectorPort);

    const WebSocketServer = require("websocket").server;

    this.wSocket = new WebSocketServer({
      httpServer: this.http,
      autoAcceptConnections: false,
    }).on("request", this.onRequestConn);

    console.log("controller constructed.")
  }

  sendMessage(message, websocket) {
    message.data = JSON.stringify(message.data);

    console.log(message, "SEND")

    if (!message) {
      console.error("no such channel exists");
      return;
    }

    try {
      websocket.sendUTF(message.data);
    } catch (e) {
      console.warn("Error", e);
    }

  }

  onRequestConn(socket) {

    const origin = socket.origin + socket.resource;
    const websocket = socket.accept(null, origin);

    websocket.on("message", function(message) {

      console.warn("onMessage?:", message);

      if (message.type === "utf8") {
        // this.sendMessage("good")
        try {
          let test = JSON.parse(message.utf8Data);
          console.warn("On message, utf8", test.data);
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

  }

}
module.exports = Connector;
