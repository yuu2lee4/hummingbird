<template>
    <div id="page_artical_index">
        <section class="leftPart">
            <div class="artical">
                <div class="artical-title">
                    {{artical.title}}
                </div>
                <div class="artical-info clearfix">
                    <span class="artical-info-item">{{formatDate(artical.meta.createAt)}}</span><span class="artical-info-item">投稿人：{{artical.author.username | emial2user}}</span><span class="artical-info-item">分类：{{artical.category.name}}</span>
                    <template v-if="isOwnPost">
                        <span class="artical-info-fn" @click="removeModalVisible = true"><i class="iconfont ic-post-del"></i>删除</span>
                        <span class="artical-info-fn" @click="edit"><i class="iconfont ic-post-edit"></i>编辑</span>
                    </template>
                    <span v-else class="artical-info-fn" @click="collect"><i class="iconfont like"></i>收藏</span>
                </div>
                <dl class="artical-tags clearfix" v-if="artical.tags.length">
                    <dt class="iconfont ic-tag artical-tags-icon"></dt>
                    <dd class="artical-tags-item" v-for="tag in artical.tags" :key="tag">{{tag}}</dd>
                </dl>
                <div class="artical-content" v-html="artical.content"></div>
                <ul class="artical-attachments" v-if="artical.attachments.length">
                    <li class="artical-attachments-item" v-for="attachment of artical.attachments" :key="attachment">
                        <i class="iconfont ic-attachment"></i>附件：<a :href="attachment" target="_blank">{{getName(attachment)}}</a>
                    </li>
                </ul>
            </div>
            <div class="artical-reply">
                <img src="/img/default-avatar.png" alt="" class="author-avatar">
                <reply-box v-model="comment" @confirm="postComment"></reply-box>
            </div>
            <dl class="comments" v-if="comments.length">
                <dt class="comments-total">
                    共{{comments.length}}个评论
                </dt>
                <dd class="comments-item" v-for="(comment, i) in comments" :key="comment._id">
                    <img src="/img/default-avatar.png" alt="" class="author-avatar">
                    <div class="comments-item-right">
                        <div class="comments-author clearfix">
                            <div class="author-info">
                                <span class="reply_author">{{comment.from.username | emial2user}}</span>
                                <span class="reply_time">{{i+1}}楼 {{getTimeAgo(comment.meta.createAt)}} {{comment.from._id === artical.author._id ? '作者':''}}</span>
                            </div>
                            <div class="user_action">
                                <span v-if="isOwnComment(i)" class="user_action-item" @click="openRemoveCommentModal(i)"><i class="iconfont ic-post-edit"></i>删除</span>
                                <span class="user_action-item" @click="showReplyComment(i)"><i class="iconfont ic-post-reply"></i>回复</span>
                            </div>
                        </div>
                        <div class="comments-content">
                            <span class="reply-to" v-if="comment.comment">@{{comment.to.username | emial2user}}</span>{{comment.content}}
                        </div>
                        <reply-box v-model="replyVal" v-if="replyIndex === i" @confirm="postReply(i)" @cancel="replyIndex = -1"></reply-box>
                    </div>
                </dd>
            </dl>
        </section>
        <recent-article style="width:270px;float:right"></recent-article>
        <modal class="modal" :visible.sync="removeModalVisible" @confirm="remove">
            <div style="padding-left:30px;color:#394A58">确定要删除？</div>
        </modal>
        <modal class="modal" :visible.sync="removeCommentModal" @confirm="delComment">
            <div style="padding-left:30px;color:#394A58">确定要删除？</div>
        </modal>
    </div>
</template>
<script lang="ts">
import modal from '@/components/modal.vue';
import replyBox from '@/components/replyBox.vue';
import { Component, Vue } from 'vue-property-decorator';
import format from 'date-fns/format';
import timeago from 'timeago.js';
import recentArticle from '@/components/recentArticle.vue';
import { createCipheriv } from 'crypto';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-light.css';

const timeagoInstance = timeago(null, 'zh_CN');

