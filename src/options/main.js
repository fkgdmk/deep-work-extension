import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, BIconArrowUp } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.component('BIcon', BIconArrowUp)

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App)
})
