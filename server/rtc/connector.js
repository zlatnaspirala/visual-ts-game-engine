/**
 * @description Session controller
 * based on native webSocket server/client.
 * Supported with mongoDB database platform.
 */
const shared = require("./../common/shared");

class Connector {

  constructor(serverConfig) {

    this.userSockCollection = {};
    this.config = serverConfig;
    this.http = require(this.config.getProtocol).createServer(function(request, response) {
      // Prevent with end here...
    }).listen(serverConfig.getConnectorPort);

    /**
     * Create main webSocket object
     */
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

    shared.myBase = this;
    shared.serverHandlerRegister = this.serverHandlerRegister;
    shared.serverHandlerRegValidation = this.serverHandlerRegValidation;

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
    let userSocket = socket.accept(null, origin);
    console.log("Controller session is up. resource tag is: ", socket.resource);

    /**
     * Server message event
     */
    userSocket.on("message", function(message) {

      if (message.type === "utf8") {

        try {

          let msgFromCLient = JSON.parse(message.utf8Data);
          console.warn("On message, utf8Data passed... ", msgFromCLient.data);

          if (typeof msgFromCLient.data === "string") {

            console.log("ignore this : " + msgFromCLient.data);
            this.send(JSON.stringify({ action: "ignore", data: "Welcome here !" }));

          } else {

            if (msgFromCLient.action) {

              if (msgFromCLient.action === "REGISTER") {
                const userId = shared.formatUserKeyLiteral(msgFromCLient.data.userRegData.email);
                shared.myBase.userSockCollection[userId] = this;
                shared.serverHandlerRegister(msgFromCLient);
              } else if (msgFromCLient.action === "REG_VALIDATE") {
                shared.serverHandlerRegValidation(msgFromCLient);
              }

            } else {
              console.warn("Object but not action in it.");
            }
          }
        } catch (err) {
          console.warn("On message : Message is simple string", err);
        }
      }

    });

    userSocket.on("close", function(e) {
      console.warn("Event: onClose");

    });

    userSocket.on("error", function(e) {
      console.warn("Event: error");
    });
    console.log("controller constructed.")
  }

  serverHandlerRegister(regTest) {

    // validate
    if (regTest.data.userRegData) {
      if (shared.validateEmail(regTest.data.userRegData.email) === null) {
        shared.myBase.database.register(regTest.data.userRegData, shared.myBase);
      }
    }

  }

  onRegisterResponse(result, userEmail, uniq, callerInstance) {

    // console.log("onRegisterResponse : " + result + ". For user: " + userEmail);
    if (result == "USER_REGISTERED") {

      let emailRegBody = require("../email/templates/confirmation.html").getConfirmationEmail;
      let contentRegBody = emailRegBody(uniq, userEmail);
      let connection;
      let userId = shared.formatUserKeyLiteral(userEmail);

      try {
        connection = require("../email/mail-service")
          ("zlatnaspirala@gmail.com", "USER_REGISTERED", contentRegBody).SEND();
      } catch (error) {
        console.warn("Connector error in sending reg email!", error);
        let codeSended = { action: "ERROR_EMAIL", data: { errMsg: "Please check your email again!, Something wrong with current email!" } };
        codeSended = JSON.stringify(codeSended);
        callerInstance.userSockCollection[userId].send(codeSended);
        console.log("Email reg error. Notify client.");
      } finally {
        connection.then(function(data) {
          let codeSended = { action: "CHECK_EMAIL", data: { text: "Please check your email to get verification code. Paste it here :" } };
          codeSended = JSON.stringify(codeSended);
          callerInstance.userSockCollection[userId].send(codeSended);
          console.log("Email reg has sended. Notifu client.");
        });
      }

    } else {
      // handle this...
      console.warn("Something wrong with your email. Result is : ", result);
    }

  }

  serverHandlerRegValidation(regTest) {

    if (regTest.data.userRegToken && regTest.data.email) {
      const user = { email: regTest.data.email, token: regTest.data.userRegToken };
      shared.myBase.database.regValidator(user, shared.myBase);
    }

  }

  onRegValidationResponse(arg1) {

    console.log("Nothing for now on server side - FINISH REG PROCESS FOR ", arg1);

  }
}
module.exports = Connector;
