
const serverConfig = {

    database: {
        url: "mongodb://localhost:27017",
        name: "masterdatabase",
    },

    rtcServer: {
        port: 12034,
    },

    connector: {
        protocol: "http",
        port: 1234,
    },

};
module.exports = serverConfig;
