<template>
  <ul class="compt-list">
      <li class="compt-list-item" v-for="(item, index) in data" :key="item.label" @click="itemClick(index)">{{item.label}}</li>
  </ul>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

interface DataType {
    label: string,
    path?: string | object,
}
@Component
export default class List extends Vue {
  @Prop({default: ()=>[]}) private data!: DataType[];
  itemClick(index: number) {
      if (this.data[index].path) {
          if (this.data[index].open) {
              window.open(this.data[index].path);
          } else {
            this.$router.push(<RawLocation>this.data[index].path);
          }
      }
      this.$emit('item-click', index);
  }
}
</script>
<style lang="less" scoped>
.compt-list {
    background: #FFF;
    box-shadow: 0 1px 3px 0 rgba(57,74,88,0.24);
    overflow: hidden;

    &-item {
        line-height: 32px;
        font-size: 14px;
        color: #1D2941;
        text-align: center;
        cursor: pointer;

        &:hover {
            background: #F6F6F6;
        }
    }
}
</style>
