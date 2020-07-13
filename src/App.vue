<template>
  <div>
    <app-navbar/>
    <app-display v-bind:logs="logs"/>
    <app-footer/>
  </div>
</template>

<script>
  import Display from './components/Display';
  import {orderBy} from 'lodash';
  import moment from 'moment';
  import Navbar from './components/layout/Navbar';
  import Footer from './components/layout/Footer';

  export default {
    components: {
      'app-display': Display,
      'app-navbar': Navbar,
      'app-footer': Footer
    },
    data () {
      return {
        startDate: new Date('2020-07-01'),
        endDate: new Date(),
        logs: []
      }
    },
    methods: {
      generateLogs(){
        let status = [true, false];
        let object = ['Caméra', 'Serveur', 'Utilisateur'];
        for (let i = 1; i < 501; i++) {
          let number = Math.floor(Math.random() * 10);
          let datetime = new Date(this.startDate.getTime() + Math.random() * (this.endDate.getTime() - this.startDate.getTime()));
          this.logs.push({
            datetime,
            date: moment(datetime).format('YYYY-MM-DD'),
            object: {
              id: i,
              type: object[Math.floor(Math.random() * object.length)] + ' ' + number
            },
            status: status[Math.floor(Math.random() * status.length)] 
          })
        }
        this.logs = orderBy(this.logs, ['date'], ['desc'])
      }
    },
    created(){
      this.generateLogs();
    }
  }
</script>

<style>
  .container{
    padding: 50px 0 50px 0;
  }
</style>