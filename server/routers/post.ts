import * as koaRouter from 'koa-router';
import * as Post from '../controllers/post';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/post'});

router.get('/comments/:id', Post.getComments);
router.get('/search', Post.search);
router.get('/:id', Post.get);
router.post('/', needLogin(), Post.save);
router.post('/list', Post.list);
router.delete('/:id', needLogin(), Post.removeOne);
router.delete('/', needLogin(), Post.remove);

export default router;
