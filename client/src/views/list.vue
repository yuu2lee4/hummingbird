<template>
  <div id="page_list">
      <my-section class="section">
        <div class="page_list__title">
          <h2 v-if="type === 'category'">{{ name }}</h2>
          <h2 v-else-if="type === 'title'">关键词： {{ id }}</h2>
        </div>
      </my-section>

      <div class="page_list__content">
        <myList :data="mainList" :isMarkKeyword="type === 'title'" 
        :keyword="id" :class="['main-list', showLoading ? 'cont-loading' : '']">
          <i v-if="showLoading" class="iconfont ic-loading loading"></i>
          <div v-if="!showLoading && mainList.length < 1" class="cont-empty">
            <img src="../../public/img/img-empty-1@2x.png" alt="">
            <p>暂时没有内容</p>
          </div>
          <myPagination v-if="totalPage > 1" :totalPage="totalPage" @btnClick="getNewPage"></myPagination>
        </myList>
        <!-- <myList :data="subList" :title="subTitle" class="sub-list"></myList> -->
        <recent-article style="width:270px;float:right"></recent-article>
      </div>
      
  </div>
</template>
<script lang="ts">
import mySection from '@/components/section.vue';
import myList from '@/components/titleList.vue';
import myPagination from '@/components/pagination.vue';
import recentArticle from '@/components/recentArticle.vue';
import format from 'date-fns/format';
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
    mySection,
    myList,
    myPagination,
    recentArticle,
  }
})
export default class List extends Vue {
  id = '';
  name = '';
  type = '';
  page = 1;
  pageSize = 10;
  total = 0;
  totalPage = 0;
  showLoading = true;
  mainList:object[] = [];

  beforeRouteEnter(to, from, next) {
    next((vm: any) => {
      vm.id = to.query.id;
      vm.name = to.query.name;
      vm.type = to.query.type;
    });
  }

  async beforeRouteUpdate(to, from, next) {
    this.id = to.query.id;
    this.name = to.query.name;
    this.type = to.query.type;

    this.getArticalList(this.page);
    next();
  }

  mounted() {
      this.$nextTick(() => {
        this.getArticalList(this.page);
      })
  }
  async getArticalList(page: number) {
    const data = await $api.getPostSearch({
      type: this.type,
      value: this.id,
      page,
      pageSize: this.pageSize,
    });
    this.total = data.total;
    this.totalPage = Math.ceil(this.total / this.pageSize);
    
    let list = data.results || [];
    if (list.length > 0) {
      list = list.map(item => {
        item.time = format(item.meta.createAt, 'YYYY/MM/DD');
        return item;
      });
    }
    this.mainList = list;
    this.showLoading = false;
  }
  
  getNewPage(n: any) {
    this.getArticalList(n);
  }
}
</script>
<style lang="less" scoped>
#page_list {
  .page_list__title {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 158px;
    h2 {
      font-size: 29px;
      color: #FFFFFF;
      font-weight: normal;
    }
  }

  .page_list__content {
    margin: 30px auto 40px;
    display: flex;
    width: 970px;
    max-height: 620px;
    overflow: hidden;
    .main-list {
      width: 670px;
      margin-right: 30px;
    }
    .cont-loading {
      height: 600px;
      text-align: center;
      padding-top: 270px;
    }
    .cont-empty {
      text-align: center;
      margin-top: 65px;
      height: 600px;
      img {
        width: 130px;
        height: 141px;
        margin-bottom: 46px;
      }
      p {
        font-size: 14px;
        color: #848C97;
      }
    }
    .sub-list {
      width: 270px;
    }
  }
}
</style>

