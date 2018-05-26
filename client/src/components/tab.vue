<template>
    <ul class="compt-tab clearfix">
        <li v-for="(tab, i) in data" :class="['compt-tab-item', {'compt-tab-item-active': value === i}]" @click="itemClick(i)" :key="tab">{{tab}}</li>
    </ul>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { RawLocation } from 'vue-router';

@Component
export default class List extends Vue {
  @Prop({default: ()=>[]}) private data: string[];
  @Prop({default: 0}) private value: number;
  itemClick(index: number) {
      this.$emit('input', index);
  }
}
</script>
<style lang="less" scoped>
.compt-tab {
    border-bottom: 1px solid #eee;

    &-item {
    float: left;
    padding: 14px 0;
    margin-right: 10px;
    font-size: 16px;
    color: #394A58;
    cursor: pointer;

        &-active {
            border-bottom: 3px solid #F04B59;
        }
    }
}
</style>
