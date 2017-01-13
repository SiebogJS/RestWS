'use strict';

var MessageTypeEnum = require('siebogjs-common').enums.MessageTypeEnum,
    Message = require('siebogjs-common').structs.Message;

var express = require('express'),
    app = express(),
    bodyParser = require('body-parser');

module.exports = function (STATIC_FILES_PATH, messageManager) {

    /**
     * Adding middleware to express app.
     * Body parser middleware is used to parse HTTP POST body.
     * */
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(STATIC_FILES_PATH));


    app.route('/')

        .get( function (req, res) {
            res.sendFile('index.html', { root : STATIC_FILES_PATH });
        });

    /**
     * @return All agent classes.
     * */
    app.route('/api/agents/classes')

        .get(function (req, res) {

            messageManager.handleMessage(Message(MessageTypeEnum.GET_CLASSES, ""), function (classes) {
                res.send(classes);
            });
        });

    /**
     * @return All running agents.
     * */
    app.route('/api/agents/running')

        .get(function (req, res) {

            messageManager.handleMessage(Message(MessageTypeEnum.GET_RUNNING_AGENTS, ""), function (agents) {
                res.send(agents);
            });
        });


    /**
     * Creates an agent with a given type and name.
     * */
    app.route('/api/agents/running/:type/:name')

        .put(function (req, res) {

            var msg = Message(MessageTypeEnum.START_AGENT, {name: req.params.name, type: req.params.type});
            messageManager.handleMessage(msg,

                function (err, aid) {

                    if(err){
                        console.log(err);
                        res.status(400).send(err).end();
                    }else {
                        res.status(201).json(aid).end();
                    }
                });
        });

    /**
     * Removes an agent with a given aid.
     * */
    app.route('/api/agents/running/:aid')

        .delete(function (req, res) {

            var msg = Message(MessageTypeEnum.STOP_AGENT, {aid: req.params.aid});
            messageManager.handleMessage(msg, function (err) {

                if(err){
                    res.status(500).send(err).end();
                }else {
                    res.status(204).end();
                }
            });
        });

    /**
     * Gets performatives and posts messages to agents.
     * */
    app.route('/api/messages')

        .get(function (req, res) {

            var response = [];

            for(var prop in messageManager.ACLPerformatives){

                if(prop !== 'UNKNOWN')
                    response.push(prop);
            }

            res.status(200).send(response).end();
        })

        .post(function (req, res) {

            var msg = Message(MessageTypeEnum.ACL_MESSAGE, req.body);
            messageManager.handleMessage(msg);
            res.status(204).end();
        });

    app.route('*')
        .get(function(req, res){
            res.sendFile('index.html', {root: STATIC_FILES_PATH });
        });

    return app;
};
