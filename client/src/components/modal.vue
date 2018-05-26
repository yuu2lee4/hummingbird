<template>
    <div class="compt-modal" v-if="visible">
        <div class="compt-modal-mask" @click="closeModal"></div>
        <div class="compt-modal-container" :style="containerStyle">
            <div class="compt-modal-header" v-if="title">{{title}}</div>
            <div class="compt-modal-body">
                <slot></slot>
            </div>
            <div class="compt-modal-footer clearfix" v-if="hasFooter">
                <slot name="footer">
                    <span class="compt-modal-footer-btn compt-modal-footer-btn-confirm" @click="confirm">确定</span>
                    <span class="compt-modal-footer-btn compt-modal-footer-btn-cancel" @click="cancel">取消</span>
                </slot>
            </div>
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
    props: {
        title: String,
        visible: {
            type: Boolean,
            default: false,
        },
        hasFooter: {
            type: Boolean,
            default: true,
        },
        containerStyle: [Object, String]
    }
})
export default class Modal extends Vue {
    closeModal() {
        this.$emit('update:visible', false);
    }
    confirm() {
        this.$emit('confirm');
    }
    cancel() {
        this.$emit('cancel');
        this.closeModal();
    }
}
</script>
<style lang="less" scoped>
.compt-modal {

    &-mask {
        position: fixed;
        top:0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, .4);
        z-index: 15000;
    }
    &-container {
        position: fixed;
        width: 350px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #FFF;
        border: 1px solid #979797;
        border-radius: 4px;
        z-index: 15001;
    }
    &-header {
        height: 62px;
        line-height: 64px;
        font-size: 20px;
        color: #394A58;
        letter-spacing: 8px;
        text-align: center;
        border-bottom: 1px solid #EEE;
        overflow: hidden;
    }
    &-body {
        padding: 30px 0;
    }
    &-footer {
        padding: 10px 0;
        border-top: 1px solid #EEE;

        &-btn {
            width: 60px;
            height: 30px;
            float: right;
            margin-right: 10px;
            line-height: 30px;
            font-size: 14px;
            border: 1px solid #F04B59;
            text-align: center;
            border-radius: 5px;
            cursor: pointer;

            &-confirm {
                background: #F04B59;
                color: #fff;
            }
            &-cancel {
                color: #F04B59;

                &:hover {
                    background: #F04B59;
                    color: #fff;
                }
            }
        }
    }
}
</style>
