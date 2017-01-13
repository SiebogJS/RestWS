'use strict';

var http = require('http'),
    rest = require('./rest'),
    ws = require('./ws');

var server = null;

module.exports = function (STATIC_FILE_PATH, messageManager) {

    server = http.createServer(rest(STATIC_FILE_PATH, messageManager));
    ws(server, messageManager);

    return server;
};
