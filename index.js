"use strict";
//Load modules
const open = require('open'),
    wcentralServer = require('./wcentral/index'),
    wstationsServer = require('./wstations/index');

  wcentralServer.run(3000);
  wstationsServer.run(5000);
 
    