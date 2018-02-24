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
        <div class="col-sm-6 mb-3">
            
            <h1 class="h1-responsive text-center" :class="classHeader">          
              <i class="fa" :class="station.status !== 1 ? 'fa-power-off': 'fa-wifi'" aria-hidden="true"></i>
              Weather Station  
              <span v-if="!station.loc">ID: {{station.id}}</span>
              <span v-else>{{station.loc}}</span>
            </h1>
        </div>    
        <div class="col-sm-3  mb-3">
          <router-link class="btn btn-warning" :to="{ name: 'StationsList'}">
                back
            </router-link>
        </div>
      </div>
     
      <hr>
      <div class="row">
        <div class="col-md-7  text-right" v-if="station && station.status === 1">
          <div class="h5-responsive">Temperature for today: {{today}}</div>
            <div class="row card d-felx flex-row">
              <img v-if="wicon" class="col-4 grey lighten-4" :src="'../static/meteo-icons/'+wicon+'.svg'" alt="weather icon">
              <div class="col-8 white px-4">
                  <div class="display-3 d-flex justify-content-between">
                  <i v-if="station.temp < 5" class="fa fa-thermometer-empty light-blue-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 5 &&  station.temp < 10" class="fa fa-thermometer-quarter green-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 10 &&  station.temp < 15" class="fa fa-thermometer-half light-green-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 15 &&  station.temp < 25" class="fa fa-thermometer-three-quarters orange-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 25" class="fa fa-thermometer-full deep-orange-text p-3" aria-hidden="true"></i>
                  <span class="display-1">{{station.temp}}<span class="small">&#8451;</span></span>                
                  </div>
                  <div class="h1-responsive d-flex justify-content-between"> 
                      <i class="fa fa-tint p-3 indigo-text" aria-hidden="true"></i>
                      <span class="">{{station.hum}}%</span>
                  </div>
              </div>
            </div>
        </div>
      </div>
      <div class="row my-5">
        <div class="col-12">
            <p class="h3-responsive">Temperature and Humidity of the lase 24 hours</p>
        </div>
        <div class="col-12 row mb-5">
              <chart-data :w-data="stationData"></chart-data>
        </div>
        
      </div>
       <footer class="navbar fixed-bottom navbar-expand-lg scrolling-navbar grey lighten-3 small">
        <div class="container">
            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>
            <span xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/StillImage" property="dct:title" rel="dct:type">
            Amedia Weather Icons</span> by 
            <a xmlns:cc="http://creativecommons.org/ns#" href="http://utvikling.amedia.no" property="cc:attributionName" rel="cc:attributionURL">
            Amedia Utvikling</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.
        </div>
      </footer>
  </div>
</template>

<script>
import ChartData from '@/components/DataChart'
export default {
  name: "StationHistory",
  components: { ChartData },   
  data() {
    return {
      msg: "",
      station: {},
      isConnected: false,
      stationData: {
        'temp': [],
        'hum': []
      }
    };
  },
  sockets: {
    connect: function(data) {
      this.isConnected = true;
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> Waiting for Weather stations`;
    },
    error: function() {
      this.isConnected = false;
      this.station = {};
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.isConnected = false;
      this.station = {};
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.isConnected = false;
      this.msg = "Reconnecting to the weather central...";
    },
    broadClient: function(data) {
      this.station = data[this.$route.params.id];
    }
  },
  computed: {
    today: function (){
        const dateobj = new Date();
        const year = dateobj.getFullYear();
        const month= dateobj.getMonth();
        const day = dateobj.getDay();
        const date = dateobj.getDate();
        const months = ["January", "February", "March",
                        "April", "May", "June", "July",
                        "August", "September", "October",
                        "November", "December"];
        const dates = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let converted_date = "";

        converted_date = dates[day] + " " + date + " " + months[month] + " " + year;

        return converted_date;
      },
      wicon: function() {
        switch (true) {
          case this.station.hum < 50:
            return "1";
            break;
          case (this.station.hum > 50 && this.station.hum < 72 ) && (this.station.temp > 3):
            return "2";
            break;
          case (this.station.hum > 72  ) && (this.station.temp > 3):
            return "4";
            break;
          case (this.station.hum > 50 && this.station.hum < 72  ) && (this.station.temp < 3):
            return "5";
            break;
          case (this.station.hum > 72  ) && (this.station.temp < 3):
            return  "6";
            break;
          case (this.station.hum < 68  ) && ( new Date().getHours() > 17):
            return  "7";
            break;
        }
      },
      classHeader: function() {
          switch (this.station.status) {
            case 0:
              return 'grey-text';
              break;
            case 1:
              return 'text-success';
              break;
            case 2:
              return 'text-danger';
              break;
          }
      }
  },  
  watch: {
    // whenever question changes, this function will run
    stations: function (newData, oldData) {
      this.stationData['temp'].push(newData.temp);
      this.stationData['hum'].push(newData.hum);
    }
  },
  methods: {
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
