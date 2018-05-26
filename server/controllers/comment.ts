import Comment from '../models/comment';

export const save = async ctx=>{
    const id = ctx.request.body._id;
    if(id){
        const comment = await Comment.findByIdAndUpdate(id, ctx.request.body);
        ctx.body = { code:0, data: comment };
    }else{
        ctx.request.body.from = ctx.state.user._id;
        const newComment = await Comment.create(ctx.request.body);
        ctx.body = { code:0, data: newComment };
    }
}

function baseSearch (pageSize = 10, page = 1, condition = {}) {
    const skipNum = (page-1) * pageSize;

    const searchPromise = Comment.find(condition)
        .sort('isRead -meta.updateAt')
        .select('post from comment isRead meta.createAt')
        .populate('post', 'title')
        .populate('from', 'username')
        .limit(pageSize)
        .skip(skipNum);
    const countNumerPromise = Comment.count(condition);
    return Promise.all([searchPromise, countNumerPromise]);
}

export const searchByUser = async ctx=>{
    const pageSize = ctx.query.pageSize*1 || 10;
    const page = ctx.query.page * 1 || 1;
    const condition = { to: ctx.state.user._id };

    const [comments, total] = await baseSearch(pageSize, page, condition);

    ctx.body = {
        code:0,
        data: {
            results: comments,
            page,
            pageSize,
            total
        }
    }
}

export const searchUnRead = async ctx=>{
    const pageSize = ctx.query.pageSize*1 || 5;
    const page = ctx.query.page * 1 || 1;
    const condition = { to: ctx.state.user._id, isRead: false };

    const [comments, total] = await baseSearch(pageSize, page, condition);

    ctx.body = {
        code:0,
        data: {
            results: comments,
            page,
            pageSize,
            total
        }
    }
}

export const read = async ctx=>{
    const id = ctx.params.id;
    const comment = await Comment.findById(id);

    if(comment){
        comment.isRead = true;
        await comment.save();
        ctx.body = { code: 0, data: id };
    }
}

export const unReadAmount = async ctx=>{
    const num = await Comment.count({ to: ctx.state.user._id, isRead: false });
    ctx.body = { code: 0, data: num };
}

export const removeOne = async ctx=>{
    const id = ctx.params.id;
    await Comment.remove({_id: id}).exec();
    ctx.body = { code:0, data: true };
}
