<template>
    <span class="compt-button"><slot></slot></span>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
}
</script>
<style lang="less" scoped>
.compt-button {
    display: inline-block;
    width: 100%;
    height: 45px;
    font-size: 14px;
    color: #FFF;
    text-align: center;
    line-height: 45px;
    background: #F04B59;
    box-shadow: 0 20px 13px -18px #E08181;
    border-radius: 4px;
    cursor: pointer;
}
</style>
