<template>
    <div id="page_artical_post">
        <div class="post-top">
            <div class="post-top-left">
                <select v-model="post.category" class="post-top-select">
                    <option value="">选择分类</option>
                    <option :value="category._id" v-for="category in categoryList" :key="category._id">{{category.name}}</option>
                </select>
            </div>
            <i class="iconfont "></i>
            <input type="text" placeholder="输入文章标题" v-model="post.title" class="post-top-ipt">
        </div>
        <div class="editor"></div>
        <table class="table">
            <tr class="table-item">
                <td class="table-item-label" width="85">文章标签：</td>
                <td class="table-item-cont">
                    <div class="tags">
                        <div class="tags-tag" v-for="(tag,i) in post.tags" :key="i">
                            <input-element v-model="post.tags[i]" class="tags-tag-cont"></input-element>
                            <i class="iconfont close tags-tag-del" @click="delTag(i)"></i>
                        </div>
                        <div class="common-addBtn pull-left" @click="addTag">
                            <i class="iconfont plus common-addBtn-icon"></i>
                            添加标签
                        </div><br><br>
                        <span class="tags-notice">最多添加5个标签</span>
                    </div>
                </td>
            </tr>
            <tr class="table-item">
                <td class="table-item-label">附件上传：</td>
                <td class="table-item-cont">
                    <file-upload
                    post-action="/api/upload/attachment"
                    multiple
                    name="attachments"
                    :size="1024 * 1024 * 10"
                    v-model="files"
                    @input-filter="inputFilter"
                    @input-file="inputFile"
                    ref="uploader">
                        <div class="common-addBtn pull-left">
                            <i class="iconfont plus common-addBtn-icon"></i>
                            添加附件
                        </div>
                    </file-upload>
                    <ul class="fileList">
                        <li class="fileList-item clearfix" v-for="file in files" :key="file.id">
                            <div class="fileList-item-cont">
                                <span class="fileList-item-name">{{file.name}}</span>
                                <span class="fileList-item-size" v-if="file.size">({{file.size | formatSize}})</span>
                                <span class="fileList-item-status upload">
                                    <span class="fileList-item-btn" v-if="file.active" @click.prevent="$refs.uploader.update(file, {active: false})">中止<i class="iconfont ic-loading loading"></i></span>
                                    <span class="fileList-item-btn" v-else-if="file.error && file.error !== 'compressing' && $refs.uploader.features.html5" @click.prevent="$refs.uploader.update(file, {active: true, error: '', progress: '0.00'})">重新上传</span>
                                    <span class="fileList-item-btn clipEl" v-else-if="file.success && file.response && file.response[0]" :data-clipboard-text="file.response[0]">复制链接</span>
                                    <span class="fileList-item-btn" v-else-if="file.error !== 'compressing'" @click.prevent="$refs.uploader.update(file, {active: true})">上传</span>
                                </span>
                            </div>
                            <i class="iconfont close fileList-del" @click="delAttachment(file)"></i>
                        </li>
                    </ul>
                </td>
            </tr>
        </table>
        <div class="post-btn" @click="submit"><i class="iconfont ic-plane" style="margin-right:9px"></i>发布文章</div>
    </div>
</template>
<script lang="ts">
import Editor from 'wangeditor';
import Clipboard from 'clipboard';
import fileUpload from 'vue-upload-component';
import { Component, Vue } from 'vue-property-decorator';
import inputElement from '@/components/inputElement.vue';

let clipboard;

