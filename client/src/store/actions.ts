export default {
    async getUnReadAmount(ctx) {
        if (ctx.state.unReadAmount !== -1) {
            return ctx.state.unReadAmount;
        }
        const num = await $api.getCommentUnreadAmount();
        ctx.commit('updateUnReadAmount', num);
        return num;
    },
};
