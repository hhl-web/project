import Vue from 'vue';
import App from './App.vue';
import store from '@/store';
import router from '@/router';
import ElementUi from 'element-ui';
Vue.use(ElementUi);
//绑定全局AjaxFetch
import AjaxFetch from '@/api/fetch';
Vue.prototype.$api=AjaxFetch;
Vue.config.productionTip = false;

import '@/assets/style/page.scss';
import '@/assets/style/common.css';
new Vue({
  render: h => h(App),
	store,
	router
}).$mount('#app')
