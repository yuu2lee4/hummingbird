<template>
    <input type="text" class="compt-input" :value="value" @input="valInput">
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Input extends Vue {
    @Prop() private value!: string;
    valInput(e) {
        this.$emit('input', e.target.value);
    }
}
</script>
<style lang="less" scoped>
.compt-input {
    width: 100%;
    height: 43px;
    font-size: 14px;
    padding: 0;
    outline: none;
    text-indent: 13px;
    border: 1px solid #E1E6F0;
    border-radius: 4px;

    &::-webkit-input-placeholder {
        color: #A6B0BD;
    }
}
</style>
