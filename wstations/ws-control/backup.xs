<template>
<div >
 <div class="d-felx align-items-end">
        <h1 class="h3-responsive text-center mt-3" v-html="msg"></h1>  
  </div>
  <div class="container">   
    <hr>
    <div v-if="isConnected">
          <ul class="mt-5 col-md-6 mx-auto py-3 card" v-if="stations && stations.length > 0">
          <li class="row d-flex align-items-center justify-content-center mb-5 mb-md-2 p-3 station-link" v-for="station in stations" :key="station.id">
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
             <button class="btn btn-success btn-sm" v-on:click="backon(station.id)">backon</button>  
             <button class="btn btn-sm" v-on:click="turnoff(station.id)">off</button>  
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
  name: 'App',
  el: '#app',
 /*   components: {}, */
  data() {
    return {
      msg: `<i class="fa fa-frown-o" aria-hidden="true"></i> No connection to the weather central!`,
      stations: {},
      isConnected: true
    };
  },
  sockets: {
    connect: function(data) {
      this.isConnected = true;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
    },
    error: function() {
      this.isConnected = false;
      this.stations = {};
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.isConnected = false;
      this.stations = {};
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.isConnected = false;
      this.msg = `<i class="fa fa-refresh fa-spin" aria-hidden="true"></i> Reconnecting to the weather central...`;
    },
    broadClient: function(data) {
      this.stations = data;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> List of all weather stations`;
      this.isConnected = true;
    }
  },
  mounted: function() {},
  methods: {
    maintance(id) {
      this.$socket.emit("maintance", id);
    },
    backon(id) {
      this.$socket.emit("backon", id);
    },
    turnoff(id) {
      this.$socket.emit("turnoff", id);
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
