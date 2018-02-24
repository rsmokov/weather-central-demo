Vue.use(VueSocketio, 'http://localhost:3000');

var vm = new Vue({
    el: '#app',
    components: { VueSocketio },
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
          console.log(data, "broadcasting")
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
  })