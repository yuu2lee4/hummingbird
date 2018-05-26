import '@/assets/js/class-component-hooks';
import Vue from 'vue';
import Cookies from 'js-cookie';
import App from './App.vue';
import router from './router';
import store from './store';
import filter from './filter';
import './registerServiceWorker';
import api from '@/assets/js/api';
import toast from '@/components/toast';
import '@/assets/css/index.less';

Vue.config.productionTip = false;

Vue.use(api);
Vue.use(toast);
Vue.use(filter);

async function InitApp() {
  if (Cookies.get('token')) {
    const user = await $api.getUser().catch(() => {
      Cookies.remove('token');
    });
    if (user) {
      store.state.account = user;
    }
  }
  new Vue({
    router,
    store,
    render: (h) => h(App),
  }).$mount('#app');

}
InitApp();
