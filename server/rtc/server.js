/**
 * @description Networking
 * visual-ts game engine server part
 */
const static = require("node-static");
const fs = require("fs");
const ServerConfig = require("../server-config.js");
const Connector = require("./connector.js");
const serverConfig = new ServerConfig();
const sessionController = new Connector(serverConfig);
const CHANNELS = {};
const WebSocketServer = require("websocket").server;
const {server} = require("websocket");
var file = new static.Server(
  "/var/www/html/applications/visual-ts/basket-ball-chat/"
);
let broadcaster = null;
let httpRtc = null;

/**
 * @description
 * Just a hosting option.
 * If you wanna host you app with node.js
 * use serverConfig.ownHosting = true | false
 */
if (serverConfig.ownHosting == true) {
  var express = require("express");
  const cors = require("cors");
  var https = require("https");
  var hostingHTTP = express();

  var options = {
    key: fs.readFileSync(
      "/etc/letsencrypt/live/maximumroulette.com/privkey.pem"
    ),
    cert: fs.readFileSync(
      "/etc/letsencrypt/live/maximumroulette.com/fullchain.pem"
    ),
  };

  vhost = require("vhost");
  routerSub = express.Router();
  routerSub.use(express.static("/var/www/html/apps/ultimate-roulette/"));

  routerSub2 = express.Router();
  routerSub2.use(
    express.static("/var/www/html/apps/barbarian-road-mashines/beta/")
  );

  hostingHTTP.get("*", function (req, res, next) {
    next();
  });

  hostingHTTP.use(vhost("roulette.maximumroulette.com", routerSub));
  hostingHTTP.use(vhost("rocketcraft.maximumroulette.com", routerSub2));
  hostingHTTP.use(express.static("/var/www/html/"));

  // Compress all HTTP responses
  // hostingHTTP.use(compression());
  hostingHTTP.use(cors());

  hostingHTTP.use(function (req, res, next) {
    // res.setHeader("Content-Type", "text/html")
    res.setHeader("Content-Encoding", "gzip");
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Request methods you wish to allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "*");
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", false);
    // Pass to next layer of middleware
    next();
  });

  https
    .createServer(options, hostingHTTP)
    .listen(serverConfig.ownHttpHostPort, error => {
      if (error) {
        console.warn("Something wrong with rocket-craft own host server.");
        console.error(error);
        return process.exit(1);
      } else {
        console.log(
          "Rocket helper unsecured host started at " +
            serverConfig.ownHttpHostPort +
            " port."
        );
      }
    });
}

if (serverConfig.appUseBroadcaster) {
  var Broadcaster = null;
  Broadcaster = require("./broadcaster");
  broadcaster = new Broadcaster(serverConfig);
  console.log("Running broadcaster...");
}

if (serverConfig.getProtocol == "http") {
  httpRtc = require(serverConfig.getProtocol)
    .createServer(function (request, response) {
      /**
       * SSL off
       */
      request
        .addListener("end", function () {
          if (request.url.search(/.png|.gif|.js|.css/g) == -1) {
            response.statusCode = 200;
            response.write("No access on this way man.");
            return response.end();
          } else file.serve(request, response);
        })
        .resume();
    })
    .listen(serverConfig.getRtcServerPort);
} else {
  /**
   * @description This block can be optimisex
   * SSL on/off
   */
  if (serverConfig.serverMode === "dev") {
    options = {
      key: fs.readFileSync(serverConfig.certPathSelf.pKeyPath),
      cert: fs.readFileSync(serverConfig.certPathSelf.pCertPath),
      ca: fs.readFileSync(serverConfig.certPathSelf.pCBPath),
    };
  } else if (serverConfig.serverMode === "prod") {
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

  httpRtc = require("https")
    .createServer(options, function (request, response) {
      request.setHeader('Access-Control-Allow-Origin', '*');
      request.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      request.setHeader('Access-Control-Allow-Headers', '*');

      request
        .addListener("end", function () {
          if (request.url.search(/.png|.gif|.js|.css/g) == -1) {
            file.serveFile(
              serverConfig.specialRoute.default,
              402,
              {},
              request,
              response
            );
          } else {
            file.serve(request, response);
          }
        })
        .resume();
    })
    .listen(serverConfig.getRtcServerPort);
}

/**
 * @description
 * One of best solution WebSocketServer node module package.
 * No memory leak, no need to dispose any possible instance.
 * It is simple just like JS client.
 * To make it works try to run in local and make your sure that
 * localhost runs healthy.
 * Run public server with any http server i use
 *  apache xamp on windows10 but also
 *  you can run self host (ownHosting = true)
 * Recommended:
 * autoAcceptConnections: false
 */
new WebSocketServer({
  httpServer: httpRtc,
  autoAcceptConnections: false,
}).on("request", onRequest);

function onRequest(socket) {
  const origin = socket.origin + socket.resource;
  const websocket = socket.accept(null, origin);

  websocket.on("message", function (message) {
    console.warn("Server controller resive msg :", message);
    if (message.type === "utf8") {
      onMessage(JSON.parse(message.utf8Data), websocket);
    }
  });

  websocket.on("close", function () {
    console.warn("Event: onClose");
    truncateChannels(websocket);
  });
}

function onMessage(message, websocket) {
  if (message.checkPresence) {
    checkPresence(message, websocket);
  } else if (message.open) {
    onOpen(message, websocket);
  } else {
    sendMessage(message, websocket);
  }
}

function onOpen(message, websocket) {
  console.warn("Event : onOpen", message);
  const channel = CHANNELS[message.channel];

  if (channel) {
    CHANNELS[message.channel][channel.length] = websocket;
  } else {
    CHANNELS[message.channel] = [websocket];
  }
}

function sendMessage(message, websocket) {
  message.data = JSON.stringify(message.data);
  const channel = CHANNELS[message.channel];
  if (!channel) {
    console.log("no such channel exists");
    return;
  }

  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < channel.length; i++) {
    if (channel[i] && channel[i] !== websocket) {
      try {
        channel[i].sendUTF(message.data);
      } catch (e) {
        console.warn("Error");
      }
    }
  }
}

function checkPresence(message, websocket) {
  websocket.sendUTF(
    JSON.stringify({
      isChannelPresent: !!CHANNELS[message.channel],
    })
  );
}

function swapArray(arr) {
  const swapped = [],
    length = arr.length;
  for (let i = 0; i < length; i++) {
    if (arr[i]) {
      swapped[swapped.length] = arr[i];
    }
  }
  return swapped;
}

function truncateChannels(websocket) {
  // tslint:disable-next-line:forin
  for (const channel in CHANNELS) {
    const c = CHANNELS[channel];
    for (let i = 0; i < c.length; i++) {
      if (c[i] === websocket) {
        delete c[i];
      }
    }
    CHANNELS[channel] = swapArray(c);
    if (CHANNELS && CHANNELS[channel] && !CHANNELS[channel].length) {
      delete CHANNELS[channel];
    }
  }
}
