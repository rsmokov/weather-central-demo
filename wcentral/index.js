"use strict";
// Weather Central Server
function WCentralServer() {

    this.run = function (port) {

        port = (typeof port == 'undefined' ? 3000 : port);

        //Load modules
        const express = require('express'),
            path = require('path'),
            open = require('open'),
            dbPath = path.resolve(__dirname, 'sqlite3/weather.sqlite3'),
            app = express(),
            sqlite3 = require('sqlite3').verbose(),
            db = new sqlite3.Database(dbPath),
            bodyParser = require('body-parser'),
            server = app.listen(port),
            socket = require('socket.io');

        //PARSE BODY ON POST PUT
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());

        //CORS
        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.setHeader("Access-Control-Allow-Methods", "*");
            next();
        });

        // predef db operations
        let timestamp = [];/* update timestamp */
        const updatetime = 10, /* update timeSpan in sec */            
            insertUnit = function(id) {
                db.run("INSERT INTO ws_unit (id, loc_name) VALUES ("+id+", NULL)")
            },
            insertData = function(data) {
                const values = [data.id, data.temp, data.hum];
                db.run("INSERT INTO ws_data (unit_id, temp, hum, record_time) VALUES ("+values.toString()+",  datetime())");
            };

        //db on init
        db.serialize(function() {
            db.run("CREATE TABLE IF NOT EXISTS ws_unit (id INTEGER PRIMARY KEY, loc_name VARCHAR)");
            db.run("CREATE TABLE IF NOT EXISTS ws_data (id INTEGER PRIMARY KEY AUTOINCREMENT, unit_id INTEGER, temp INTEGER, hum INTEGER, record_time TEXT)");
        });   

        // Client App on
        app.use(express.static(path.join(__dirname, 'wclient', 'dist')));
        app.set('views', __dirname );
        app.set('view engine', 'html');

        app.get('/', function (req, res) {
            res.render(path.join(__dirname, 'wclient', 'index.html'));
        });

        // API REQUESTS
        app.get('/allstations', function(req, res){
            db.all(`SELECT * FROM ws_unit`,
             function(err, rows){
                if(!err && rows){
                     res.json(rows);
                    }
                else res.json(null);
            });
        });
        app.get('/wsdata/:id', function(req, res){
            db.all(`SELECT temp, hum, record_time FROM ws_data WHERE unit_id LIKE ${req.params.id} AND record_time >= date('now', '-1 days')`,
             function(err, rows){
                if(!err && rows){
                     res.json(rows);
                    }
                else res.json(null);
            });
        }); 
        app.get('/wsunit/:id', function(req, res){
            db.get(`SELECT * FROM ws_unit WHERE id LIKE ${req.params.id}`,
             function(err, row){
                 if(!err && row){
                     res.json(row);
                    }
                else res.json(null); 
            });
        }); 
        app.options('/changename/:id', function(req, res){
            res.status(200).end();
        });
        app.put('/changename/:id', function(req, res){
            if(req && req.body && req.body.loc_name){
                const postdata = [req.body.loc_name, req.params.id];
                const sql = `UPDATE ws_unit
                            SET loc_name = ?
                            WHERE id = ?`;
                
                db.run(sql, postdata, function(err, row){
                    if(!err && row){
                        res.json("updated");
                        }
                    else res.json(err);
                });
             }
            else res.json("noting to update"); 
        });

        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
             res.status(404).json({ error: 'Not existing.' });
         }); 

        // Initialize the socket server
        const io = socket(server);
        io.on('connection', function (client) {
            console.log(`Client ${client.id} connected`);

            // receiving data from weather stations and broadcasting it back
            client.on('wsEmitDB', function (data) {
                // prevent to often writing io to DB 
                if ( Math.floor((new Date() - timestamp[data.id])/6000) > updatetime ) {
                    timestamp[data.id] =  new Date();      
                    if(data && data.status === 1){
                         insertData(data);
                    }
                }                     
            }); 
            client.on('wsCreated', function (id) {
                db.get("SELECT * FROM ws_unit WHERE id LIKE " + id, function(err, row){
                    if(err){
                        console.log(err, "err db")
                    }
                    else{
                        if(!row) insertUnit(id);
                        //init timestamp for the db record
                        timestamp[id] = 0;
                        }
                });  
            }); 
            client.on('disconnect', function (data) {                
                console.log("Client "+client.id +" disconected");
            });     
            client.on('connect', function (data) {                
                console.log("Client "+client.id +" conected");                
            });    
            // Event msg to the control center
            client.on('wsEmitViewr', function (data) {
                client.broadcast.emit('broadClient', data);
            }); 
            client.on('wsRespondAlloff', function(){
                io.sockets.clients().emit('respondAlloff');
            });        

            client.on('clearall', function (id) {
                let msg = [];
                db.all("DELETE FROM ws_unit", function(err, row){
                    if(err){
                        console.log(err, "err db")
                    }
                    else{
                        msg.push("All units deleted");
                        io.sockets.clients().emit('dbDeleteResp', msg);
                    }
                }); 
                db.all("DELETE FROM ws_data", function(err, row){
                    if(err){
                        console.log(err, "err db")
                    }
                    else{
                        msg.push("All data fot the units deleted");
                        io.sockets.clients().emit('dbDeleteResp', msg);
                    }
                }); 
            });
            // Event msgs to the weather stations
            client.on('turnoff', function(id){
                io.sockets.clients().emit('wsturnoff', id);
            });
            client.on('backon', function(id){
                io.sockets.clients().emit('wsbackon', id);
            });
            client.on('maintance', function(id){
                io.sockets.clients().emit('wsmaintance', id);
            });
            client.on('alloff', function(){
                io.sockets.clients().emit('wsalloff');
                io.sockets.clients().emit('clientAlloff');
            });
        });
        
        console.log('Wheater central started.');

        open('http://localhost:' + port);

    }
}

module.exports = new WCentralServer();