"use strict";
// Weather Central Server
function WCentralServer() {

    this.run = function (port) {

        port = (typeof port == 'undefined' ? 3000 : port);

        //Load modules
        const express = require('express'),
            app = express(),
            msql = require('node-mysql'),
            bodyParser = require('body-parser'),
            server = app.listen(port),
            socket = require('socket.io');
        //CORS setup for the server
        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        /* app.get('/', function (req, res) {
            console.log(req)
            res.send('<p>some html</p>');
        }); */

        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
             res.status(404).json({ error: 'Not existing.' });
         }); 
        //  
       // app.use(express.static(__dirname + '/node_modules'));

        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
        // Initialize the socket server
        const io = socket(server);
        io.on('connection', function (client) {
            console.log('Weather central ready to receive.');
            //log each and every client connected
            client.on('join', function (data) {
                console.log(data);
            });
            //log each and every client leaving
            client.on('leave', function (data) {
                console.log(data);
            });
            // receiving data from weather stations and broadcasting it back
            client.on('sending', function (data) {
                client.broadcast.emit('broadClient', data);
            });

        });

        console.log('Wheater central started.');

    }
}

module.exports = new WCentralServer();