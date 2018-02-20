// Weather Station Server
function WStationsServer() {
    //Load modules
    const open = require('open'),
        express = require('express'),
        stationEmitter = require('./station'),
        bodyParser = require('body-parser'),
        socketIo = require('socket.io'),
        es6Renderer = require('express-es6-template-engine');

    const port = 3000;
    const app = express();

    this.run = function () {
        // Espress setup
        app.use(express.static(__dirname + '/public'));
        app.set('views', __dirname + '/views');
        app.engine('html', es6Renderer);
        app.set('view engine', 'html');

        app.get('/', function (req, res) {
            res.render('index', {
                locals: {
                    title: 'Welcome!'
                }
            });
        });


        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
            res.status(404);
            res.render('404.html');
        });

        //Init weather stations management server
        app.listen(port);
        open('http://localhost:' + port);
        console.log('Weather stations management server started.');
        station1 = new stationEmitter(1).bcast();
        station2 = new stationEmitter(2).bcast();
        station3 = new stationEmitter(3).bcast();
    }

}

module.exports = new WStationsServer();