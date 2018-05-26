"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const collect_1 = require("../models/collect");
exports.save = async (ctx) => {
    ctx.params.user = ctx.state.user._id;
    const collect = await collect_1.default.findOne(ctx.params);
    if (collect) {
        throw new Error('你已收藏过该文章！');
    }
    else {
        const newCollect = await collect_1.default.create(ctx.params);
        ctx.body = { code: 0, data: newCollect._id };
    }
};
exports.search = async (ctx) => {
    const pageSize = ctx.query.pageSize * 1 || 10;
    const page = ctx.query.page * 1 || 1;
    const skipNum = (page - 1) * pageSize;
    const condition = { user: ctx.state.user._id };
    const searchPromise = collect_1.default.find(condition).select('post').populate('post', 'title meta').sort('-meta.updateAt').limit(pageSize).skip(skipNum);
    const countNumerPromise = collect_1.default.count(condition);
    const [resluts, total] = await Promise.all([searchPromise, countNumerPromise]);
    ctx.body = {
        code: 0,
        data: {
            results: resluts,
            page,
            pageSize,
            total
        }
    };
};
exports.removeOne = async (ctx) => {
    const id = ctx.params.id;
    await collect_1.default.remove({ _id: id }).exec();
    ctx.body = { code: 0, data: true };
};
//# sourceMappingURL=collect.js.map