
const fs = require("fs");
const shared = require("./../common/shared");
const static = require('node-static');
const CryptoHandler = require("../common/crypto");
var file = new (static.Server)('/var/www/html/apps/visual-ts/basket-ball-chat/');

/**
 * @description Because nature of webRTC in new version
 * of modern browsers we also need `https` for localhost
 * running configuration(because broadcaster and coordinator).
 * Nature of Connector is `WebSocketServer` context.
 * This is little different between Broadcaster and Conector.
 * Checker added besed on `serverMode` from server config.
 * @name Connector
 * Session Controller
 * Based on native webSocket server/client.
 * Supported with mongoDB database platform.
 * @Note `ca` will be disabled for localhost.
 */
class Connector {

  constructor(serverConfig) {

    this.userSockCollection = {};
    this.config = serverConfig;
    this.http = null;
    this.crypto = new CryptoHandler();

    if (!serverConfig.isSecure) {

      let options = {
        key: fs.readFileSync(serverConfig.certPathSelf.pKeyPath),
        cert: fs.readFileSync(serverConfig.certPathSelf.pCertPath),
        ca: fs.readFileSync(serverConfig.certPathSelf.pCBPath),
      };

      this.http = require(this.config.getProtocol).createServer(options, function(request, response) {
        request.addListener('end', function() {
          if (request.url.search(/.png|.gif|.js|.css/g) == -1) {
            response.statusCode = 200;
            response.write('Please use https protocol for local also for production.');
            return response.end();
          } else file.serve(request, response);
        }).resume();
      }).listen(serverConfig.getConnectorPort);

    } else {

      let options = {};

      if (serverConfig.serverMode === 'dev') {
        options = {
          key: fs.readFileSync(serverConfig.certPathSelf.pKeyPath),
          cert: fs.readFileSync(serverConfig.certPathSelf.pCertPath),
          ca: fs.readFileSync(serverConfig.certPathSelf.pCBPath),
        };
      } else if (serverConfig.serverMode === 'prod') {
        options = {
          key: fs.readFileSync(serverConfig.certPathProd.pKeyPath),
          cert: fs.readFileSync(serverConfig.certPathProd.pCertPath),
          ca: fs.readFileSync(serverConfig.certPathProd.pCBPath),
        };
      } else {
        console.warn('Something wrong with serverConfig certPathProd/certPathSelf path.')
      }

      this.http = require('https').createServer(options, function(request, response) {

        /**
         * @interest
         * This work on chrome in https://localhost
         * but not in firefox. Need fix min > SHA-1 cert policy.
         */
        response.setHeader('Access-Control-Allow-Origin', '*');
        response.setHeader('Access-Control-Request-Method', '*');
        response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS, GET, PUT');
        response.setHeader('Access-Control-Allow-Headers', '*');

        request.addListener('end', function() {
          if (request.url.search(/.png|.gif|.js|.css/g) == -1) {
            response.statusCode = 200;
            let msgForHttpCheck = '**********************************************************' + ' \n' +
                                  '* VisualTS Game Engine Server composition, version: ' + serverConfig.version + '* \n' + 
                                  '* Type of network - CONNECTOR                            *' + ' \n' +
                                  '**********************************************************';
            response.write(msgForHttpCheck);
            return response.end();
          } else file.serve(request, response);
        }).resume();
      }).listen(serverConfig.getConnectorPort);
    }

    /**
     * Create main webSocket object
     */
    let WebSocketServer = require("websocket").server;
    this.wSocket = new WebSocketServer({
      httpServer: this.http,
      autoAcceptConnections: false,
      keepalive: true,
      keepaliveGracePeriod: 10000,
      keepaliveInterval: 20000,
    }).on("request", this.onRequestConn);
    WebSocketServer = null;

    if (this.config.IsDatabaseActive) {

      let MyDatabase = require("../database/database");
      /*
      let dataServeModules = [];
      this.config.dataServeRoutes.forEach(function(path) {
        let myDataAccess = require(path);
        dataServeModules.push(myDataAccess);
      });
      */
      this.database = new MyDatabase(this.config);
      MyDatabase = null;

    }

    shared.myBase = this;
    shared.serverHandlerRegister = this.serverHandlerRegister;
    shared.serverHandlerRegValidation = this.serverHandlerRegValidation;
    shared.serverHandlerLoginValidation = this.serverHandlerLoginValidation;
    shared.serverHandlerGetUserData = this.serverHandlerGetUserData;
    shared.serverHandlerSetNewNickname = this.serverHandlerSetNewNickname;
    shared.serverHandlerFastLogin = this.serverHandlerFastLogin;
    shared.serverHandlerGamePlayStart = this.serverHandlerGamePlayStart;
    shared.serverHandlerSessionLogOut = this.serverHandlerSessionLogOut;
    shared.serverHandlerOutOfGame = this.serverHandlerOutOfGame;

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

            /**
             * Passed simple string is not my case
             * Use for some custom non secure data flow.
             */
            console.log("ignore, this is just welcome message : " + msgFromCLient.data);
            this.send(JSON.stringify({ action: "ignore", data: "Welcome here !" }));

          } else {

            /**
             * Network Actions parsed here:
             */
            if (msgFromCLient.action) {

              if (msgFromCLient.action === "REGISTER") {
                const userId = shared.formatUserKeyLiteral(msgFromCLient.data.userRegData.email);
                shared.myBase.userSockCollection[userId] = this;
                msgFromCLient.data.socketId = userId;
                console.log(msgFromCLient.data.socketId + ":::msgFromCLient.data.socketId");
                shared.serverHandlerRegister(msgFromCLient);
              } else if (msgFromCLient.action === "REG_VALIDATE") {
                shared.serverHandlerRegValidation(msgFromCLient);
              } else if (msgFromCLient.action === "LOGIN") {
                const userId = shared.formatUserKeyLiteral(msgFromCLient.data.userLoginData.email);
                shared.myBase.userSockCollection[userId] = this;
                shared.serverHandlerLoginValidation(msgFromCLient);
              } else if (msgFromCLient.action === "GET_USER_DATA") {
                shared.serverHandlerGetUserData(msgFromCLient);
              } else if (msgFromCLient.action === "NEW_NICKNAME") {
                shared.serverHandlerSetNewNickname(msgFromCLient);
              } else if (msgFromCLient.action === "FLOGIN") {
                const userId = shared.formatUserKeyLiteral(msgFromCLient.data.userLoginData.email);
                shared.myBase.userSockCollection[userId] = this;
                shared.serverHandlerFastLogin(msgFromCLient);
              } else if (msgFromCLient.action === "GAMEPLAY_START") {
                shared.serverHandlerGamePlayStart(msgFromCLient);
              } else if (msgFromCLient.action === "LOG_OUT") {

                shared.serverHandlerSessionLogOut(msgFromCLient);
                // shared.serverHandlerOutOfGame(msgFromCLient);

              } else if (msgFromCLient.action === "OUT_OF_GAME") {
                shared.serverHandlerOutOfGame(msgFromCLient);
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

    console.log("onRequestConn constructed.")
  }

  serverHandlerRegister(regTest) {

    // validate
    if (regTest.data.userRegData) {
      if (shared.validateEmail(regTest.data.userRegData.email) === null) {
        shared.myBase.database.register(regTest.data, shared.myBase);
      }
    }

  }

  onRegisterResponse(result, userEmail, uniq, socketId, callerInstance) {

    let connection;
    let userId = shared.formatUserKeyLiteral(userEmail);
    console.log("onRegisterResponse : " + result + ". For user: " + userEmail);
    if (result == "USER_REGISTERED") {

      let emailRegBody = require("../email/templates/confirmation.html").getConfirmationEmail;
      let contentRegBody = emailRegBody(uniq, userEmail);

      try {
        connection = require("../email/mail-service")
          (userEmail, "USER_REGISTERED", contentRegBody).SEND(userEmail);
      } catch (error) {
        console.warn("Connector error in sending reg email!", error);
        let codeSended = { action: "ERROR_EMAIL", data: { errMsg: "Please check your email again!, Something wrong with current email!" } };
        codeSended = JSON.stringify(codeSended);
        callerInstance.userSockCollection[socketId].send(codeSended);
        console.log("Email reg error. Notify client.");
      } finally {
        connection.then(function(data) {
          let codeSended = {
            action: "CHECK_EMAIL", data: {
              accessToken: socketId,
              text: "Please check your email to get verification code. Paste code here :"
            }
          };
          codeSended = JSON.stringify(codeSended);
          callerInstance.userSockCollection[socketId].send(codeSended);
          console.log("Email reg sended. Notify client.");
        });
      }

    } else {
      // handle this...
      console.warn("Something wrong with your email. Result is : ", result);
      let msg = { action: "ERROR_EMAIL", data: { errMsg: "ERR: USER ALREADY REGISTERED" } };
      msg = JSON.stringify(msg);
      callerInstance.userSockCollection[socketId].send(msg);
      console.log("Email reg error. Notify client.");
    }

  }

  serverHandlerRegValidation(register) {

    if (register.data.userRegToken && register.data.email) {
      const user = { email: register.data.email, token: register.data.userRegToken, accessToken: register.data.accessToken };
      shared.myBase.database.regValidator(user, shared.myBase);
    }

  }

  onRegValidationResponse(result, userEmail, accessToken) {

    if (result == null) {
      let msg = { action: "ERROR_EMAIL", data: { errMsg: "ERR: WRONG CODE!" } };
      msg = JSON.stringify(msg);
      this.userSockCollection[accessToken].send(msg);
      console.log("onRegValidationResponse .", this);
    } else {
      // VERIFIED
      let msg = { action: "VERIFY_SUCCESS", data: { text: "VERIFY SUCCESS! PLEASE LOGIN " } };
      msg = JSON.stringify(msg);
      this.userSockCollection[accessToken].send(msg);
      console.log("onRegValidationResponse .", this);
    }

  }

  serverHandlerLoginValidation(login) {
    const user = { email: login.data.userLoginData.email, password: login.data.userLoginData.password };
    shared.myBase.database.loginUser(user, shared.myBase);
  }

  onUserLogin(user, callerInstance) {
    let userId = shared.formatUserKeyLiteral(user.email);
    try {
      let codeSended = { action: "ONLINE", data: { accessToken: userId, text: "Welcome to the game portal.", user } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
      console.warn("Online : ", user.email);
    } catch (err) {
      console.log("Something wrong with onUserLogin :: userSockCollection[userId]. Err :", err);
    }
  }

  serverHandlerGetUserData(user) {
    try {
      shared.myBase.database.getUserData(user, shared.myBase);
    } catch (err) {
      console.log("Connector.serverHandlerGetUserData error : ", err);
    }
  }

  onUserData(user, callerInstance) {
    try {
      let userId = shared.formatUserKeyLiteral(user.email);
      let codeSended = { action: "GET_USER_DATA", data: { user } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
    } catch (err) {
      console.log("Something wrong with onUserData :: userSockCollection[userId]. Err :", err);
    }
  }

  serverHandlerSetNewNickname(arg) {
    if (arg !== undefined) {
      console.log(arg);
      shared.myBase.database.setNewNickname(arg, shared.myBase);
    }
  }

  serverHandlerFastLogin(arg) {
    if (arg !== undefined) {
      console.log(arg);
      shared.myBase.database.fastLogin(arg, shared.myBase);
    }
  }

  onUserNewNickname(userData, callerInstance) {
    try {
      let userId = shared.formatUserKeyLiteral(userData.email);
      let codeSended = { action: "NICKNAME_UPDATED", data: { userData } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
    } catch (err) {
      console.log("Something wrong with :: userSockCollection[userId]. Err :", err);
    }
  }

  serverHandlerGamePlayStart(arg) {
    if (arg !== undefined) {
      console.log(arg.activeGame);
      shared.myBase.database.platformerActiveUsers.addActiveGamePlayer(arg, shared.myBase);
    }
  }

  serverHandlerSessionLogOut(arg) {
    if (arg !== undefined) {
      console.log(arg);
      shared.myBase.database.logOut(arg, shared.myBase);
    }
  }

  serverHandlerOutOfGame(arg) {
    if (arg !== undefined) {
      shared.myBase.database.platformerActiveUsers.removeActiveGamePlayer(arg, shared.myBase);
    }
  }

  onLogOutResponse(userData, callerInstance) {
    try {
      let userId = shared.formatUserKeyLiteral(userData.email);
      let codeSended = { action: "LOG_OUT", data: { userData } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
    } catch (err) {
      console.log("Something wrong with :: userSockCollection[userId]. Err :", err);
    }
  }

  onOutOfGameResponse(userData, callerInstance) {
    try {
      let userId = shared.formatUserKeyLiteral(userData.email);
      let codeSended = { action: "OUT_OF_GAME", data: { userData } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
    } catch (err) {
      console.log("Something wrong with :: userSockCollection[userId]. Err :", err);
    }
  }

  onGameStartResponse(userData, callerInstance) {
    try {
      let userId = shared.formatUserKeyLiteral(userData.email);
      let codeSended = { action: "GAMEPLAY_STARTED", data: { userData } };
      codeSended = JSON.stringify(codeSended);
      callerInstance.userSockCollection[userId].send(codeSended);
    } catch (err) {
      console.log("Something wrong with :: userSockCollection[userId]. Err :", err);
    }
  }

}
module.exports = Connector;