let artical;
@Component({
    components: {
        recentArticle,
        modal,
        replyBox
    }
})
export default class articalIndex extends Vue {
    removeModalVisible = false;
    removeCommentModal = false;
    removeCommentIndex = -1;
    artical = artical;
    comment = '';
    comments = [];
    replyVal = '';
    replyIndex = -1;
    async beforeRouteEnter(to, from, next) {
        artical = await $api.getPost$(to.params.id);
        const comments = await $api.getPostComments$(to.params.id);
        next((vm) => {
            vm.comments = comments;
            vm.initHighlight();
        });
    }
    async beforeRouteUpdate(to, from, next) {
        this.artical = await $api.getPost$(to.params.id);
        this.comments = await $api.getPostComments$(to.params.id);
        this.initHighlight();
        next();
    }
    get isOwnPost() {
        return this.$store.state.account && this.$store.state.account._id === this.artical.author._id;
    }
    get isLogin() {
        return !!this.$store.state.account;
    }
    initHighlight() {
        for (const codeBlock of document.querySelectorAll('pre code')) {
            hljs.highlightBlock(codeBlock);
        }
    }
    isOwnComment(i) {
        return this.$store.state.account && this.$store.state.account._id === this.comments[i].from._id;
    }
    formatDate(str) {
        return format(str, 'YYYY/MM/DD');
    }
    async remove() {
        await $api.deletePost$(this.artical._id);
        this.$toast('删除成功', { className: 'et-success' });
        this.$router.push({ name: 'home' });
    }
    edit() {
        this.$router.push({ name: 'articalEdit', params: { id: this.artical._id }});
    }
    getName(path) {
        return path.split('/').pop();
    }
    getTimeAgo(time) {
        return timeagoInstance.format(time);
    }
    async postComment() {
        if (!this.isLogin) return this.$toast('请先登录！', { className: 'et-warn' });
        await this.submitComment(this.comment);
        this.comment = '';
    }
    async postReply(i) {
        await this.submitComment(this.replyVal, this.comments[i]);
        this.setReplyComment();
    }
    async submitComment(content: string, comment?: object) {
        const cont = content.trim();
        if (!cont) return this.$toast('评论不能为空！', { className: 'et-warn' });

        const newComment = await $api.postComment({
            post: this.artical._id,
            content: cont,
            comment: comment && comment._id,
            to: comment ? comment.from && comment.from._id : this.artical.author._id
        });
        newComment.from = {
            _id: newComment.from,
            username: this.$store.state.account.username
        }
        if (newComment.comment) {
            newComment.to = {
                _id: newComment.to,
                username: comment.from.username
            }
        }
        this.comments.unshift(newComment);
        this.$toast('评论成功！', { className: 'et-success' });
    }
    showReplyComment(i) {
        if (!this.isLogin) return this.$toast('请先登录！', { className: 'et-warn' });
        if (this.$store.state.account._id === this.comments[i].from._id) {
            return this.$toast('你不能回复自己！', { className: 'et-warn' });
        }
        if (this.replyIndex !== i) this.setReplyComment(i);

    }
    setReplyComment(index = -1, value = '') {
        this.replyIndex = index;
        this.replyVal = value;
    }
    openRemoveCommentModal(i) {
        this.removeCommentModal = true;
        this.removeCommentIndex = i;
    }
    async delComment() {
        await $api.deleteComment$(this.comments[this.removeCommentIndex]._id);
        this.comments.splice(this.removeCommentIndex, 1);
        this.removeCommentModal = false;
        this.$toast('删除成功！', { className: 'et-success' });
    }
    async collect() {
        if (!this.$store.state.account) return this.$toast('请先登录！', { className: 'et-warn' });
        await $api.postCollect$(this.artical._id);
        this.$toast('收藏成功！', { className: 'et-success' });
    }
}
</script>
<style lang="less">
#page_artical_index {
    width: 970px;
    padding: 30px 0;
    margin: 0 auto;

    .leftPart {
        float: left;
        width: 670px;
    }
    .artical {
        padding: 20px;
        border: 1px solid #eee;
        border-radius: 4px;

        &-title {
            line-height: 33px;
            font-size: 24px;
            color: #394A58;
            margin-bottom: 13px;
        }
        &-info {
            font-size: 14px;
            line-height: 20px;
            margin-bottom: 11px;
            color: #848C97;

            &-item {
                float: left;
                margin-right: 18px;
            }
            &-fn {
                float: right;
                margin-left: 17px;
                cursor: pointer;

                .iconfont {
                    font-size: 14px;
                    margin-right: 4px;
                }

                &:hover {
                    color: #394A58;
                }
            }
        }
        &-tags {
            padding-bottom: 15px;
            border-bottom: 1px solid #EEE;

            &-icon {
                float: left;
                color: #848C97;
                margin-right: 5px;
            }
            &-item {
                float: left;
                padding: 0 5px;
                font-size: 12px;
                line-height: 17px;
                color: #1D2941;
                background: #FFDBDB;
                border-radius: 4px;
                margin-right: 5px;
            }
        }
        &-content {
            padding: 10px 0;
            @import '../../assets/css/editor.less';
        }
        &-attachments {
            padding-top: 18px;
            border-top: 1px solid #EEE;

            &-item {
                height: 25px;
                margin-bottom: 3px;
                font-size: 14px;
                color: #394A58;
                line-height: 25px;

                .iconfont {
                    color: #848C97;
                    margin-right: 13px;
                }
                a {
                    color: #3DAAFF;
                    text-decoration: none;
                }
            }
        }
    }
    .comments {
        margin-top: 18px;
        border: 1px solid #eee;
        border-radius: 4px;

        &-total {
            height: 35px;
            padding-left: 12px;
            line-height: 35px;
            font-size: 14px;
            color: #394A58;
            border-bottom: 1px solid #eee;
        }
        &-item {
            display: flex;

            .author-avatar {
                width: 40px;
                height: 40px;
                margin: 15px;
            }
            &-right {
                flex: 1;
                font-size: 14px;
                padding-bottom: 13px;
                border-bottom: 1px solid #eee;
            }
            &:last-child .comments-item-right {
                border: none;
            }
        }
        &-author {
            padding-top: 7px;
            line-height: 25px;
            .author-info {
                float: left;

                .reply_author {
                    font-weight: bold;
                    color: #848C97;
                }
                .reply_time {
                    margin-left: 10px;
                    font-size: 12px;
                    color: #C2C6CC;
                }
            }
            .user_action {
                float: right;

                &-item {
                    margin-left: 6px;
                    margin-right: 9px;
                    color: #848C97;
                    cursor: pointer;

                    &:hover {
                        color: #394A58;
                    }
                    .iconfont {
                        margin-right: 3px;
                    }
                }
            }
        }
        &-content {
            line-height: 25px;
            color: #394A58;

            .reply-to {
                color: #394A58;
                font-weight: bold;
                margin-right: 6px
            }
        }
        .compt-replyBox {
            margin-top: 13px;
            margin-right: 12px;
        }
    }
    .artical-reply {
        display: flex;
        margin-top: 30px;

        .author-avatar {
            width: 40px;
            height: 40px;
            margin: 2px 15px;
        }
        .compt-replyBox {
            flex: 1;
        }
    }
}
</style>

