<template>
  <div id="page_msgCenter">
    <div class="msgBox">
       <tab :data="['消息通知']"></tab>
      <dataList class="list" :asyncData="getComments">
        <div slot-scope="{item}" class="list-item">
          <div class="list-item-title">
            <span class="replyer">{{item.from.username | emial2user}}</span>  {{item.comment?'回复了你的评论':'评论了你的文章'}} 
            <router-link class="title" :to="{ name: 'articalIndex', params: { id: item.post._id }}" @click.native="setRead(item)">「{{item.post.title}}」</router-link>
          </div>
          <span class="list-item-time">{{getTimeAgo(item.meta.createAt)}}</span>
          <span v-if="!item.isRead" class="list-item-readStatus"></span>
        </div>
      </dataList>
    </div>
  </div>
</template>
<script lang="ts">
import tab from '@/components/tab.vue';
import dataList from '@/components/dataList.vue';
import timeago from 'timeago.js';
import { Component, Vue } from 'vue-property-decorator';

const timeagoInstance = timeago(null, 'zh_CN');

@Component({
  components: {
    tab,
    dataList,
  }
})
export default class msgCenter extends Vue {
  getComments({ page, pageSize }) {
    return $api.postCommentSearchUser({
        page,
        pageSize
    }, {needLogin: true});
  }
  getTimeAgo(time: string) {
    return timeagoInstance.format(time);
  }
  async setRead(item) {
    if (!item.isRead) {
      const num = await this.$store.dispatch('getUnReadAmount');
      this.$store.commit('updateUnReadAmount', num - 1);
      await $api.putCommentRead$(item._id);
    }
  }
}
</script>
<style lang="less" scoped>
#page_msgCenter {
  width: 770px;
  margin: 0 auto;

  .msgBox {
    padding: 15px;
    margin: 30px auto;
    border: 1px solid #EEE;
    border-radius: 4px;
  }
  .list-item {
    position: relative;
    display: flex;

    &-title {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .replyer {
        color: #394A58;
        font-weight: 600;
      }
      .title {
        font-weight: 600;
      }
    }
    &-time {
      margin-right: 19px;
    }
    &-readStatus {
      position: absolute;
      width: 7px;
      height: 7px;
      top: 2px;
      right: 6px;
      background: #F04B59;
      border-radius: 50%;
    }
  }
}
</style>
