<template>
  <div id="page_space">
      <div class="user-box">
        <img src="../../public/img/default-avatar.png" alt="">
        <div class="username">{{ nickname }}</div>
        <p>共投稿 {{ total }} 篇文章</p>
      </div>
      <div class="right-part">
        <tab :data="tabs" v-model="tabIndex"></tab>
        <dataList v-show="tabIndex === 0" :asyncData="getPosts" class="list" ref="postList">
          <div slot-scope="{item}" class="list-item">
            <div class="list-item-cont">
              <router-link :to="{ name: 'articalIndex', params: { id: item._id }}">{{item.title}}</router-link>
            </div>
            <i @click.stop="edit(item)" class="list-item-fn iconfont ic-post-edit"></i>
            <i @click.stop="openRemoveModal(item)" class="list-item-fn iconfont ic-post-del"></i>
          </div>
        </dataList>
        <dataList v-show="tabIndex === 1" :asyncData="getCollects" class="list" ref="collectList">
          <div slot-scope="{item}" class="list-item">
            <div class="list-item-cont">
              <router-link :to="{ name: 'articalIndex', params: { id: item.post._id }}">{{item.post.title}}</router-link>
            </div>
            <i @click.stop="openCollectModal(item)" class="list-item-fn iconfont ic-post-del"></i>
          </div>
        </dataList>
      </div>
      <modal class="modal" :visible.sync="removeModalVisible" @confirm="remove">
        <div style="padding-left:30px;color:#394A58">确定要删除？</div>
      </modal>
      <modal class="modal" :visible.sync="collectModalVisible" @confirm="removeCollect">
        <div style="padding-left:30px;color:#394A58">确定要取消收藏？</div>
      </modal>
  </div>
</template>
<script lang="ts">
import modal from '@/components/modal.vue';
import tab from '@/components/tab.vue';
import dataList from '@/components/dataList.vue';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    tab,
    modal,
    dataList,
  }
})
export default class List extends Vue {
  removeModalVisible = false;
  removeItem = null;
  collectModalVisible = false;
  removeCollectItem = null;
  total = 0;
  nickname = '';
  tabs = ['我的文章', '我的收藏']
  tabIndex = 0;

  async beforeRouteEnter(to, from, next) {
    if (!window.$store.state.account) {
      Vue.toast('请先登录！', { className: 'et-warn' });
      return next(false);
    }
    next((vm) => {
      vm.nickname = window.$store.state.account.username;
      $api.getCollectSearch();
    });
  }
  async getPosts({ page, pageSize }) {
    const res = await $api.getPostSearch({
        type: 'author',
        page,
        pageSize
    }, {needLogin: true});
    this.total = res.total;
    return res;
  }
  getCollects({ page, pageSize }) {
    return $api.getCollectSearch({
        page,
        pageSize
    }, {needLogin: true});
  }
  edit(item) {
    this.$router.push({ name: 'articalEdit', params: { id: item._id }});
  }
  openRemoveModal(item) {
    this.removeModalVisible = true;
    this.removeItem = item;
  }
  openCollectModal(item) {
    this.collectModalVisible = true;
    this.removeCollectItem = item;
  }
  async remove() {
    await $api.deletePost$(this.removeItem._id);
    this.removeModalVisible = false;
    this.$toast('删除成功', { className: 'et-success' });

    if (this.$refs.postList.list.length === 1  && this.$refs.postList.page !== 1) {
      this.$refs.postList.reload(this.$refs.postList.page - 1);
    } else {
      this.$refs.postList.reload();
    }
  }
  async removeCollect() {
    await $api.deleteCollect$(this.removeCollectItem._id);
    this.collectModalVisible = false;
    this.$toast('取消收藏成功', { className: 'et-success' });

    if (this.$refs.collectList.list.length === 1  && this.$refs.collectList.page !== 1) {
      this.$refs.collectList.reload(this.$refs.collectList.page - 1);
    } else {
      this.$refs.collectList.reload();
    }
  }
}
</script>
<style lang="less" scoped>
#page_space {
  margin: 30px auto 40px;
  display: flex;
  width: 970px;
  // max-height: 620px;
  overflow: hidden;
  .right-part {
    width: 670px;
    box-sizing: border-box;
    padding: 3px 15px 15px;
    border: 1px solid #EEE;
    border-radius: 4px;
  }
  .sub-list {
    width: 270px;
  }
  .user-box {
    width: 270px;
    height: 325px;
    border: 1px solid #eee;
    border-radius: 4px;
    margin-right: 30px;
    text-align: center;
    > img {
      width: 108px;
      height: 108px;
      margin: 54px auto 33px;
    }
    > div {
      font-size: 16px;
      color: #394A58;
      margin-bottom: 55px;
    }
    > p {
      font-size: 14px;
      color: #848C97;
    }
  }
  .list {
    &-item {
      display: flex;
      &-cont {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &-fn {
        margin-right: 14px;
        color: #848c97;
        cursor: pointer;

        &:hover {
          color: #394a58;
        }
      }
    }
  }
}
</style>
