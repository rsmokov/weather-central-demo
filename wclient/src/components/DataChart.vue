<template>
  <div>
    <line-chart
         :chart-data="datacollection"
         :options="{responsive: true, maintainAspectRatio: true}"
         :height="300"
         :width="1024"
    >
    </line-chart>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'

  export default {
    name: "DataChart",
    components: {
      LineChart
    },
    props: ['wData'],
    data () {
      return {
        datacollection: null,
      }
    },
    mounted () {
      this.fillData()
    },
    methods: {
      fillData () {
        this.datacollection = {
          labels: ["Temperature", "Humidity"],
          datasets: [
            {
              label: 'Temperature',
              backgroundColor: '#f87979',
              data: [this.wData['temp']]
            }, {
              label: 'Humidity',
              backgroundColor: 'whitesmoke',
              data: [this.wData['hum']]
            }
          ]
        }
      }
    }
  }
</script>