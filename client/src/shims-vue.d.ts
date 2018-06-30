declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module 'vue/types/vue' {
  interface Vue {
    $toast: any;
  }
  interface VueConstructor {
    toast: any
  }
}

declare var $api:any
