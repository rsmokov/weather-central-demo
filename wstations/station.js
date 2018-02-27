"use strict";
const util = require('util');
const EventEmitter = require('events').EventEmitter;

function StationEmitter(id) {
    const _self = this;
    // real monthly avg values
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

    // date props
    const date = new Date();
    _self.currMonth = months[date.getMonth()];
    _self.currTime = date.getHours();

    // station props
    _self.id = id;
    _self.temp = null;
    _self.hum = null;
    //_self.status = 0;

    // functional props
    _self.interval = null;
    _self.speed = 2;
    
    // Generate values for temerature amplitudes regarding the datetime
    function getDTFactor(amplitude){
        const amp = amplitude / 24;
        // Simulate realistic values based on season month and daytime

        const daytimeFactor = [];
        let factorInit = -2;
        for (let i = 0; i < 24; i++) {
            if ( i < 15 ){
                factorInit += amp;
                daytimeFactor[i] = factorInit;
            }
            else{
                factorInit -= amp;
                daytimeFactor[i] = factorInit;
            }
        } 
        return daytimeFactor[parseInt(_self.currTime)];
    }

    // Generate random values with different faktors for humidity and temperature for more realistic results
    function getRandomTemp(val, factorMin, factorMax) {
        // daily difference of 5 grad
        const df = getDTFactor(5);   
        const min = val * factorMin + df,
            max = val * factorMax + df;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
    }
    function getRandomHum(val, factorMin, factorMax) {
        // daily difference of 15 % 
        const df = getDTFactor(15); 
        const min = val * factorMin + df,
            max = val * factorMax + df;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
    }

    function beam(station) {
        _self.interval = setInterval(function () {
            let temp = null,
                hum = null;
            if (station.status === 1) {
                temp = getRandomTemp(_self.currMonth['temp'], .8, 1.2);
                hum = getRandomHum(_self.currMonth['hum'], .9, 1.1);
                if(hum > 100) {hum = 100;}
                if(hum < 10) {hum = 10;}
            }
            _self.emit('send', {
                id: station['id'],
                status: station['status'],
                temp: temp,
                hum: hum
            });
        }, _self.speed * 1000);
    }
    // broadcast values
    _self.bcast = function (speed) {
        const station = {
            id: _self.id,
            status: 1
        }
        _self.speed = speed;
        beam(station);
    }
    // turn off station
    _self.turnoff = function () {        
        clearInterval(_self.interval);
    }
    // maintance mode
    _self.maintance = function () {
        clearInterval(_self.interval);
        const station = {
            id: _self.id,
            status: 2
        };
        beam(station);
    }
    // maintance mode
    _self.backon = function () {
        clearInterval(_self.interval);
        const station = {
            id: _self.id,
            status: 1
        };
        beam(station);
    }
}
//Let Station emitter enhirit from the Event emitter /
util.inherits(StationEmitter, EventEmitter);
module.exports = StationEmitter;