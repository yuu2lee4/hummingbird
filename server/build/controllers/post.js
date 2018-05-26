"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_1 = require("../models/post");
const comment_1 = require("../models/comment");
exports.save = async (ctx) => {
    const id = ctx.request.body._id;
    if (id) {
        await post_1.default.findByIdAndUpdate(id, ctx.request.body);
        ctx.body = { code: 0, data: id };
    }
    else {
        const author = ctx.state.user._id;
        const title = ctx.request.body.title;
        const post = await post_1.default.findOne({ title, author }).exec();
        if (post) {
            ctx.body = { code: 100, msg: '不能重复发表标题相同的文章！' };
        }
        else {
            const newPost = await post_1.default.create(Object.assign({}, ctx.request.body, { author }));
            if (newPost) {
                ctx.body = { code: 0, data: newPost._id };
            }
        }
    }
};
exports.get = async (ctx) => {
    const id = ctx.params.id;
    const post = await post_1.default.findById(id)
        .populate('author', 'username')
        .populate('category', 'name');
    if (post) {
        ctx.body = { code: 0, data: post };
    }
};
exports.getComments = async (ctx) => {
    const id = ctx.params.id;
    const comments = await comment_1.default.find({ post: id })
        .sort('-meta.updateAt')
        .populate('from', 'username')
        .populate('to', 'username');
    ctx.body = { code: 0, data: comments };
};
exports.list = async (ctx) => {
    const ids = ctx.request.body.ids;
    let post;
    if (ids && ids.length) {
        post = await post_1.default.find({ _id: { $in: ids } }).select('title meta').exec();
    }
    else {
        post = await post_1.default.find().select('title meta').exec();
    }
    if (post) {
        ctx.body = { code: 0, data: post };
    }
};
function baseSearch(pageSize = 10, page = 1, condition = {}) {
    const skipNum = (page - 1) * pageSize;
    const searchTagPromise = post_1.default.find(condition).sort('-meta.updateAt').select('title meta').limit(pageSize).skip(skipNum);
    const countNumerPromise = post_1.default.count(condition);
    return Promise.all([searchTagPromise, countNumerPromise]);
}
exports.search = async (ctx) => {
    const pageSize = ctx.query.pageSize * 1 || 10;
    const page = ctx.query.page * 1 || 1;
    const type = ctx.query.type || 'all';
    const val = ctx.query.value;
    let condition = {};
    if (type === 'author') {
        condition[type] = val || ctx.state.user._id;
    }
    else if (type === 'category') {
        condition[type] = val;
    }
    else if (type === 'title') {
        condition[type] = new RegExp(val);
    }
    const [posts, total] = await baseSearch(pageSize, page, condition);
    if (Array.isArray(posts)) {
        ctx.body = {
            code: 0,
            data: {
                results: posts,
                page,
                pageSize,
                total
            }
        };
    }
    else {
        ctx.body = { code: 101, msg: '未查询到分类!' };
    }
};
exports.removeOne = async (ctx) => {
    const id = ctx.params.id;
    await post_1.default.remove({ _id: id }).exec();
    ctx.body = { code: 0, data: true };
};
exports.remove = async (ctx) => {
    const ids = ctx.request.body.ids;
    if (ids && ids.length) {
        await post_1.default.remove({ _id: { $in: ids } });
        return ctx.body = { code: 0, data: true };
    }
    throw new Error('未传ids');
};
//# sourceMappingURL=post.js.map