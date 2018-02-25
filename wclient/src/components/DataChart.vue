<template>
  <div class="row">
    <line-chart class="col-md-6"
         :chart-data="dataTemp"
         :height="300"
         :width="600"
    >
    </line-chart>
    <bar-chart class="col-md-6"
        :chart-data="dataHum"
        :height="300"
        :width="600">
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
    }
  }
</script>