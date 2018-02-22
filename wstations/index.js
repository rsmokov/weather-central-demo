"use strict";
// Weather Station Server
function WStationsServer() {
    //Load modules
    const open = require('open'),
        express = require('express'),
        stationEmitter = require('./station'),
        bodyParser = require('body-parser'),
        io = require('socket.io-client'),
        exphbs = require('express-handlebars');

    const app = express();
    this.stations = [];

    const _self = this;

    //Generate virtual stations
    this.generate = function (amount) {
        const serverport = 3000;
        const socket = io('http://localhost:' + serverport);
        
        for (let i = 0; i < amount; i++) {
            const StEmitter = new stationEmitter(i);
            StEmitter.bcast();
            socket.on('connect', function(data) {
                socket.emit('join', `Weather station-${i} connected.`);
             });
             StEmitter.on('send', function (data) {
                _self.stations[i] = data;
                socket.emit('sending', _self.stations);               
            });
        }

    }

    this.run = function (port) {
        port = (typeof port == 'undefined' ? 3000 : port);
        // Espress setup
        app.engine('handlebars', exphbs( /*{defaultLayout: 'main'}*/ ));
        app.set('view engine', 'handlebars');
        app.use(express.static(__dirname + '/public'));
        app.set('views', __dirname + '/views');

        app.get('/', function (req, res) {
            _self.generate(5);
            res.render('index', {
                helpers: {
                    wstations: function () {
                        
                        return _self.stations;
                    }
                }
            });
        });

        //

        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
            res.status(404);
            res.render('404');
        });

        //Init weather stations management server
        app.listen(port);
        open('http://localhost:' + port);
        console.log('Weather stations management server started.');

    }


}

module.exports = new WStationsServer();