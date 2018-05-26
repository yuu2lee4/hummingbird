import Vue from 'vue';
import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';
import getters from './getters';

Vue.use(Vuex);

window.$store = new Vuex.Store({
    state: {
        account: null,
        unReadAmount: -1,
    },
    mutations,
    actions,
    getters,
});
export default window.$store;