@Component({
    components: {
        inputElement,
        fileUpload
    }
})
export default class articalPost extends Vue {
    files = []
    post = {
        title: '',
        category: '',
        tags: []
    }
    categoryList = []
    editor = undefined
    async beforeRouteEnter(to, from, next) {
        if (!window.$store.state.account) {
            Vue.toast('登录之后才能发表文章！', { className: 'et-warn' });
            return next({ name: 'home' });
        }
        const categoryList = await $api.postCategoryList();
        next((vm) => {
            vm.categoryList = categoryList;
        });
    }
    mounted() {
        this.editor = new Editor('#page_artical_post .editor');
        this.editor.customConfig.uploadImgServer = '/api/upload/imgs';
        this.editor.customConfig.uploadImgMaxLength = 5;
        this.editor.customConfig.uploadFileName = 'imgs';
        this.editor.customConfig.debug = location.href.indexOf('editor_debug_mode=1') > -1;
        this.editor.create();
    }
    beforeDestroy() {
        if(clipboard) clipboard.destroy();
    }
    addTag() {
        if (this.post.tags.length > 4) {
            return this.$toast('最多添加5个标签', { className: 'et-warn' });
        }
        this.post.tags.push('');
    }
    delTag(i) {
        this.post.tags.splice(i, 1);
    }
    async submit() {
        if (!this.post.category) return this.$toast('请选择文章分类！', { className: 'et-warn' });
        if (!this.post.title) return this.$toast('请填写文章标题！', { className: 'et-warn' });
        if (this.editor.txt.html() === '<p><br></p>') return this.$toast('请填写文章内容！', { className: 'et-warn' });
        
        this.post.content = this.editor.txt.html();
        const tags = [];
        for (const tag of this.post.tags) {
            const val = tag.trim();
            if (val) {
                tags.push(val);
            }
        }
        this.post.tags = tags;

        this.post.attachments = [];
        for (const file of this.files) {
            if (file.success && file.response && file.response[0]) {
                this.post.attachments.push(file.response[0]);
            }
        }
        const id = await $api.postPost(this.post);
        this.$toast('保存成功！', { className: 'et-success' });
        this.$router.push({ name: 'articalIndex', params: { id }});
    }
    inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
            // Before adding a file
            // 添加文件前
            // Filter system files or hide files
            // 过滤系统文件 和隐藏文件
            if (/(\/|^)(Thumbs\.db|desktop\.ini|\..+)$/.test(newFile.name)) {
                return prevent()
            }
            // Filter php html js file
            // 过滤 php html js 文件
            if (/\.(php5?|html?|jsx?)$/i.test(newFile.name)) {
                return prevent()
            }
        }
    }
    inputFile(newFile, oldFile) {
        if (newFile && oldFile) {
            // 更新文件
            // 上传成功
            if (newFile.success !== oldFile.success && newFile.response && newFile.response[0]) {
                this.$nextTick(() => {
                    if (clipboard) clipboard.destroy();
                    const clipEls = document.querySelectorAll('.clipEl');
                    clipboard = new Clipboard(clipEls);
                    clipboard.on('success', () => {
                        Vue.toast('复制成功！', { className: 'et-success' });
                    });
                    clipboard.on('error', () => {
                        Vue.toast('复制失败！', { className: 'et-warn' });
                    });
                })
            }
            // 上传错误
            if (newFile.error !== oldFile.error) {
                this.$toast(`上传失败：${newFile.error}`, { className: 'et-alert' });
            }
        }
    }
    delAttachment(file) {
        this.$refs.uploader.remove(file);
        if (file.success && file.response && file.response[0]) {
            $api.postUploadRemove({ path: file.response[0] });
        }
    }
}
</script>
<style lang="less" scoped>
#page_artical_post {
    width: 770px;
    margin: 0 auto;
    padding: 33px 0;

    .common-addBtn {
        font-size: 15px;
        color: #3DAAFF;
        line-height: 21px;
        cursor: pointer;

        &-icon {
            width: 15px;
            height: 15px;
            line-height: 15px;
            display: inline-block;
            background: #3DAAFF;
            border-radius: 2px;
            color: #fff;
            text-align: center;
            font-size: 14px;
        }
    }

    .post-top {
        height: 38px;
        display: flex;
        border: 1px solid #ccc;
        margin-bottom: 20px;

        &-left {
            position: relative;
            width: 110px;

            &:after {
                position: absolute;
                right: 0;
                top: 11px;
                content: '';
                height: 19px;
                border-right: 1px solid #D1D1D1;
            }
        }
        &-select {
            width: 97px;
            height: 38px;
            text-indent: 5px;
            font-size: 16px;
            color: #394A58;
            border: none;
            outline: none;
            background: transparent;
        }
        &-ipt {
            flex: 1;
            padding-left: 14px;
            border: none;
            outline: none;
            background: transparent;
            font-size: 16px;
            color: #394A58;
        }
    }
    .table {
        margin: 25px 0;
        &-item {
            &-label {
                font-size: 15px;
                line-height: 21px;
                vertical-align: top;
                color: #394A58;
            }
        }
    }
    .tags {
        padding-bottom: 26px;
        &-tag {
            float: left;
            margin-right: 10px;

            &-cont {
                padding: 0 8px;
                height: 23px;
                line-height: 23px;
                background: #e9e9e9;
                font-size: 12px;
                color: #1D2941;
                border-radius: 2px;
                vertical-align: middle;
            }
            &-del {
                color: #E8E8E8;
                vertical-align: middle;
                font-size: 18px;
            }
        }
        &-notice {
            font-size: 13px;
            color: #848C97;
        }
    }
    .post-btn {
        width: 177px;
        height: 43px;
        margin-left: 76px;
        line-height: 43px;
        text-align: center;
        font-size: 14px;
        border: 1px solid #F04B59;
        border-radius: 4px;
        color: #F04B59;
        cursor: pointer;
        transition: color .15s ease-in-out,background-color .15s ease-in-out;

        &:hover {
            background: #F04B59;
            color: #fff;
        }
    }
    .fileList {
        &-item {
            margin-top: 10px;

            &-cont {
                float: left;
                width: 303px;
                height: 26px;
                padding: 0 8px;
                font-size: 12px;
                line-height: 26px;
                background: #EEE;
                border-radius: 4px;
            }
            &-name {
                color: #141C32;
            }
            &-size {
                color: #848C97
            }
            &-status {
                float: right;
            }
            &-btn {
                color: #3DAAFF;
                cursor: pointer;
            }
        }
        &-del {
            float: left;
            color: #E8E8E8;
            margin-top: 4px;
            margin-left: 3px;
            cursor: pointer;
        }
    }
}
</style>
