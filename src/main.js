import Vue from 'vue'
import App from './App.vue'
import './../node_modules/bulma/css/bulma.css';
import Chartkick from 'vue-chartkick';
import Chart from 'chart.js';

Vue.use(Chartkick.use(Chart));

new Vue({
  el: '#app',
  render: h => h(App)
})
