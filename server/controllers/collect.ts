import Collect from '../models/collect';

export const save = async ctx=>{
    ctx.params.user = ctx.state.user._id;
    const collect = await Collect.findOne(ctx.params);

    if (collect) {
        throw new Error('你已收藏过该文章！');
    } else {
        const newCollect = await Collect.create(ctx.params);
        ctx.body = { code: 0, data: newCollect._id };
    }
}
 
export const search = async ctx=>{
    const pageSize = ctx.query.pageSize*1 || 10;
    const page = ctx.query.page * 1 || 1;
    const skipNum = (page-1) * pageSize;
    
    const condition = { user: ctx.state.user._id };
    const searchPromise = Collect.find(condition).select('post').populate('post', 'title meta').sort('-meta.updateAt').limit(pageSize).skip(skipNum);
    const countNumerPromise = Collect.count(condition);

    const [resluts, total] = await Promise.all([searchPromise, countNumerPromise]);

    ctx.body = {
        code:0,
        data: {
            results: resluts,
            page,
            pageSize,
            total
        }
    }
}

export const removeOne = async ctx=>{
    const id = ctx.params.id;
    await Collect.remove({_id: id}).exec();
    ctx.body = { code:0, data: true };
}
