// Weather Central Server
function WCentralServer() {
    //Load modules
    const open = require('open'),
        express = require('express'),
        msql = require('node-mysql'),
        bodyParser = require('body-parser'),
        socketIo = require('socket.io');
    //Init express server
    const port = 8000;
    const app = express();
    this.run = function () {
        app.use(express.static(__dirname + '/public'));
        app.set('views', __dirname + '/../wclient/views');
        app.engine('html', require('ejs').renderFile);
        app.set('view engine', 'html');

        app.get('/', function (req, res) {
            res.render('index.html');
        });

        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
            res.status(404);
            res.render('404.html');
        });
        app.listen(port);
        open('http://localhost:' + port);

        console.log('Wheater central started.');
    }

}

module.exports = new WCentralServer();