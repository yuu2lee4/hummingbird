import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

window.$router = new Router({
  routes: [{
    path: '/',
    name: 'home',
    component: () => import('@/views/home.vue'),
  }, {
    path: '/list',
    name: 'list',
    component: () => import('@/views/list.vue'),
  }, {
    path: '/space',
    name: 'space',
    component: () => import('@/views/space.vue'),
  }, {
    path: '/msg-center',
    name: 'msgCenter',
    component: () => import('@/views/msg-center.vue'),
  }, {
    path: '/artical/index/:id',
    name: 'articalIndex',
    component: () => import('@/views/artical/index.vue'),
  }, {
    path: '/artical/edit/:id',
    name: 'articalEdit',
    component: () => import('@/views/artical/edit.vue'),
  }, {
    path: '/artical/post',
    name: 'articalPost',
    component: () => import('@/views/artical/post.vue'),
  }, {
    path: '*',
    redirect: '/',
  }],
});
export default window.$router;
