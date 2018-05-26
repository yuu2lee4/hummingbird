<template>
  <div id="page_home">
    <my-section class="section">
      <search class="section-search" placeholder="输入关键词搜索" @keyup.enter.native="submit"
      v-model="searchVal" :input-style="searchStyle" :show-search-btn="false"></search>
    </my-section>
    <div class="main">
      <ul class="categoryList">
        <li v-for="category in categoryList" :key="category.en" class="categoryList-item" 
        @click="itemClick(category)"
        :style="itemStyle(category)">
          <div class="categoryList-item-label">{{category.name}}</div>
          <div class="categoryList-item-en">{{category.en.toUpperCase()}}</div>
        </li>
      </ul>
      <recent-article style="width:270px"></recent-article>
    </div>
  </div>
</template>
<script lang="ts">
import mySection from '@/components/section.vue';
import recentArticle from '@/components/recentArticle.vue';
import search from '@/components/search.vue';
import { Component, Vue } from 'vue-property-decorator';

const categoryStyle = {
  '前端': {
      backgroundColor: '#FC6A7F',
      backgroundImage: '/img/category/ic-classify-frontend@2x.png',
  },
  '设计': {
      backgroundColor: '#D273E5',
      backgroundImage: '/img/category/ic-classify-design@2x.png',
  },
  '产品': {
      backgroundColor: '#3DAAFF',
      backgroundImage: '/img/category/ic-classify-product@2x.png',
  },
  '安卓': {
      backgroundColor: '#89D04F',
      backgroundImage: '/img/category/ic-classify-android@2x.png',
  },
  'IOS': {
      backgroundColor: '#7F8EA0',
      backgroundImage: '/img/category/ic-classify-ios@2x.png',
  },
  '运维': {
      backgroundColor: '#7E73E5',
      backgroundImage: '/img/category/ic-classify-operations@2x.png',
  },
  '测试': {
      backgroundColor: '#FFAD50',
      backgroundImage: '/img/category/ic-classify-test@2x.png',
  },
  '后端': {
      backgroundColor: '#65C1CD',
      backgroundImage: '/img/category/ic-classify-backend@2x.png',
  },
}
@Component({
  components: {
    mySection,
    search,
    recentArticle
  }
})
export default class Home extends Vue {
  searchVal = '';
  searchStyle = {
    height: '52px',
    fontSize: '15px',
    textAlign: 'center',
  };
  categoryList = [];
  async beforeRouteEnter(to, from, next) {
      const categoryList = await $api.postCategoryList();
      next((vm) => {
          vm.categoryList = categoryList;
      });
  }
  itemStyle(item: any) {
    return {
      background: `url(${categoryStyle[item.name].backgroundImage}) bottom right no-repeat ${categoryStyle[item.name].backgroundColor}`,
      backgroundSize: '134px 117px',
    }
  }
  itemClick(item: any) {
    this.$router.push({
      name: 'list',
      query: {
        id: item._id,
        name: item.name,
        type: 'category',
      },
    });
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
<style lang="less" scoped>
#page_home {
  .main {
    display: flex;
    max-width: 1170px;
    padding-top: 51px;
    margin: 0 auto;
  }
  .section {
    padding-top: 52px;

    &-search {
      width: 461px;
      margin: 0 auto;
      background: rgba(0,0,0,.4);
    }
  }
  .categoryList {
    flex: 1;

    &:hover {
      > li {
        will-change: transform;
      }
    }

    &-item {
      float: left;
      box-sizing: border-box;
      width: 30%;
      height: 117px;
      padding-top: 40px;
      padding-left: 2.44%;
      margin-right: 3.33%;
      margin-bottom: 30px;
      border-radius: 2px;
      transition: transform 0.3s;
      cursor: pointer;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 20px 16px -16px #d2d2d2;
      }
      &-label {
        font-size: 26px;
        font-weight: 600;
        line-height: 37px;
        color: #FFF;
        letter-spacing: 1.46px;
      }
      &-en {
        opacity: .8;
        font-family: AlrightSans-Medium;
        font-size: 18px;
        line-height: 22px;
        color: #FFF;
        letter-spacing: 1.46px;
      }
    }
  }
}
</style>
