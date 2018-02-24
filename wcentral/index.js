"use strict";
// Weather Central Server
function WCentralServer() {

   /*  const insertBatch = function(table, data) {
        let stmt = db.prepare('INSERT INTO ' + table + ' VALUES (?)')

        for (var i = 0; i < data.lenght; i++) {
            stmt.run('Ipsum ' + i)
        }

        stmt.finalize()
    }; */
    
    const update = function(data) {

    };
    const get = function(data) {
        
    };

    this.run = function (port) {

        port = (typeof port == 'undefined' ? 3000 : port);

        //Load modules
        const express = require('express'),
            path = require('path'),
            dbPath = path.resolve(__dirname, 'sqlite3/weather.sqlite3'),
            app = express(),
          //  msql = require('node-mysql'),
            sqlite3 = require('sqlite3').verbose(),
            db = new sqlite3.Database(dbPath),
            bodyParser = require('body-parser'),
            server = app.listen(port),
            socket = require('socket.io');

        // predef db operations
        let timestamp = 0;/* update timestamp */
        const updatetime = 10, /* update timeSpan */            
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
        //CORS setup for the server
        app.use(function (req, res, next) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
         app.get('/wsdata/:id', function(req, res){
            db.all(`SELECT * FROM ws_data WHERE unit_id LIKE ${req.params.id} AND record_time >= date('now', '-1 days')`,
             function(err, row){
                if(!err && row){
                     res.json({ "wsdata" : row });
                    }
                else res.json({ "wsdata" : null });;
            });
        }); 

        // Handle 404 - Keep this as a last route
        app.use(function (req, res, next) {
             res.status(404).json({ error: 'Not existing.' });
         }); 
        //  

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
            console.log(`Client ${client.id} connected`);
            // each type of lients /wstation or viewer/ joining different rooms
            /* client.on('join', function(room){
                client.join(room);
                console.log(`Client${client.id} joined room ${room}`);
            }); */
            // receiving data from weather stations and broadcasting it back
            client.on('wsEmitDB', function (data) {
                // prevent to often writing io to DB
                if ( Math.floor((new Date() - timestamp)/6000) > updatetime ) {
                    timestamp =  new Date();

                    if(data && data.status === 1){
                        db.get("SELECT * FROM ws_unit WHERE id LIKE " + data.id, function(err, row){
                            if(err){
                                console.log(err, "err db")
                            }
                            else{
                                if(!row){ insertUnit(data.id);}
                                insertData(data);
                            }
                        }); 
                    }
                }                     
            });   
            client.on('disconnect', function (data) {                
                console.log("Client "+client.id +" disconected");
            });     
            client.on('connect', function (data) {                
                console.log("Client "+client.id +" conected");
                /* db.get("SELECT * FROM ws_data WHERE id LIKE " + data.id, function(err, row){
                    if(err){
                        console.log(err)
                        insert('ws_unit', data.id);
                    }
                    else{
                        console.log(row)
                    }
                }); */
            });    
            // Event msg to the control center
            client.on('wsEmitViewr', function (data) {
                client.broadcast.emit('broadClient', data);
            }); 
            client.on('wsRespondAlloff', function(){
                io.sockets.clients().emit('respondAlloff');
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
            });
        });
        
        console.log('Wheater central started.');

    }
}

module.exports = new WCentralServer();