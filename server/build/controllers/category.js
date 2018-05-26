"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const category_1 = require("../models/category");
exports.save = async (ctx) => {
    const id = ctx.request.body._id;
    if (id) {
        await category_1.default.findByIdAndUpdate(id, ctx.request.body);
        ctx.body = { code: 0, data: true };
    }
    else {
        await category_1.default.create(ctx.request.body);
        ctx.body = { code: 0, data: true };
    }
};
exports.get = async (ctx) => {
    const id = ctx.params.id;
    const category = await category_1.default.findById(id);
    if (category) {
        ctx.body = { code: 0, data: category };
    }
};
exports.list = async (ctx) => {
    const ids = ctx.request.body.ids;
    let category;
    if (ids && ids.length) {
        category = await category_1.default.find({ _id: { $in: ids } }).exec();
    }
    else {
        category = await category_1.default.find().exec();
    }
    if (category) {
        ctx.body = { code: 0, data: category };
    }
};
exports.search = async (ctx) => {
    const pageSize = ctx.query.pageSize * 1 || 10;
    const page = ctx.query.page * 1 || 1;
    const skipNum = (page - 1) * pageSize;
    const searchTagPromise = category_1.default.find().limit(pageSize).skip(skipNum);
    const countNumerPromise = category_1.default.count({});
    const [categorys, total] = await Promise.all([searchTagPromise, countNumerPromise]);
    if (categorys.length) {
        ctx.body = {
            code: 0,
            data: {
                results: categorys,
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
    await category_1.default.remove({ _id: id }).exec();
    ctx.body = { code: 0, data: true };
};
exports.remove = async (ctx) => {
    const ids = ctx.request.body.ids;
    if (ids && ids.length) {
        await category_1.default.remove({ _id: { $in: ids } });
        return ctx.body = { code: 0, data: true };
    }
    throw new Error('未传ids');
};
//# sourceMappingURL=category.js.map