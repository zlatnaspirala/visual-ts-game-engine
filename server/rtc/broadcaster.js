
class Broadcaster {

    constructor () {

        const fs = require('fs');
        const path = require('path');
        const url = require('url');
        var httpServer = require('http');

        const ioServer = require('socket.io');
        const RTCMultiConnectionServer = require('rtcmulticonnection-server');

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

        // if user didn't modifed "PORT" object
        // then read value from "config.json"
        console.log("CONFIG >port> ", config.port);
        if (PORT === 9001) {
            PORT = config.port;
        }
        if (isUseHTTPs === false) {
            isUseHTTPs = config.isUseHTTPs;
        }

        function serverHandler(request, response) {
            // to make sure we always get valid info from json file
            // even if external codes are overriding it
            config = getValuesFromConfigJson(jsonPath);
            config = getBashParameters(config, BASH_COLORS_HELPER);


            response.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            response.write('RTCMultiConnection Socket.io Server.\n\n' + 'https://github.com/muaz-khan/RTCMultiConnection-Server\n\n' + 'npm install RTCMultiConnection-Server');
            response.end();


        }

        var httpApp;

        if (isUseHTTPs) {
            httpServer = require('https');

            // See how to use a valid certificate:
            // https://github.com/muaz-khan/WebRTC-Experiment/issues/62
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

            httpApp = httpServer.createServer(options, serverHandler);
        } else {
            httpApp = httpServer.createServer(serverHandler);
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

        console.log("CONFIG >> ", config);

    }

}
module.exports = Broadcaster;
