"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const Post = require("../controllers/post");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/post' });
router.get('/comments/:id', Post.getComments);
router.get('/search', Post.search);
router.get('/:id', Post.get);
router.post('/', needLogin_1.needLogin(), Post.save);
router.post('/list', Post.list);
router.delete('/:id', needLogin_1.needLogin(), Post.removeOne);
router.delete('/', needLogin_1.needLogin(), Post.remove);
exports.default = router;
//# sourceMappingURL=post.js.map