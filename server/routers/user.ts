import * as koaRouter from 'koa-router';
import * as User from '../controllers/user';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/user'});

router.post('/register', needLogin(false), User.register);
router.post('/reset/password', User.resetPassword);
router.post('/login', needLogin(false), User.login);
router.post('/ldap/login', needLogin(false), User.ldapLogin);
router.get('/pin', User.getPin)
router.get('/', needLogin(), User.getUser);
router.get('/logout', needLogin(), User.logout);

export default router;
