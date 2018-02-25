// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import socketio from 'socket.io-client'
import VueSocketIO from 'vue-socket.io'
import VueCharts from 'vue-chartjs'
import { Bar, Line } from 'vue-chartjs'

import 'mdbootstrap/css/bootstrap.css'
import 'mdbootstrap/css/mdb.css'
import 'font-awesome/css/font-awesome.css'


export const SocketInstance = socketio('http://localhost:3000')

Vue.use(VueSocketIO, SocketInstance, Bar, Line, VueCharts, axios, VueAxios)

Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App, VueSocketIO, socketio, axios, VueAxios  },
  template: '<App/>'
})
