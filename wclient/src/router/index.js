import Vue from 'vue'
import Router from 'vue-router'
import WsList from '@/components/WsList'
import WsData from '@/components/WsData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'StationsList',
      component: WsList
    },
    {
      path: '/station/:id',
      name: 'StationData',
      component: WsData
    }
  ]
})
