/*
文档：https://github.com/noru/vue-easy-toast
horizontalPosition默认改为center
className增加'et-success'
*/
import Vue from 'vue';
import EasyToastVue from './EasyToast.vue';

export default {
  install(Vue: any, defaultOptions = {}) {
    const CONSTRUCTOR = Vue.extend(EasyToastVue)
    const CACHE:any = {}
    Object.assign((EasyToastVue as any).DEFAULT_OPT, defaultOptions)

    function toast(msg: any, options:any = {}) {
      options.message = msg
      let toast = CACHE[options.id] || (CACHE[options.id] = new CONSTRUCTOR)
      if (!toast.$el) {
        let vm = toast.$mount()
        document.querySelector(options.parent || 'body').appendChild(vm.$el)
      }
      toast.queue.push(options)
    }
    Vue.toast = Vue.prototype.$toast = toast;
  }
}
