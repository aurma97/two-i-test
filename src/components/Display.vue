<template>
    <div class="container">
        <section>
            <div class="level box">
                <div class="level-left">
                    <div class="level-item">
                        <div class="field">
                            <label class="label">Filtre par date</label>
                            <div class="control is-fullwidth">
                                <input class="input" v-model="searchByDate" type="date">
                            </div>
                        </div>
                    </div>
                    <div class="level-item">
                        <div class="field">
                            <label class="label">Filtre par heure</label>
                            <div class="control is-fullwidth">
                                <input class="input" v-model="searchByTime" type="time">
                            </div>
                        </div>
                    </div>
                    <div class="level-item">
                        <div class="field">
                            <label class="label">Filtre par Objet</label>
                            <div class="select is-fullwidth">
                                <select v-model="searchByObject">
                                    <option value="">Sélectionnez un objet</option>
                                    <option value="Caméra">Caméra</option>
                                    <option value="Utilisateur">Utilisateur</option>
                                    <option value="Serveur">Serveur</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div v-if="searchByDate || searchByTime || searchByObject" class="level-item">
                        <div class="field">
                            <label class="label">&nbsp;</label>
                            <button class="button is-danger is-inverted" @click="resetFilter()">Réinitialiser les filtres</button>
                        </div>
                    </div>
                </div>
                <div class="right">
                    <div class="level-item">
                        <h2 class="title is-2 has-text-link">Suivi des logs</h2>
                    </div>
                </div>
            </div>
        </section>
        <hr>
        <section class="columns">
            <div class="column is-6">
                <table class="table is-fullwidth">
                    <thead>
                        <th class="has-text-centered">Date</th>
                        <th class="has-text-centered">Heure</th>
                        <th class="has-text-centered">Objet</th>
                        <th class="has-text-centered">Status</th>
                    </thead>
                    <tbody v-for="log in filteredLogs">
                        <tr>
                            <td class="has-text-centered">{{`${moment(log.datetime).format('YYYY-MMM-DD')}`}}</td>
                            <td class="has-text-centered">{{`${moment(log.datetime).format('HH:MM:SS')}`}}</td>
                            <td class="has-text-centered">{{`${log.object.type}`}}</td>
                            <td class="has-text-centered">{{`${log.status ? "Connecté(e)" : "Déconnecté(e)"}`}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="column">
                <section class="box hero is-dark is-bold has-text-white">
                    <h2 class="title is-3 has-text-centered">Evolution des logs au fil des jours</h2>
                    <line-chart width="600px" height="500px" :data="logsByDate"></line-chart>
                </section>
                <section class="box hero is-dark is-bold has-text-white" v-if="cameraConnected.length">
                    <h2 class="title is-3 has-text-centered">Etat des caméras</h2>
                    <pie-chart width="600px" height="500px" :data="cameraConnected"></pie-chart>
                </section>
                <section class="box hero is-dark is-bold has-text-white" v-if="userConnected.length">
                    <h2 class="title is-3 has-text-centered">Utilisateurs connectés</h2>
                    <column-chart width="600px" height="500px" :data="userConnected"></column-chart>
                </section>
                <section class="box hero is-dark is-bold has-text-white" v-if="serverConnected.length">
                    <h2 class="title is-3 has-text-centered">Serveurs connectés</h2>
                    <bar-chart width="600px" height="500px" :data="serverConnected"></bar-chart>
                </section>
            </div>
        </section>
    </div>
</template>

<script>
    import moment from 'moment';
    import { groupByRollup, resultByDate, resultByCamera } from '../utils/Functions';
    export default {
        props: ['logs'],
        computed: {
            filteredLogs(){
                return this.logs.filter(log => {
                    if (this.searchByDate && this.searchByTime){
                        console.log("go")
                        return moment(log.datetime).format('HH:MM') == this.searchByTime;
                    }else if (this.searchByTime){
                        return moment(log.datetime).format('HH:MM') == this.searchByTime;
                    }else if (this.searchByDate){
                        return moment(log.datetime).format('YYYY-MM-DD').match(moment(this.searchByDate).format('YYYY-MM-DD')); 
                    }else if (this.searchByObject){
                        return log.object.type.match(this.searchByObject);
                    }else{
                        return this.logs; 
                    }
                })
            },
            logsByDate(){
                let result = resultByDate(groupByRollup(this.filteredLogs, ['date']));
                return result;
            },
            cameraConnected(){
                let tmp = this.filteredLogs.filter(log => log.object.type.match("Caméra"));
                let result = resultByCamera(groupByRollup(tmp, ['status']));
                return result;
            },
            userConnected(){
                let tmp = this.filteredLogs.filter(log => log.object.type.match("Utilisateur"));
                let result = resultByCamera(groupByRollup(tmp, ['status']));
                return result;
            },
            serverConnected(){
                let tmp = this.filteredLogs.filter(log => log.object.type.match("Serveur"));
                let result = resultByCamera(groupByRollup(tmp, ['status']));
                return result;
            }
        },
        methods:{
            resetFilter(){
                this.searchByDate = "";
                this.searchByTime = "";
                this.searchByObject = "";
            }
        },
        data(){
            return {
                moment,
                searchByDate: "",
                searchByTime: "",
                searchByObject: ""
            }
        }
    }
</script>