<template>
  <div id="app">
    <header class="header">
      <div class="header-wrapper clearfix">
        <router-link class="header-logo pull-left" to="/">
          <i class="iconfont logo"></i><b style="font-weight:600">蜂鸟社区</b>
        </router-link>
        <search class="header-search pull-left" placeholder="输入关键词搜索" v-model="searchVal" 
        @keyup.enter.native="submit" v-show="!isHome"></search>
        <template v-if="isLogin">
          <span class="header-user pull-right">
            <img src="/img/default-avatar.png" alt="" class="header-user-avatar">
            <list :data="userList" class="header-user-list" @item-click="loginListClick"></list>
          </span>
        </template>
        <template v-else>
          <div class="pull-right header-notLogin">
            <span @click="isLoginShow = true">登录</span><template v-if="!useLdap">|<span @click="isRegisterShow = true">注册</span></template>
          </div>
        </template>
        <span v-if="isLogin" class="header-dropdown msgBox pull-right">
          <router-link class="iconfont ic-nav-alart" tag="i" to="/msg-center">
            <span class="msgBox-num" v-if="hasUnReadComment"></span>
          </router-link>
        </span>
        <span class="header-dropdown pull-right">
          <i class="iconfont ic-nav-menu"></i>
          <list :data="quickList" class="header-dropdown-list"></list>
        </span>
        <span class="header-post pull-right" @click="post"><i class="iconfont ic-pen"></i>文章投稿</span>
      </div>
    </header>
    <router-view class="content"/>
    <footer class="footer">
      Copyright © 2018 Powered by G7 UED
    </footer>
    <modal title="注册" class="modal" :visible.sync="isRegisterShow" :has-footer="false" container-style="padding: 0 25px">
      <my-input class="modal-ipt" placeholder="用户名"></my-input>
      <my-input class="modal-ipt" placeholder="密码" type="password"></my-input>
      <my-input class="modal-ipt" placeholder="确认密码" type="password"></my-input>
      <my-button class="modal-btn">注册</my-button>
      <div class="modal-bottom">
        <span @click="showLogin">已有账号，立即登录</span>
      </div>
    </modal>
    <modal title="登录" class="modal" :visible.sync="isLoginShow" :has-footer="false" container-style="padding: 0 25px">
      <my-input class="modal-ipt" placeholder="用户名" v-model="loginForm.username"></my-input>
      <my-input class="modal-ipt" placeholder="密码" type="password" v-model="loginForm.password" @keyup.enter.native="login"></my-input>
      <my-button class="modal-btn" @click.native="login">登录</my-button>
      <div class="modal-bottom" v-if="!useLdap">
        <span @click="showRegister">没有账号？注册一个</span>
      </div>
    </modal>
  </div>
