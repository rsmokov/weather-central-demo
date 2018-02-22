"use strict";
//Load modules
const open = require('open'),
    wcentralServer = require('./wcentral/index'),
    wcentralClient = require('./wclient/index'),
    wstationsServer = require('./wstations/index');

  wcentralServer.run(3000);
//  wcentralClient.run(4000);
  wstationsServer.run(5000);
 
    