<template>
  <div>
      <div class="row align-items-end white">
        <div class="col-auto mb-3 mb-sm-0">
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
        <div class="col-sm-auto justify-content-center col-md-6 mb-3 row">
            <div class="col-2 d-flex align-items-center h1-responsive" :class="classHeader">
                  <i class="fa" :class="station && station.status !== 1 ? 'fa-power-off': 'fa-wifi'" aria-hidden="true"></i>
            </div>
            <div class="col-auto">
                  <p class="text-left m-0" > 
                    Weather Station ID: {{stationId}}
                  </p>
                  <form class=" mx-auto my-0 p-0 row h4-responsive" v-on:submit="stationName(station.id)">  
                    <div class="col-auto my-auto p-0 md-form">Location : </div>   
                    <p v-on:click.self="changename = true" v-if="loc_name && !changename" class="mx-2 my-0 underlined text-capitalize">{{loc_name}}</p>                          
                    <div class="col-md-7 m-auto p-0 md-form"  v-if="!loc_name || changename">   
                        <div class="row" >                          
                            <input 
                              @blur="changename = false"
                              @focus="changename = true"
                              type="text" placeholder="Type a name" v-model="loc_name_temp"
                              class="form-control h-100 m-auto p-0 col-8"> 
                            <button v-if="changename || loc_name_temp.length > 2 " v-on:click="stationName(station.id)" class="btn btn-info p-1 col-2" v-bind:disabled="!loc_name_temp || loc_name_temp.length < 2">
                              <i class="fa fa-check" aria-hidden="true"></i>
                            </button>
                        </div>
                    </div>           
                </form>  
            </div>
        </div>    
        <div class="col-auto  mb-3">
          <router-link class="btn btn-amber" :to="{ name: 'StationsList'}">
                back
            </router-link>
        </div>
      </div>
     
      <hr>
      <div class="row">
        <div class="col-sm-12 col-md-8 col-lg-6 text-right" v-if="station && station.status === 1">
          <div class="h5-responsive">Temperature for today: {{today}}</div>
            <div class="row card d-felx flex-row">
              <img v-if="wicon" class="col-md-4 h-75 img-fluid grey lighten-4" :src="'../static/meteo-icons/'+wicon+'.svg'" alt="weather icon">
              <div class="col-md-8 white px-4">
                  <div class="display-4 d-flex justify-content-between">
                  <i v-if="station.temp < 5" class="fa fa-thermometer-empty light-blue-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 5 &&  station.temp < 10" class="fa fa-thermometer-quarter green-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 10 &&  station.temp < 15" class="fa fa-thermometer-half light-green-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 15 &&  station.temp < 25" class="fa fa-thermometer-three-quarters orange-text p-3" aria-hidden="true"></i>
                  <i v-if="station.temp > 25" class="fa fa-thermometer-full deep-orange-text p-3" aria-hidden="true"></i>
                  <span class="h5-responsive">{{station.temp}}<span class="small">&#8451;</span></span>                
                  </div>
                  <div class="h2-responsive d-flex justify-content-between"> 
                      <i class="fa fa-tint p-3 indigo-text" aria-hidden="true"></i>
                      <span >{{station.hum}}%</span>
                  </div>
              </div>
            </div>
        </div>
      </div>
      <div class="row my-5">
        <div class="col-12">
            <p class="h3-responsive">Temperature and Humidity for the last 24 hours</p>
        </div>
        <div class="col-12  mb-5 card">
              <chart-data :w-data="stationData"></chart-data>
        </div>
        
      </div>
       <footer class="navbar fixed-bottom navbar-expand-lg scrolling-navbar grey lighten-3 small">
        <div class="container">
            <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            <img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a>
            <span class="d-none d-sm-inline" xmlns:dct="http://purl.org/dc/terms/" href="http://purl.org/dc/dcmitype/StillImage" property="dct:title" rel="dct:type">
            Amedia Weather Icons by </span>
            <a xmlns:cc="http://creativecommons.org/ns#" href="http://utvikling.amedia.no" property="cc:attributionName" rel="cc:attributionURL">
            Amedia Utvikling</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
            Creative Commons <span class="d-none d-sm-inline">Attribution-NonCommercial-ShareAlike </span>
            4.0<span class="d-none d-sm-inline"> International License</span></a>.
        </div>
      </footer>
  </div>
</template>

<script>
import axios from 'axios';
import ChartData from '@/components/DataChart'

export default {
  name: "StationHistory",
  components: { ChartData },   
  data() {
    return {
      msg: "",
      stationId: null,
      station: {},
      stationData: {
        'temp': [],
        'hum': [],
        'record_time': []
      },
      changename: false,
      loc_name: "",
      loc_name_temp: "",
      hostname: 'http://' + window.location.hostname
    };
  },
  sockets: {
    connect: function(data) {
      this.msg = `<i class="fa fa-list-ul" aria-hidden="true"></i> Waiting for Weather stations`;
    },
    error: function() {
      this.station = {};
      this.msg = `<i class="fa fa-frown-o" aria-hidden="true"></i> Some error occured!`;
    },
    disconnect: function() {
      this.station = {};
      this.msg = "Disconected from the weather central.";
    },
    reconnecting: function() {
      this.msg = "Reconnecting to the weather central...";
    },
    broadClient: function(data) {
      const id = this.$route.params.id;
      if(data[id] && data[id].status === 1){
          this.station = data[id];
      }
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
          case this.station.hum <= 50:
            return "1";
            break;
          case (this.station.hum > 50 && this.station.hum <= 72 ) && (this.station.temp > 3):
            return "2";
            break;
          case (this.station.hum > 72  ) && (this.station.temp > 3):
            return "4";
            break;
          case (this.station.hum > 50 && this.station.hum < 72  ) && (this.station.temp <= 3):
            return "5";
            break;
          case (this.station.hum > 72  ) && (this.station.temp <= 3):
            return  "6";
            break;
          case (this.station.hum <= 68  ) && ( new Date().getHours() > 17):
            return  "7";
            break;
        }
      },
      classHeader: function() {
        if(this.station)
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
  methods: {
    getData: function() {
           axios.get(`${this.hostname}:3000/wsdata/${this.$route.params.id}`)
            .then(res => {
                const data = res.data;
                data.forEach(row => {
                  this.stationData['temp'].push(row['temp']);
                  this.stationData['hum'].push(row['hum']);
                  this.stationData['record_time'].push(row['record_time'].substr(row['record_time'].length - 8));                  
                });
            })
            .catch(e => {
              console.log(e);
            });
    },
    stationName: function(id) {
        axios.put(`${this.hostname}:3000/changename/${this.$route.params.id}`,
         {loc_name: this.loc_name_temp},
         {headers:{'Content-Type': 'application/json; charset=utf-8'}}
         )
            .then(res => {
                this.changename = false;
                this.getStation();
            })
            .catch(e => {
              console.log(e);
            });
        
    },
    getStation: function() {
          axios.get(`${this.hostname}:3000/wsunit/${this.$route.params.id}`)
            .then(res => {
                const data = res.data;
                this.loc_name = data.loc_name;                
            })
            .catch(e => {
              console.log(e);
            });
    }
  },
  mounted: function() {
      this.getData();
      this.getStation();
      this.stationId = this.$route.params.id;
      this.locName =  this.$route.params.loc_name;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.underlined{
  cursor: pointer;
  border-bottom: 1px solid grey;
}
</style>
