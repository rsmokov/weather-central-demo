"use strict";
// Weather Central Server
function WCentralServer() {
    //Load modules
    const express = require('express'),
        msql = require('node-mysql'),
        bodyParser = require('body-parser'),
        socketIo = require('socket.io');
    //Init express server
    const app = express(),
          server = require('http').Server(app),
          io = require('socket.io')(server);

    this.run = function (port) {
        port = (typeof port == 'undefined' ? 3000 : port);
        
        /* app.get('/', function (req, res) {
            //res.render('index.html');
        }); */

        // Handle 404 - Keep this as a last route
       /*  app.use(function (req, res, next) {
            console.log(req);
            res.status(404).json({ error: 'Not existing.' });
        }); */
        app.use(function(err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
              message: err.message,
              error: {}
            });
          });
        app.listen(port);

        console.log('Wheater central started.');
    }
   

}

module.exports = new WCentralServer();