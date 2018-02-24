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
    <div class="col-auto">
        <h1 class="h3-responsive text-center mt-3" v-html="msg"></h1>  
    </div>    
  </div>
  <div class="container">   
    <hr>
    <div v-if="isConnected">
          <ul class="mt-5 col-md-6 mx-auto py-3 card" v-if="stations && stations.length > 0">
          <li class="row d-flex align-items-center justify-content-center mb-5 mb-md-2 p-3 station-link" v-for="station in stations" :key="station.id" >
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
            <div class="md-form col-md-5 mt-3 mt-md-0 p-0 my-0 mx-2">
              <input type="text" placeholder="Type a location name" v-model="station.loc"  class="form-control m-0 p-0">   
            </div>    
            <router-link class="col-auto btn btn-sm btn-primary" :to="{ name: 'StationData', params: { id: station.id }}">
                Last 24h
            </router-link>            
          </li>
        </ul>
        <p v-else class="h3-responsible text-danger">
          <i class="fa fa-low-vision" aria-hidden="true"></i>
          Sorry, no live stations at the moment.
        </p>
    </div>  
   
   
  </div>
</div> 
</template>

<script>
export default {
  name: "StationsList",
  data() {
    return {
      msg: `<i class="fa fa-frown-o" aria-hidden="true"></i> No connection to the weather central!`,
      stations: [],
      isConnected: false
    };
  },
  sockets: {
    connect: function(data) {
      this.isConnected = true;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
    },
    error: function() {
      this.isConnected = false;
      stations: [],
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.isConnected = false;
      stations: [],
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.isConnected = false;
      this.msg = `<i class="fa fa-refresh fa-spin" aria-hidden="true"></i> Reconnecting to the weather central...`;
    },
    broadClient: function(data) {
      this.station = data;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
      this.isConnected = true;
    }
  },
 /*  mounted: function() {},
  methods: {
   
  } */
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.station-link:hover {
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}
</style>
