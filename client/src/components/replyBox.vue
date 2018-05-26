<template>
    <div class="compt-replyBox">
        <textarea class="input" placeholder="写下你的评论…" :value="value" @input="valInput"></textarea>
        <span :class="['btn btn-confirm', {disabled: !value}]" @click="confirm">回复</span>
        <span class="btn btn-cancel" @click="cancel">取消</span>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class replyBox extends Vue {
    @Prop() private value!: string;
    valInput(e) {
        this.$emit('input', e.target.value);
    }
    confirm() {
        if (this.value) this.$emit('confirm');
    }
    cancel() {
        this.$emit('input', '');
        this.$emit('cancel');
    }
}
</script>
<style lang="less" scoped>
.compt-replyBox {
    padding-bottom: 7px;
    .input {
        width: 100%;
        height: 45px;
        box-sizing: border-box;
        padding: 5px;
        font-size: 14px;
        border: none;
        border: 1px solid #eee;
        border-radius: 4px;
        outline: none;
    }
    .btn {
        display: inline-block;
        width: 80px;
        height: 35px;
        margin-top: 20px;
        margin-right: 3px;
        border: 1px solid #F04B59;
        color: #F04B59;
        border-radius: 4px;
        box-sizing: border-box;
        line-height: 33px;
        text-align: center;
        cursor: pointer;

        &.disabled {
            border-color: #eee;
            color: #C2C6CC;
            cursor: default;

            &:hover {
                background: transparent;
                color: #C2C6CC;
            }
        }

        &-confirm:hover {
            background: #F04B59;
            color: #fff;
        }
        &-cancel {
            border-color: transparent;
            color: #848C97;

            &:hover {
                color: #394A58
            }
        }
    }
}
</style>

