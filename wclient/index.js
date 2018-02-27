"use strict";
// Weather Central Client
function WCentralClient() {
    
    //Load modules
    const open = require('open'),
        express = require('express'),
        path = require('path'),
        app = express();

    this.run = function (port) {
        port = (typeof port == 'undefined' ? 3000 : port);
        //app.use(express.static(path.join(__dirname, 'node_modules')));
        app.use(express.static(path.join(__dirname, 'dist')));
        app.set('views', __dirname );
        app.set('view engine', 'html');

        app.get('/', function (req, res) {
            res.render(path.join(__dirname, 'index.html'));
        });

        app.listen(port);
        open('http://localhost:' + port);

        console.log('Wheater client started.');
    }

}

module.exports = new WCentralClient();
