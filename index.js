//Load modules
const open = require('open'),
    wcentralServer = require('./wcentral/index'),
    wstationsServer = require('./wstations/index');

  wcentralServer.run();
  wstationsServer.run();
 
    