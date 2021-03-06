<template>
<div>
 <div class="row align-items-end white">
    <div class="col-auto">
      <div class="badge badge-pill p-0">   
        <div class="row">
          <img class="img-fluid white rounded-circle p-2 col-3" src="../assets/direction-weather-sm.png">
          <div class="col-auto m-auto text-left pr-5">
              <div class="text-uppercase h2-responsive font-weight-normal blue-grey-text">My</div>
              <div class="text-uppercase h2-responsive font-weight-normal orange-text">Meteo</div>
          </div>     
        </div>  
      </div>
    </div>  
    <div class="col-sm-7 col-md-8">
        <h1 class="h3-responsive text-center mt-3" >List of all weather stations</h1>  
        <p class="blue-grey-text" v-html="msg"></p>
    </div>    
  </div>
  <div class="container">   
    <hr>
    <div v-if="stations || stations_cache">
          <ul class="mt-5 col-lg-6 col-md-9 col-sm-12 mx-auto card" v-if="stations.length > 0 || stations_cache.length > 0">
          <li v-if="station.status !== 0" class="row d-flex align-items-center justify-content-around pt-3 mb-3 station-link" v-for="(station, index) in stations" :key="index" >
            <div class="col-12 grey lighten-4 row align-content-center mb-3" v-if="station">             
              <span v-if="station.status === undefined || station.status === 0" class="badge grey lighten-1 p-2">offline</span>
              <span v-if="station.status !== undefined && station.status === 1" class="badge badge-success p-2">online</span>
              <span v-if="station.status !== undefined && station.status === 2" class="badge badge-danger p-2">maintance</span> 
              <span class="small px-3 py-1" v-if="station.id !== undefined">
                Station ID - {{station.id}} 
              </span>                          
            </div>        
            <div class="md-form col-sm-5 d-block mt-3 mt-md-0 p-0 my-2 mx-2" v-if="station">
              <div class="row text-right pr-0 pr-xl-5" >
                  <div class="col-12 text-center text-sm-right">Temperature: <span v-if="station.status === 1 && station.temp" class="ml-2 badge amber darken-2 p1">{{station.temp}}&#8451</span></div>              
                  <div class="col-12 text-center text-sm-right">Humidity: <span v-if="station.status === 1 && station.hum" class="ml-2 badge cyan p1">{{station.hum}}%</span></div>              
              </div>             
            </div>    
            <router-link v-if="station" class="col-auto btn btn-sm btn-light-green my-3" :to="{ name: 'StationData', params: { id: station.id, loc_name: station.loc_name }}">
                Last 24h
            </router-link>          
          </li>
          <!-- CAHED STATIONS -->
          <li v-if="!stations[station_c.id] || stations[station_c.id].status === 0" class=" mb-3 row d-flex align-items-center justify-content-around pt-3 station-link" v-for="(station_c, index) in stations_cache" :key="index+'c'" >
              <div class="col-12 grey lighten-4 row align-content-center  mb-3" v-if="station_c">              
                <span class="badge grey lighten-1 p-2">offline</span>
                <span class="small px-3 py-1" v-if="station_c.id !== undefined">
                  Station ID - {{station_c.id}} 
                </span>
            </div>        
            <div class="md-form col-sm-5 mt-3 mt-md-0 p-0 my-2 mx-2 d-none d-sm-block" v-if="station_c">
              <div class="row text-right pr-0 pr-xl-5">
                  <div class="col-12 text-center text-sm-right">Temperature: </div>              
                  <div class="col-12  text-center text-sm-right">Humidity: </div>              
              </div>             
            </div>    
            <router-link v-if="station_c" class="col-auto btn btn-sm btn-light-green my-3" :to="{ name: 'StationData', params: { id: station_c.id, loc_name: station_c.loc_name }}">
                Last 24h
            </router-link>                      
          </li>
        </ul>
        <p v-else class="h4-responsive text-danger text-center">
          <i class="fa fa-low-vision" aria-hidden="true"></i>
          Sorry, no live stations at the moment.
        </p>
    </div>  
   
   
  </div>
</div> 
</template>

<script>
import axios from 'axios';

export default {
  name: "StationsList",
  data() {
    return {
      msg: `<span class="px-3"></span>`,
      stations: [],
      stations_cache : [],
      stationStatus: [],
      hostname: 'http://' + window.location.hostname
    };
  },
  sockets: {
    connect: function(data) {
      this.getStations();
      this.msg = `<span class="text-success">Connected to the server!</span>`;
      const _self = this;
      setTimeout(() =>{
        _self.msg = '<span class="px-3"></span>';
      }, 3000);
    },
    error: function() {
      this.stations = [];
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {      
      this.stations = [];
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.msg = `<i class="fa fa-refresh fa-spin" aria-hidden="true"></i> Reconnecting to the weather central...`;
    },
    broadClient: function(data) {
      this.stations = data;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
    },
    clientAlloff: function(){
        this.stations = [];
        this.getStations();
    }
  },
  mounted: function() {
      this.getStations();
  },
  methods: {
   getStations: function() {
          axios.get(`${this.hostname}:3000/allstations`)
            .then(res => {
                const data = res.data;        
                this.stations_cache = data;                
            })
            .catch(e => {
              console.log(e);
            });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.station-link:hover {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
</style>
