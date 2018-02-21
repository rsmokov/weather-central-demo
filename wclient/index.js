"use strict";
// Weather Central Client
function WCentralClient() {
    //Load modules
    const open = require('open'),
        express = require('express'),
        bodyParser = require('body-parser'),
        socketIo = require('socket.io');
    //Init express Client
    const app = express();
    this.run = function (port) {
        port = (typeof port == 'undefined' ? 3000 : port);
        app.use(express.static(__dirname + '/public'));
        app.set('views', __dirname );
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.get('/', function (req, res) {
            res.render('index.html');
        });

        app.listen(port);
        //open('http://localhost:' + port);

        console.log('Wheater client started.');
    }

}

module.exports = new WCentralClient();