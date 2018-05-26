"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const User = require("../controllers/user");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/user' });
router.post('/register', needLogin_1.needLogin(false), User.register);
router.post('/reset/password', User.resetPassword);
router.post('/login', needLogin_1.needLogin(false), User.login);
router.post('/ldap/login', needLogin_1.needLogin(false), User.ldapLogin);
router.get('/pin', User.getPin);
router.get('/', needLogin_1.needLogin(), User.getUser);
router.get('/logout', needLogin_1.needLogin(), User.logout);
exports.default = router;
//# sourceMappingURL=user.js.map