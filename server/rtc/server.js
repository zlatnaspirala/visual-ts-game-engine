
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
// const WebSocketServer = require("websocket").server;
// const {server} = require("websocket");

let file = new static.Server(
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
  var cors = require("cors");
  var https = require("https");
  var hostingHTTP = express();

  if (serverConfig.serverMode === "dev" || serverConfig.serverMode === "mongodb.net") {
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

  if (serverConfig.ownHostingVirtualHostsEnabled) {

    const vhost = require("vhost");

    serverConfig.ownHostingVirtualHosts.forEach((vHostItem) => {
      routerSub = express.Router();
      routerSub.use(express.static(vHostItem.dir));
      hostingHTTP.use(vhost(vHostItem.name, routerSub));
    })

  }

  hostingHTTP.get("*", function (req, res, next) {
    next();
  });

  hostingHTTP.use(express.static("G:/web_server/xampp/htdocs/PRIVATE_SERVER/visual-ts/project/visual-ts/build/"));

  // Compress all HTTP responses
  // hostingHTTP.use(compression());

  hostingHTTP.use(cors());

  hostingHTTP.use(function (req, res, next) {
    res.setHeader("Content-Encoding", "gzip");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT"
    );
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Credentials", false);
    next();
  });

  https.createServer(options, hostingHTTP).listen(serverConfig.ownHttpHostPort, error => {
      if (error) {
        console.warn("Something wrong with own host server.");
        console.error(error);
        return process.exit(1);
      } else {
        console.info(
          "Hosting helper secured host started at " +
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

  var Coordinator = null;
  Coordinator = require("./coordinator");
  Coordinator = new Coordinator(serverConfig);

  console.info("Running broadcaster and coordinator.");
}
