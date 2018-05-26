import Category from '../models/category';

export const save = async ctx=>{
    const id = ctx.request.body._id;
    if(id){
        await Category.findByIdAndUpdate(id, ctx.request.body);
        ctx.body = {code:0, data: true};
    }else{
        await Category.create(ctx.request.body);
        ctx.body = {code:0, data: true};
    }
}

export const get = async ctx=>{
    const id = ctx.params.id
    const category = await Category.findById(id);
    if(category){
        ctx.body = {code:0,data: category};
    }
}

export const list = async ctx=>{
    const ids = ctx.request.body.ids;
    let category;

    if(ids && ids.length){
        category = await Category.find({_id: {$in: ids} }).exec();
    }else{
        category = await Category.find().exec();
    }
    if(category){
        ctx.body = {code:0,data: category};
    }
}

export const search = async ctx=>{
    const pageSize = ctx.query.pageSize*1 || 10;
    const page = ctx.query.page * 1 || 1;
    const skipNum = (page-1) * pageSize;

    const searchTagPromise = Category.find().limit(pageSize).skip(skipNum);
    const countNumerPromise = Category.count({});
    const [categorys, total] = await Promise.all([searchTagPromise, countNumerPromise]);

    if(categorys.length){
        ctx.body = {
            code:0,
            data: {
                results: categorys,
                page,
                pageSize,
                total
            }
        }
    }else{
        ctx.body = {code: 101, msg: '未查询到分类!'};
    }
}

export const removeOne = async ctx=>{
    const id = ctx.params.id;
    await Category.remove({_id: id}).exec();
    ctx.body = {code:0, data: true};
}

export const remove = async ctx=>{
    const ids = ctx.request.body.ids;

    if (ids && ids.length) {
        await Category.remove({_id: {$in: ids} });
        return ctx.body = { code:0, data: true };
    }
    throw new Error('未传ids');
}
