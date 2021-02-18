import Vue from 'vue';
import MuseUI from 'muse-ui';
import axios from 'axios';
import 'muse-ui/dist/muse-ui.css';
import Loading from 'muse-ui-loading';
import Toast from 'muse-ui-toast';
import Cookies from 'js-cookie';
import 'muse-ui-loading/dist/muse-ui-loading.css';
import Message from 'muse-ui-message';
import 'muse-ui-message/dist/muse-ui-message.css';
// import Helpers from 'muse-ui/lib/Helpers';
import App from './App.vue';

Vue.use(Loading);
Vue.use(Message);
Vue.use(Toast);
Vue.use(MuseUI);
// Vue.use(Helpers);
Vue.prototype.$axios = axios;
Vue.prototype.$Cookies = Cookies;
/* BaseURl */
axios.defaults.baseURL = "https://bird.ioliu.cn/";

new Vue({
  el: '#app',
  render: a => a(App),
});