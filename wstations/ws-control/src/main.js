// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import VueAxios from 'vue-axios'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'

export const SocketInstance = socketio('http://localhost:3000')

Vue.use(VueSocketIO, SocketInstance, VueAxios, axios)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App, VueSocketIO, socketio, axios },
  template: '<App/>'
})
