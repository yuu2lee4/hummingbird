import * as koaRouter from 'koa-router';
import * as Comment from '../controllers/comment';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/comment'});

router.get('/unread/amount', needLogin(), Comment.unReadAmount);
router.post('/', needLogin(), Comment.save);
router.post('/search/user', needLogin(), Comment.searchByUser);
router.post('/search/unread', needLogin(), Comment.searchUnRead);
router.put('/read/:id', needLogin(), Comment.read);
router.delete('/:id', needLogin(), Comment.removeOne);

export default router;
