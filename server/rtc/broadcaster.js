
class Broadcaster {

    constructor () {

        const fs = require('fs');
        const path = require('path');
        const url = require('url');
        const ioServer = require('socket.io');
        const RTCMultiConnectionServer = require('rtcmulticonnection-server');
        var httpServer = null;

        // Direct input flags.
        var PORT = 9001;
        var isUseHTTPs = false;

        const jsonPath = {
            config: './server/broadcaster-config.json',
            logs: 'logs.json'
        };

        const BASH_COLORS_HELPER = RTCMultiConnectionServer.BASH_COLORS_HELPER;
        const getValuesFromConfigJson = RTCMultiConnectionServer.getValuesFromConfigJson;
        const getBashParameters = RTCMultiConnectionServer.getBashParameters;

        var config = getValuesFromConfigJson(jsonPath);
        config = getBashParameters(config, BASH_COLORS_HELPER);

        console.log("loading config"+ config);
        console.log("loading config"+ config.isSecure);
        console.log("loading config"+ config.isUseHTTPs);

        // if user didn't modifed "PORT" object
        if (PORT === 9001) {
            PORT = config.port;
        }
        if (isUseHTTPs == false) {
            isUseHTTPs = config.isUseHTTPs;
        }

        function serverHandler(request, response) {

            console.log("++++++++++++++++serverHandler++++++++++++++++");
            // to make sure we always get valid info from json file
            // even if external codes are overriding it
            config = getValuesFromConfigJson(jsonPath);
            config = getBashParameters(config, BASH_COLORS_HELPER);

            var headers = {};
            headers['Access-Control-Allow-Origin'] = '*';
            headers['Access-Control-Allow-Headers'] = 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With';
            headers['Access-Contrl-Allow-Methods'] = 'PUT, POST, GET, DELETE, OPTIONS';
            headers["Access-Control-Max-Age"] = '86400';
            res.writeHead(200, headers);

            if ( request.method === 'OPTIONS' ) {
                console.log('OPTIONS SUCCESS');
                res.end();
            }
            else {
              response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
                'Access-Control-Allow-Headers': '*'
              });
              response.write('RTCMultiConnection Socket.io Server.');
              response.end();
            }

        }

        var httpApp;

        if (isUseHTTPs) {
            httpServer = require('https');

            var options = {
                key: null,
                cert: null,
                ca: null
            };

            var pfx = false;

            if (!fs.existsSync(config.sslKey)) {
                console.log(BASH_COLORS_HELPER.getRedFG(), 'sslKey:\t ' + config.sslKey + ' does not exist.');
            } else {
                pfx = config.sslKey.indexOf('.pfx') !== -1;
                options.key = fs.readFileSync(config.sslKey);
            }

            if (!fs.existsSync(config.sslCert)) {
                console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCert:\t ' + config.sslCert + ' does not exist.');
            } else {
                options.cert = fs.readFileSync(config.sslCert);
            }

            if (config.sslCabundle) {
                if (!fs.existsSync(config.sslCabundle)) {
                    console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCabundle:\t ' + config.sslCabundle + ' does not exist.');
                }

                options.ca = fs.readFileSync(config.sslCabundle);
            }

            if (pfx === true) {
                options = {
                    pfx: sslKey
                };
            }

            console.log("+++++++++++++ httpApp = httpServer.createServer(options, serverHandler);+++++++++++++++++++++");
            httpApp = httpServer.createServer(options, serverHandler);
        } else {

            httpServer = require('https');

            var options = {
                key: null,
                cert: null,
                ca: null
            };

            var pfx = false;



            if (!fs.existsSync(config.sslKeyLocahost)) {
                console.log(BASH_COLORS_HELPER.getRedFG(), 'sslKey:\t ' + config.sslKeyLocahost + ' does not exist.');
            } else {
                pfx = config.sslKeyLocahost.indexOf('.pfx') !== -1;
                options.key = fs.readFileSync(config.sslKeyLocahost);
            }

            if (!fs.existsSync(config.sslCertLocahost)) {
                console.log(BASH_COLORS_HELPER.getRedFG(), 'sslCert:\t ' + config.sslCertLocahost + ' does not exist.');
            } else {
                options.cert = fs.readFileSync(config.sslCertLocahost);
            }

            if (pfx === true) {
                options = {
                    pfx: sslKey
                };
            }

            console.log("+++++++++++++ httpsApp but for Localhost +++++++++++++++++++++");
            httpApp = httpServer.createServer(options, serverHandler);



        }

        RTCMultiConnectionServer.beforeHttpListen(httpApp, config);
        httpApp = httpApp.listen(process.env.PORT || PORT, process.env.IP || "0.0.0.0", function() {
            RTCMultiConnectionServer.afterHttpListen(httpApp, config);
        });

        // socket.io codes goes below
        ioServer(httpApp).on('connection', function(socket) {

            console.log("MultiRTC3: new client.");
            RTCMultiConnectionServer.addSocket(socket, config);

            const params = socket.handshake.query;

            if (!params.socketCustomEvent) {
                params.socketCustomEvent = 'custom-message';
            }

            socket.on(params.socketCustomEvent, function(message) {
                socket.broadcast.emit(params.socketCustomEvent, message);
            });
        });

        console.log("Broadcaster runned under:");
        console.log(config);
        console.log("SSL protocol enabled:", isUseHTTPs)

    }

}
module.exports = Broadcaster;
