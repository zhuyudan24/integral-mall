// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import promise from 'es6-promise';
promise.polyfill();
import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import ElementUI from 'element-ui';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/theme/index.css';
import '../static/fonts/iconfont.js';
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
// import vueGicStoreLinkage from '@gic-test/vue-gic-store-linkage';
// Vue.use(vueGicStoreLinkage);

Vue.axios.defaults.withCredentials = true; // 跨域cookie访问
Vue.config.productionTip = false;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
