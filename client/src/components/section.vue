<template>
  <div class="compt-section">
      <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Section extends Vue {
}
</script>
<style lang="less" scoped>
.compt-section {
    height: 158px;
    box-sizing: border-box;
    background: url('/img/section-bg.png') center bottom no-repeat #19233F;
    background-size: 990px 171px;
}
</style>