</template>
<script lang="ts">
import Cookies from 'js-cookie';
import modal from '@/components/modal.vue';
import list from '@/components/list.vue';
import search from '@/components/search.vue';
import myInput from '@/components/input.vue';
import myButton from '@/components/button.vue';
import confg from '@/config';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({
  components: {
    list,
    modal,
    myInput,
    myButton,
    search
  }
})
export default class App extends Vue {
  useLdap = confg.ldap.enable;
  searchVal = '';
  isRegisterShow = false;
  isLoginShow = false;
  isHome = true;
  loginForm = {
    username: '',
    password: '',
  }
  quickList = [{
    label: '产品全图',
    path: 'http://uimanager.demo.ued.g7s.chinawayltd.com',
    open: true,
  }, {
    label: 'Vue-Beauty',
    path: 'https://fe-driver.github.io/vue-beauty',
    open: true,
  }, {
    label: 'Yapi',
    path: 'http://yapi.demo.ued.g7s.chinawayltd.com',
    open: true,
  }, {
    label: 'G7SMap',
    path: 'http://test.resources.g7s.chinawayltd.com/G7SMap',
    open: true,
  }, {
    label: 'Speed-Index',
    path: 'http://speedindex.demo.ued.g7s.chinawayltd.com',
    open: true,
  }, {
    label: 'BSBR',
    path: 'http://wiki.chinawayltd.com/pages/viewpage.action?pageId=26085176',
    open: true,
  }, {
    label: 'CPT',
    path: 'http://git.chinawayltd.com/frontend/CPT',
    open: true,
  }, {
    label: 'GPT',
    path: 'http://git.chinawayltd.com/frontend/vue_boot_on_g7s',
    open: true,
  }, {
    label: 'MPT',
    path: 'http://git.chinawayltd.com/frontend/mobileTemplate',
    open: true,
  }]
  userList = [{
    label: '个人中心',
    path: '/space',
  }, {
    label: '退出'
  }]
  @Watch('$route')
  onRouteChanged(val: object) {
    this.isHome = val.path === '/';
  }
  get isLogin() {
    const isLogin = !!this.$store.state.account;
    if (isLogin) {
      this.$store.dispatch('getUnReadAmount');
    }
    return isLogin;
  }
  get hasUnReadComment() {
    return this.isLogin && this.$store.state.unReadAmount > 0;
  }
  showLogin() {
    this.isRegisterShow = false;
    this.isLoginShow = true;
  }
  showRegister() {
    this.isLoginShow = false;
    this.isRegisterShow = true;
  }
  async login() {
    if (!this.loginForm.username) return this.$toast('请输入用户名！', { className: 'et-warn' });
    if (!this.loginForm.password) return this.$toast('请输入密码！', { className: 'et-warn' });
    if (this.useLdap) {
      const res = await $api.postUserLdapLogin(this.loginForm);
      this.isLoginShow = false;
      this.$store.state.account = res;
    }
  }
  loginListClick(i: number) {
    // 退出
    if (i === 1) {
      Cookies.remove('token');
      this.$store.state.account = null;
    }
  }
  post() {
    if (!this.isLogin) {
      return this.isLoginShow = true;
    }
    this.$router.push({ name: 'articalPost' });
  }
  submit() {
    const keyword = this.searchVal.trim();
    if (!keyword) {
      Vue.toast('关键词不能为空', { className: 'et-warn' });
      return;
    }

    this.$router.push({
      name: 'list',
      query: {
        id: keyword,
        type: 'title',
      },
    });
  }
}
</script>
<style <style lang="less" scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .header {
    --height: 60px;
    background: #161E33;
    z-index: 10001;

    &-wrapper {
      max-width: 1364px;
      height: var(--height);
      margin: 0 auto;
    }
    &-logo {
      width: 131px;
      height: var(--height);
      margin-left: 18px;
      line-height: var(--height);
      font-size: 15px;
      color: #FFF;
      text-indent: 16px;
      text-decoration: none;
      background: #F04B59;

      .logo {
        font-size: 36px;
        vertical-align: middle;
      }
    }
    &-search {
      float: left;
      width: 228px;
      margin-top: 12px;
      margin-left: 67px;
    }
    &-dropdown {
      position: relative;
      height: var(--height);
      margin-right: 39px;
      line-height: var(--height);
      text-align: center;
      color: #fff;
      cursor: pointer;

      .iconfont {
        position: relative;
        color: #727AA6;
        font-size: 20px;
      }
      &-list {
        display: none;
        position: absolute;
        width: 120px;
        top: var(--height);
        left: 50%;
        transform: translateX(-50%);
      }
      &:hover {
        ul {
          display: block;
        }
      }
    }
    &-post {
        width: 99px;
        height: 26px;
        margin-top: 17px;
        margin-right: 39px;
        line-height: 24px;
        text-indent: 12px;
        background: #FEB300;
        border-radius: 62px;
        font-weight: 600;
        font-size: 14px;
        color: #141C32;
        cursor: pointer;

        .logo {
          vertical-align: middle;
          font-size: 14px;
          margin-right: 4px;
        }
    }
    &-user {
      position: relative;
      padding-bottom: 15px;
      margin-right: 48px;
      margin-top: 17px;
      cursor: pointer;

      &-avatar {
        width: 26px;
        height: 26px;
      }
      &-list {
        display: none;
        position: absolute;
        width: 121px;
        top: 43px;
        left: 50%;
        transform: translateX(-50%);
      }
      &:hover ul {
        display: block;
      }
    }
    &-notLogin {
      color: #fff;
      font-size: 14px;
      margin-top: 23px;
      margin-right: 20px;

      span {
        cursor: pointer;
      }
      & span:first-child {
        margin-right: 10px;
      }
      & span:last-child {
        margin-left: 10px;
      }
    }
  }
  .content {
    flex: 1;
  }
  .footer {
    height: 45px;
    border-top: 1px #eee solid;
    line-height: 45px;
    font-size: 12px;
    text-align: center;
    color: #394A58;
  }
  .modal {
    &-ipt {
      margin-bottom: 15px;
    }
    &-bottom {
      margin-top: 30px;
      margin-bottom: -7px;
      text-align: center;
      font-size: 12px;
      color: #369BE9;
      cursor: pointer;
    }
  }
  .msgBox {
    &-num {
      position: absolute;
      width: 7px;
      height: 7px;
      top: -4px;
      right: -2px;
      background: #F04B59;
      border: 2px solid #1F2B4B;
      border-radius: 50%;
    }
  }
}
</style>
<style lang="less">
.w-e-text {
    @import './assets/css/editor.less';
}
</style>
