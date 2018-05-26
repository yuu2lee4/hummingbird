"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const Collect = require("../controllers/collect");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/collect' });
router.post('/:post', needLogin_1.needLogin(), Collect.save);
router.get('/search', Collect.search);
router.delete('/:id', needLogin_1.needLogin(), Collect.removeOne);
exports.default = router;
//# sourceMappingURL=collect.js.map