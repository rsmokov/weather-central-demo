"use strict";
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function StationEmitter(id) {
    var _self = this;
    const months = {
        1: {
            temp: 1.9,
            hum: 77.9
        },
        2: {
            temp: 2.8,
            hum: 75
        },
        3: {
            temp: 5.7,
            hum: 73.3
        },
        4: {
            temp: 10.3,
            hum: 73.7
        },
        5: {
            temp: 15.4,
            hum: 74.8
        },
        6: {
            temp: 19.9,
            hum: 72.5
        },
        7: {
            temp: 22.4,
            hum: 69.7
        },
        8: {
            temp: 22.3,
            hum: 73.1
        },
        9: {
            temp: 18.3,
            hum: 77.6
        },
        10: {
            temp: 13.5,
            hum: 77.1
        },
        11: {
            temp: 8.4,
            hum: 79
        },
        12: {
            temp: 4.1,
            hum: 747.5
        }
    }
    // Simulate realistic values based on season month and daytime
    const date = new Date();
    const currMonth = months[date.getMonth()];
    let currTime = date.getHours();

    // station props
    _self.id = id;
    _self.temp = null;
    _self.hum = null;
    _self.status = 0;

    // functional props
    _self.interval = null;

    // Generate random values with different faktors for humidity and temperature for more realistic results
    function getRandomInt(val, factorMin, factorMax) {
        let daytimeFactor = Math.sqrt(currTime) ;
        const min = val * factorMin + daytimeFactor,
            max = val * factorMax + daytimeFactor;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
    }

    function beam(station, interval, speed) {
        interval = setInterval(function () {
            let temp = null,
                hum = null;
            if (station.status === 1) {
                temp = getRandomInt(currMonth['temp'], .8, 1.2);
                hum = getRandomInt(currMonth['hum'], .7, 1.2);
                if(hum > 100) {hum = 100;}
                if(hum < 10) {hum = 10;}
            }
            _self.emit('send', {
                id: station['id'],
                status: station['status'],
                temp: temp,
                hum: hum
            });
        }, speed * 1000);
    }
    // broadcast values
    _self.bcast = function (speed) {
        _self.status = 1;
        const station = {
            id: _self.id,
            status: _self.status
        }
        beam(station, _self.interval, speed = 2);
    }
    // turn off station
    _self.stop = function () {
        _self.status = 0;
        clearInterval(_self.interval);
    }
    // maintance mode
    _self.maintance = function () {
        _self.status = 2;
        clearInterval(_self.interval);
        const station = {
            id: _self.id,
            status: 2
        };
        beam(station, _self.interval, speed = 10);
    }
}
//Let Station emitter enhirit from the Event emitter /
util.inherits(StationEmitter, EventEmitter);
module.exports = StationEmitter;