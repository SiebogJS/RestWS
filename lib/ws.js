'use strict';

var io = require('socket.io'),
    AgentManagerEventEnum = require('siebogjs-common').enums.AgentManagerEventEnum,
    MessageTypeEnum = require('siebogjs-common').enums.MessageTypeEnum;

module.exports = function (server, messageManager) {

    var ws = io(server);

    ws.of('console')

        .on('connection', function (socket) {

            messageManager.handleMessage(MessageTypeEnum.GET_RUNNING_AGENTS, function (msg) {
                socket.emit('running', msg);
            });

            messageManager.on(MessageTypeEnum.LOG, function (msg) {
                socket.emit('log', msg);
            });

            messageManager.on(AgentManagerEventEnum.NEW_AGENT, function (aid) {
                socket.emit('newAgent', aid);
            });

            messageManager.on(AgentManagerEventEnum.REMOVED_AGENT, function (aid) {
                socket.emit('removeAgent', aid);
            });
        });
};