<template>
<div>
 <div class="row">
    <div class="col"><img class="img-responsive" src="../assets/direction-weather.png"></div>
  </div>
  <div class="container">
    <h1 class="h3-responsive mt-3" v-html="msg"></h1>
    <hr>
    <div v-if="isConnected">
          <ul class="mt-5 col-md-6 mx-auto py-3 card" v-if="stations && stations.length > 0">
          <li class="row d-flex align-items-center justify-content-center mb-5 mb-md-2 p-3 station-link" v-for="station in stations" :key="station.id">
            <div class="col-auto">
                <span v-if="parseInt(station.status) === 1" class="badge badge-success p-2">online</span>
                <span v-if="parseInt(station.status) === 0" class="badge grey lighten-2 p-2">offline</span>
                <span v-if="parseInt(station.status) === 2" class="badge badge-danger p-2">maintance</span>
            </div>        
            <div class="col-auto"> Station ID - {{station.id}} </div>
            <div class="md-form col-md-5 mt-3 mt-md-0 p-0 my-0 mx-2">
              <input type="text" v-model="station.temp"  class="form-control m-0 p-0">   
              <input type="text" v-model="station.hum"  class="form-control m-0 p-0">   
            </div>       
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
      stations: {},
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
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.isConnected = false;
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.isConnected = false;
      this.msg = "Reconnecting to the weather central...";
    },
    broadClient: function(data){      
      this.stations = data;
    }
  },
  mounted: function() {},
  methods: {
    pingServer() {
      // Send the "pingServer" event to the server.
      this.$socket.emit("pingServer", "PING!");
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
