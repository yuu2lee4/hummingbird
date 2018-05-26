<template>
    <div class="compt-datalist">
        <i v-if="showLoading" class="iconfont ic-loading loading"></i>
        <div v-else-if="!list.length" class="compt-datalist-empty">
            <img src="../../public/img/img-empty-1@2x.png" alt="">
            <p>暂时没有内容</p>
        </div>
        <ul v-else class="compt-datalist-list">
            <li class="compt-datalist-list-item" v-for="(item, i) in list" :key="item[clue]">
                <slot :index="i" :item="item">
                    {{item[filed]}}
                </slot>
            </li>
        </ul>
        <myPagination v-if="totalPage > 1" :totalPage="totalPage" @btnClick="fetchData"></myPagination>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import myPagination from '@/components/pagination.vue';

@Component({
  components: {
    myPagination,
  }
})
export default class dataList extends Vue {
    showLoading = true;
    page = 1;
    pageSize = 10;
    total = 0;
    totalPage = 0;
    list:object[] = [];
    @Prop({default: ()=>Promise.resolve([])}) private asyncData: ()=>Promise<any>;
    @Prop({default: 'title'}) private filed!: string;
    @Prop({default: '_id'}) private clue!: string;

    mounted() {
        this.fetchData();
    }
    async fetchData(page: number = this.page) {
        this.showLoading = true;
        const res = await this.asyncData({ page, pageSize: this.pageSize});
        this.total = res.total;
        this.totalPage = Math.ceil(res.total / res.pageSize);
        this.list = res.results;
        this.showLoading = false;
    }
    reload(page) {
        this.fetchData(page);
    }
}
</script>
<style lang="less" scoped>
.compt-datalist {
    .loading {
        left: 50%;
        position: relative;
        margin-left: -8px;
    }
    &-list {
        &-item {
            padding: 18px 0;
            font-size: 12px;
            color: #394A58;
            border-bottom: 1px solid #eee;

            a {
                color: #394A58;
                text-decoration: none;

                &:hover {
                    color: #f04b59;
                }
            }
        }
    }
    &-empty {
        height: 600px;
        margin-top: 65px;
        text-align: center;

        img {
            width: 130px;
            height: 141px;
            margin-bottom: 46px;
        }
        p {
            font-size: 14px;
            color: #848c97;
        }
    }
}
</style>
