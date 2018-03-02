<template>
  <div class="row">
    <line-chart class="col-md-6"
         :chart-data="dataTemp"
         :height="300"
         :width="600"
         :options="{ elements: { point: { radius: 0 } } }"
    >
    </line-chart>
    <bar-chart class="col-md-6"
        :chart-data="dataHum"
        :height="300"
        :width="600"
        :options="{ elements: { point: { radius: 0 } } }"
        >
    </bar-chart>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import BarChart from './BarChart.js'

  export default {
    name: "DataChart",
    components: {
      LineChart, BarChart
    },
    props: ['wData'],
    data () {
      return {
        dataHum: null,
        dataTemp: null,
      }
    },
    mounted () {     
      setTimeout(() => {
        this.fillData();
      }, 300);
    },
      sockets: {
        broadClient: function(data) {
          const id = this.$route.params.id;
          this.station = data[id];
          if(data[id] && data[id].status !== 0){
              this.wData['temp'].push(this.station['temp']);
              this.wData['hum'].push(this.station['hum']);
              let date = new Date();
              this.wData['record_time'].push(`${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`);
              this.fillData();
          }
        }
      },
    methods: {
      fillData () {
        this.dataTemp = {
          labels: this.wData['record_time'],
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: '#ffc10769',
              data: this.wData['temp']
            }
          ]
        };
        this.dataHum = {
          labels: this.wData['record_time'],
          datasets: [
            {
              label: 'Humidity',
              backgroundColor: '#007bff6b',
              data: this.wData['hum']
            }
          ]
        };
      }
    },
    watch: {
      wData: function(newVal, oldVal){
        console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        /* setTimeout(() => {
        this.fillData();
          }, 300); */
      }
    }
  }
</script>