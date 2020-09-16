import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import './assets/styles/styles.scss';
import 'material-design-icons-iconfont';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import axios from 'axios';
import { baseUrl } from './configAnalizer/urlConfig.js'



import VueSweetalert2 from 'vue-sweetalert2';

// If you don't need the styles, do not connect
import 'sweetalert2/dist/sweetalert2.min.css';
import VueMask from 'v-mask'
Vue.use(VueMask);
Vue.use(VueSweetalert2);

Vue.prototype.$axios = axios.create({
  baseURL: `${window.location.origin}${baseUrl()}`
})

// http://161.35.95.136:8877
//https://pryamamova.com
// window.location.origin
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
