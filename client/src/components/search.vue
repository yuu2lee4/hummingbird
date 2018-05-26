<template>
    <div class="compt-search" :style="widthStyle">
        <input type="text" class="compt-search-ipt" :placeholder="placeholder" :value="value" @input="valInput" :style="inputStyle">
        <i class="iconfont ic-search compt-search-icon" v-if="showSearchBtn"></i>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Search extends Vue {
    @Prop() private width!: string | number;
    @Prop() private placeholder!: string;
    @Prop() private value!: string;
    @Prop() private inputStyle!: {};
    @Prop({ default: true }) private showSearchBtn!: boolean;
    get widthStyle() {
        if (this.width) {
            return { width: `${this.width}px`}
        }
        return '';
    }
    valInput(e) {
        this.$emit('input', e.target.value);
    }
}
</script>
<style lang="less" scoped>
.compt-search {
    display: flex;
    box-sizing: border-box;
    padding: 0 18px;
    background: #626b81;
    border-radius: 100px;

    &-ipt {
        flex: 1;
        height: 34px;
        color: #fff;
        background: none;
        border: none;
        outline: none;

        &::-webkit-input-placeholder {
            color: #fff;
        }
    }
    &-icon {
        color: #fff;
        font-size: 20px;
        line-height: 36px;
        cursor: pointer;
    }
}
</style>

