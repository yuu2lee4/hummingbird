<template>
  <div class="compt-title-list" :style="heightStyle">
    <div v-if="title" class="compt-title-list-title"><span>{{ title }}</span></div>
    <ul>
      <li class="compt-title-list-item" v-for="(item, index) in data" 
      :key="item._id"
      @click="itemClick(index)">
        <span v-if="isMarkKeyword" class="main-text" v-html="markKeyword(item.title)"></span>
        <span v-else class="main-text">{{ item.title }}</span>
        <span v-if="item.time" class="sub-text">{{item.time}}</span>
        <i v-if="editIcon" @click.stop="edit(item)" class="iconfont ic-post-edit"></i>
        <i v-if="delIcon" @click.stop="beforeDel(index)" class="iconfont ic-post-del"></i>
      </li>
    </ul>
    <slot></slot>

    <modal class="modal" :visible.sync="removeModalVisible" @confirm="del">
      <div style="padding-left:30px;color:#394A58">确定要删除？</div>
    </modal>
  </div>
</template>
<script lang="ts">
import modal from '@/components/modal.vue';
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

interface DataType {
    height: number,
    total: number,
    pageSize: number,
    title: string,
    keyword: string,
    isMarkKeyword: boolean,
    editIcon: boolean,
    delIcon: boolean,
    path?: string | object,
}
@Component({
    components: {
        modal
    }
})
export default class List extends Vue {
  @Prop() private height!: number;
  @Prop() private total!: number;
  @Prop() private pageSize!: number;
  @Prop() private title!: string;
  @Prop() private keyword!: string;
  @Prop() private isMarkKeyword!: boolean;
  @Prop() private editIcon!: boolean;
  @Prop() private delIcon!: boolean;
  @Prop({default: ()=>[]}) private data!: DataType[];
  removeModalVisible = false;
  removeIndex = 0;
  get heightStyle() {
      if (this.height) {
        return { height: `${this.height}px`};
      }
      if (this.title && this.data.length > 0) {
          let height = (this.data.length + 1) * 54;
          if (this.total > this.pageSize) {
            height += 80;
          }
          return { height: `${height}px`};
      }
      return '';
  }
  markKeyword(item) {
    if (this.isMarkKeyword) {
    const src = this.keyword;
    const dest = `<span style="color:red">${src}</span>`;
    return item.replace(new RegExp(src, 'g'), dest);
    }
    return item;
  }
  itemClick(i) {
    this.$router.push({ name: 'articalIndex', params: { id: this.data[i]._id }});
  }
  edit(item) {
    this.$router.push({ name: 'articalEdit', params: { id: item._id }});
  }
  beforeDel(index) {
    this.removeModalVisible = true;
    this.removeIndex = index;
  }
  async del() {
    this.removeModalVisible = false;
    await $api.deletePost$(this.data[this.removeIndex]._id);
    this.data.splice(this.removeIndex, 1);
    const newTotal = this.total - 1;
    this.$emit('del', newTotal);
    this.$toast('删除成功', { className: 'et-success' });
  }
}
</script>
<style lang="less" scoped>
.compt-title-list {
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    box-sizing: border-box;
    padding: 0 15px;
    &-title {
      height: 53px;
      line-height: 53px;
      font-size: 16px;
      color: #394A58;
      border-bottom: 1px solid #eee;
      span {
        border-bottom: 3px solid #F04B59;
        height: 52px;
        display: inline-block;
      }
    }
    &-item {
        line-height: 54px;
        font-size: 12px;
        color: #394A58;
        text-align: left;
        border-bottom: 1px solid #eee;
        display: flex;

        &:last-child {
          border-bottom: none;
        }
        .main-text {
            flex: 1;
            cursor: pointer;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-wrap: normal;
            &:hover {
              color: #F04B59;
            }
        }
        .sub-text {
            width: 68px;
            margin-left: 30px;
        }
        i {
            font-size: 14px;
            margin-right: 16px;
            color: #848c97;
            cursor: pointer;
            &:hover {
              color: #394A58;
            }
        }
    }
}
</style>


