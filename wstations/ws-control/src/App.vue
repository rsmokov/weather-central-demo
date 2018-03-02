<template>
<div class="container pt-5">
  <p class="display-4 mb-5">Virtual weather stations control center</p>
  <hr>
 <div class="d-felx align-items-end">
        <h1 class="h3-responsive text-center mt-3"  v-html="msg"></h1> 
  </div>
  <div class="container">   
    <hr v-if="msg">
    <div v-if="isConnected && !generated" class="animated" :class="generated ? 'fadeInUp' : ''">
      <div class="row d-flex justify-content-center">
          <p class="col-12 text-center">Please, select amount of stations to generate</p>
          <button class="btn blue-grey lighten-3" v-on:click.self="generate(1)">1 Station</button>
          <button class="btn blue-grey lighten-2" v-on:click.self="generate(3)">3 Stations</button>
          <button class="btn blue-grey " v-on:click.self="generate(5)">5 Stations</button>
          <button class="btn blue-grey darken-1" v-on:click.self="generate(7)">7 Stations</button>
          <button class="btn blue-grey darken-3" v-on:click.self="generate(10)">10 Stations</button>
      </div>
      <hr>
      <div class="row">
              <button class="btn btn-blue-grey btn-small d-block mx-auto my-5" v-on:click="clearall()">Clear data records for all stations</button>              
            </div>
            <div class="row">
              <p class="col-12 text-danger text-center" v-for="(msg, index) in dbmsg" :key="index">{{msg}}</p>
            </div>
    </div>
    <div v-if="isConnected">
          <div v-if="stations && stations.length > 0">
              <ul class="mt-5 col-md-6 mx-auto py-3 card" >
              <li class="row d-flex align-items-center justify-content-center mb-5 mb-md-2 p-3 station-link" v-for="(station, key, index) of stations" :key="index" >
                <div class="col-sm-4 row">
                  <div class="col-12 small">
                    Station ID - {{station.id}} 
                  </div>
                  <div class="col-12">
                        <span v-if="parseInt(station.status) === 1" class="badge badge-success p-2">online</span>
                        <span v-if="parseInt(station.status) === 0" class="badge grey lighten-1 p-2">offline</span>
                        <span v-if="parseInt(station.status) === 2" class="badge badge-danger p-2">maintance</span>
                  </div>                
                </div>                   
                <button class="btn btn-danger btn-sm" v-on:click="maintance(station.id)">maintance</button>  
                <button class="btn btn-success btn-sm" v-on:click="backon(station.id)">back on</button>  
                <button class="btn btn-sm grey " v-on:click="turnoff(station.id)">off</button>  
              </li>
            </ul>
            <samp class="text-center blue-grey-text d-block">At least one station must be "online" or in "maintance mode"!</samp>
            <div class="row">
              <button class="btn btn-danger btn-small d-block mx-auto my-5" v-on:click="alloff()">Turn all stations off</button>
            </div>            
        </div>        
    </div>  
   
   
  </div>
</div> 
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      msg: `<i class="fa fa-frown-o" aria-hidden="true"></i> No connection to the weather central!`,
      stations: [],
      isConnected: false,
      generated: false,
      dbmsg : null
    };
  },
  sockets: {
    connect: function(data) {
      this.isConnected = true;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`; 
    },
    error: function() {
      this.isConnected = false;
      this.stations = [];
      this.generated = false;
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.isConnected = false;
      this.stations = [];
      this.generated = false;
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.isConnected = false;
      this.stations = [];
      this.msg = `<i class="fa fa-refresh fa-spin" aria-hidden="true"></i> Reconnecting to the weather central...`;
    },
    broadClient: function(data) {  
      this.stations = data;
      console.log(JSON.stringify(data))
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
      this.isConnected = true;
      if(data.length < 1){
        this.generated = false;
      }
      else{
        this.generated = true;
      }
    },
    respondAlloff: function() {
      this.stations = [];
      this.msg = `<i class="fa fa-signal" aria-hidden="true"></i> No weather station is broadcasting right now.`;     
      this.generated = false;
      },
    dbDeleteResp: function(data) {
        this.dbmsg = data;
        const _self = this;
        setTimeout(function() {
           _self.dbmsg = null;
        }, 3000);
    }  
  },
  methods: {
    generate(amount) {
      if(!this.generated && amount){
          axios.get(`http://localhost:5000/generate/${amount}`)
            .then(response => {
              this.generated = true;
              console.log('Generated ' + response.data['count'] + 'virtual stations');
            })
            .catch(e => {
              console.log(e);
            });
        }
    },
    maintance(id) {
      this.$socket.emit("maintance", id);
    },
    backon(id) {
      this.$socket.emit("backon", id);
    },
    turnoff(id) {
      this.$socket.emit("turnoff", id);
    },
    alloff() {
      this.$socket.emit("alloff");
    },
    clearall() {
      this.$socket.emit("clearall");
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  margin-top: 60px;
}
</style>
<style src="mdbootstrap/css/bootstrap.css"></style>
<style src="mdbootstrap/css/mdb.css"></style>
<style src="font-awesome/css/font-awesome.css"></style> 
