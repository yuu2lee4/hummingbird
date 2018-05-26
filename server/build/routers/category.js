"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const Category = require("../controllers/category");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/category' });
router.get('/search', Category.search);
router.get('/:id', Category.get);
router.post('/', needLogin_1.needLogin(), Category.save);
router.post('/list', Category.list);
router.delete('/:id', needLogin_1.needLogin(), Category.removeOne);
router.delete('/', needLogin_1.needLogin(), Category.remove);
exports.default = router;
//# sourceMappingURL=category.js.map