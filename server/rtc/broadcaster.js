const shared = require("./../common/shared");

class Broadcaster {
  constructor(serverConfig) {
    const fs = require("fs");
    // const path = require("path");
    // const url = require("url");
    const ioServer = require("socket.io");
    const RTCMultiConnectionServer = require("rtcmulticonnection-server");
    var httpServer = null;

    // Direct input flags
    var PORT = 9001;

    const jsonPath = {
      config: "./server/broadcaster-config.json",
      logs: "logs.json",
    };

    const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
    const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
    const getBashParameters = RTCMultiConnectionServer.getBashParameters;
    var config = getValuesFromConfigJson(jsonPath);
    config = getBashParameters(config, BASH_COLORS_HELPER);

    // if user didn't modifed "PORT" object
    if(PORT === 9001) {
      PORT = config.port;
    }

    function serverHandler(request, response) {
      console.log("+serverHandler+");
      var headers = {};
      headers["Access-Control-Allow-Origin"] = "*";
      headers["Access-Control-Allow-Headers"] =
        "Content-Type, Content-Length, Authorization, Accept, X-Requested-With";
      headers["Access-Contrl-Allow-Methods"] =
        "PUT, POST, GET, DELETE, OPTIONS";
      headers["Access-Control-Max-Age"] = "86400";
      response.writeHead(200, headers);

      if(request.method === "OPTIONS") {
        console.log("OPTIONS SUCCESS");
        response.end();
      } else {
        response.writeHead(200, {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers": "*",
        });
        let msgForHttpCheck = '**********************************************************' + ' \n' +
          '* VisualTS Game Engine Server composition, version: ' + serverConfig.version + '* \n' +
          '* Type of network - BROADCASTER                          *' + ' \n' +
          '* Powerfull tool for real time applications.                                  *' + ' \n' +
          '* Source code: https://github.com/zlatnaspirala/visual-ts-game-engine         *' + ' \n' +
          '**********************************************************';
        response.write(msgForHttpCheck);
        response.end();
      }
    }

    var httpApp;
    httpServer = require("https");

    var options = {
      key: null,
      cert: null,
      ca: null,
    };

    /**
     * @description This block can be optimisex
     * SSL on/off
     */
    if(serverConfig.serverMode === "dev" || serverConfig.serverMode === "mongodb.net-dev") {
      options = {
        key: fs.readFileSync(serverConfig.certPathSelf.pKeyPath),
        cert: fs.readFileSync(serverConfig.certPathSelf.pCertPath),
        ca: fs.readFileSync(serverConfig.certPathSelf.pCBPath),
      };
    } else if(serverConfig.serverMode === "prod" || serverConfig.serverMode === "mongodb.net") {
      options = {
        key: fs.readFileSync(serverConfig.certPathProd.pKeyPath),
        cert: fs.readFileSync(serverConfig.certPathProd.pCertPath),
        ca: fs.readFileSync(serverConfig.certPathProd.pCBPath),
      };
    } else {
      console.warn(
        "Something wrong with serverConfig certPathProd/certPathSelf path."
      );
    }

    // var pfx = false;
    httpApp = httpServer.createServer(options, serverHandler);
    RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
    httpApp = httpApp.listen(
      process.env.PORT || PORT,
      process.env.IP || "0.0.0.0",
      function() {
        RTCMultiConnectionServer.afterHttpListen(httpApp, config);
      }
    );

    // var collectCorsDomain = "https://maximumroulette.com";
    var collectCorsDomain = config.homePage;
    console.log("-rtc cors collectCorsDomain : ", collectCorsDomain);

    if(serverConfig.serverMode == "dev" || this.serverMode == "mongodb.net-dev") {
      console.log("-rtc cors dev: ", serverConfig.domain.dev);
    } else if(serverConfig.serverMode == "prod" || serverConfig.serverMode == "mongodb.net") {
      console.log("-rtc cors prod: ", serverConfig.domain.prod);
      collectCorsDomain = serverConfig.protocol + "://" + serverConfig.domain.prod;
    }

    console.log("Cors Domain [extra data]: ", collectCorsDomain);
    var myBroadcaster = ioServer(httpApp, {
      cors: {
        origin: collectCorsDomain,
        methods: ["GET", "POST", "OPTIONS", "*"],
        allowedHeaders: ["*"],
        credentials: true,
      },
    })

    myBroadcaster.on("connection", function(socket) {
      console.log("MultiRTC3: new client.");
      RTCMultiConnectionServer.addSocket(socket, config);

      const params = socket.handshake.query;

      if(!params.socketCustomEvent) {
        params.socketCustomEvent = "custom-message";
      }

      socket.on(params.socketCustomEvent, function(message) {
        socket.broadcast.emit(params.socketCustomEvent, message);
      });

      socket.on("disconnect", (e) => {
        console.log("Broadcaster sock disconnection under: ", e);
      })
    });

    // Save it - no use for now
    this.myBroadcaster = myBroadcaster;
    console.log("Good luck.");
  }
}
module.exports = Broadcaster;
