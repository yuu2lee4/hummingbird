"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const Comment = require("../controllers/comment");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/comment' });
router.get('/unread/amount', needLogin_1.needLogin(), Comment.unReadAmount);
router.post('/', needLogin_1.needLogin(), Comment.save);
router.post('/search/user', needLogin_1.needLogin(), Comment.searchByUser);
router.post('/search/unread', needLogin_1.needLogin(), Comment.searchUnRead);
router.put('/read/:id', needLogin_1.needLogin(), Comment.read);
router.delete('/:id', needLogin_1.needLogin(), Comment.removeOne);
exports.default = router;
//# sourceMappingURL=comment.js.map