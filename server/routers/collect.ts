import * as koaRouter from 'koa-router';
import * as Collect from '../controllers/collect';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/collect'});

router.post('/:post', needLogin(), Collect.save);
router.get('/search', Collect.search);
router.delete('/:id', needLogin(), Collect.removeOne);

export default router;
