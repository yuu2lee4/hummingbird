<template>
    <my-list title="近期文章" :data="data" @item-click="itemClick">
        <i v-if="isLoading" class="iconfont ic-loading loading"></i>
        <div v-else-if="!data.length" class="cont-empty">
          <img src="../../public/img/img-empty-1@2x.png" alt="">
          <p>暂时没有内容</p>
        </div>
    </my-list>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import myList from './titleList.vue';

interface DataType {
    height: number,
}

@Component({
    components: {
        myList,
    }
})
export default class recentArticle extends Vue {
    isLoading:boolean = true;
    data:object[] = [];
    async mounted() {
        const { results } = await $api.getPostSearch({ pageSize: 5 }).catch(() => {});
        this.data = results || [];
        this.isLoading = false;
    }
    itemClick(i) {
        this.$router.push({ name: 'articalIndex', params: { id: this.data[i]._id }});
    }
}
</script>

<style lang="less" scoped>
.loading {
    left: 50%;
    position: relative;
    margin-left: -8px;
    top: 30px;
}
.cont-empty {
  padding: 60px 0;
  text-align: center;
  img {
    width: 110px;
    margin-bottom: 46px;
  }
  p {
    font-size: 14px;
    color: #848C97;
  }
}
</style>
