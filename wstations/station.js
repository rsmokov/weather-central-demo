function StationEmitter(id) {

    const months = {
        01: {
            temp: 1.9,
            hum: 77.9
        },
        02: {
            temp: 2.8,
            hum: 75
        },
        03: {
            temp: 5.7,
            hum: 73.3
        },
        04: {
            temp: 10.3,
            hum: 73.7
        },
        05: {
            temp: 15.4,
            hum: 74.8
        },
        06: {
            temp: 19.9,
            hum: 72.5
        },
        07: {
            temp: 22.4,
            hum: 69.7
        },
        08: {
            temp: 22.3,
            hum: 73.1
        },
        09: {
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
    // Extract data for the current month
    const currMonth = months[new Date().getMonth()];

    this.id = id;
    this.temp = null;
    this.hum = null;

    // Generate random values with different faktors for humidity and temperature for more realistic results
    function getRandomInt(val, factorMin, factorMax) {
        const min = val * factorMin,
            max = val * factorMax;
        return (Math.floor(Math.random() * (max - min + 1)) + min).toFixed(2);
    }

    this.bcast = function () {
        setInterval(function () {
            let temp = getRandomInt(currMonth['temp'], .3, 1.5),
                hum = getRandomInt(currMonth['hum'], .8, 1.2);

            console.log("station: " + id + "\n temp: " + temp + "\n humidity: " + hum + "\n");
        }, 2000);

    }
}
module.exports = StationEmitter;