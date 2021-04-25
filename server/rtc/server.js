/**
 * visual-ts game engine server part
 * @description Networking
 */
const static = require('node-static');
const fs = require("fs");
const ServerConfig = require("../server-config.js");
const Connector = require("./connector.js");
const serverConfig = new ServerConfig();
const sessionController = new Connector(serverConfig);
const CHANNELS = {};
const WebSocketServer = require("websocket").server;
var file = new (static.Server)('/var/www/html/applications/visual-typescript-game-engine/build/');
let broadcaster = null;
let httpRtc = null;

if (serverConfig.appUseBroadcaster) {
  var Broadcaster = null;
  Broadcaster = require("./broadcaster");
  broadcaster = new Broadcaster(serverConfig);
  console.log("Running broadcaster...");
}

if (serverConfig.getProtocol == "http") {

  httpRtc = require(serverConfig.getProtocol).createServer(function(request, response) {
  /**
   * SSL off
   */
    request.addListener('end', function() {
      if (request.url.search(/.png|.gif|.js|.css/g) == -1) {
        response.statusCode = 200;
        response.write('No access on this way man.');
        return response.end();
      } else file.serve(request, response);
    }).resume();

  }).listen(serverConfig.getRtcServerPort);

} else {

  /**
   * @description This block can be optimisex
   * SSL on/off
   */
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

new WebSocketServer({
  httpServer: httpRtc,
  autoAcceptConnections: false,
}).on("request", onRequest);

function onRequest(socket) {

  const origin = socket.origin + socket.resource;
  const websocket = socket.accept(null, origin);

  websocket.on("message", function(message) {
    console.warn("Server controller resive msg :", message);
    if (message.type === "utf8") {
      onMessage(JSON.parse(message.utf8Data), websocket);
    }
  });

  websocket.on("close", function() {
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
  websocket.sendUTF(JSON.stringify({
    isChannelPresent: !!CHANNELS[message.channel],
  }));
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

console.warn(" - MultiRtc.2.2 Session handler based on webSocket tech. also  running...");
