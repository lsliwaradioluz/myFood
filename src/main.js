import Vue from 'vue';
import App from './App.vue';
import VueApexCharts from 'vue-apexcharts';
import VueResource from 'vue-resource';
import './filters.js';
import Vuelidate from 'vuelidate';
import VuejsDialog from 'vuejs-dialog';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import { store } from './store/store.js';
import { router } from './router';
import Functions from './components/Functions.vue'


Vue.use(VuejsDialog);
Vue.use(Vuelidate);
Vue.use(VueResource);

Vue.http.options.root = 'https://calorie-counter-2af66.firebaseio.com/foods.json';
Vue.component('apexchart', VueApexCharts);
Vue.component('app-functions', Functions);

export const eventBus = new Vue();

export default new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})
