"use strict";
// Weather Station Server
function WStationsServer() {
    //Load modules
    const open = require('open'),
        express = require('express'),
        stationEmitter = require('./station'),
        bodyParser = require('body-parser'),
        socketIo = require('socket.io'),
        exphbs = require('express-handlebars');

    const app = express();
    const stations = [];

    //Generate virtual stations
    const generate = function (amount) {
        for (let i = 0; i < amount; i++) {
            const station = new stationEmitter(i);
            station.bcast();
            station.on('send', function (data) {
                stations[i] = data;
                /* stations.push(data); */
                console.log(stations);
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
            generate(2);
            res.render('index', {
                helpers: {
                    wstations: function () {
                        return stations;
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