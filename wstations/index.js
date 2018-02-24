"use strict";
// Weather Stations Server
function WStationsServer() {

    const _self = this;
    //Load modules
    const open = require('open'),
        path = require('path'),
        express = require('express'),
        stationEmitter = require('./station'),
        bodyParser = require('body-parser'),
        io = require('socket.io-client');

    const app = express();
    const serverport = 3000;
    // The station holder
    _self.stations = [];

    //Generate virtual stations
    _self.generate = function (amount, speed = 2) {
        amount = parseInt(amount);
        const StEmitter = [];
        for (let i = 0; i < amount; i++) {

            StEmitter[i] = new stationEmitter(i);
            StEmitter[i].bcast(speed); 
                        
            const socket = io('http://localhost:' + serverport);  
            // weather station conecting to the "Weather Central Server" 
            socket.on('connect', function (data) {
                console.log(`Weather station-${i} connected.`)
            });
            socket.on('disconnect', function (data) {
                StEmitter[id].turnoff();
            });
            // Emit via socket on weather station data emission
            StEmitter[i].on('send', function (data) {
                _self.stations[i] = data;
                socket.emit('wsEmitDB', data);
                socket.emit('wsEmitViewr', _self.stations);
            });        
            //client to client turn station off
            socket.on('wsmaintance', function (id) {
                StEmitter[id].maintance();
            });
            socket.on('wsbackon', function (id) {
                StEmitter[id].backon();
            });
            socket.on('wsturnoff', function (id) {
                StEmitter[id].turnoff();
                _self.stations[id].status = 0;
            });
            socket.on('wsalloff', function () {
                for (let i = 0; i < StEmitter.length; i++) {
                    StEmitter[i].turnoff();
                }
                _self.stations = [];
                socket.emit('wsRespondAlloff');
                
            });
        }        
    }
   

    _self.run = function (port) {

        port = (typeof port == 'undefined' ? 3000 : port);
        // Espress setup
        app.use('/app', express.static(path.join(__dirname, 'app')));
        app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });

        /* load app */
       /*  app.get('/', function (req, res) {
            res.status(200);
            res.sendFile('/app/index.html', {
                root: __dirname
            });
        }); */
        // Generate given amount of virtual weather stations
        app.get('/generate/:count', function (req, res) {
            res.status(200);
            _self.generate(req.params.count);
            res.send(req.params);
        });
        

        // Handle 404 - Keep _self as a last route
        app.use(function (req, res, next) {
            res.status(404);
            res.send('404 Wrong request.');
        });

        //Init weather stations management server
        app.listen(port);
       // open('http://localhost:' + port);
        console.log('Weather stations management server started.');
    }
}

module.exports = new WStationsServer();