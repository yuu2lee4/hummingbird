import * as koaRouter from 'koa-router';
import * as Category from '../controllers/category';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/category'});

router.get('/search', Category.search);
router.get('/:id', Category.get);
router.post('/', needLogin(), Category.save);
router.post('/list', Category.list);
router.delete('/:id', needLogin(), Category.removeOne);
router.delete('/', needLogin(), Category.remove);

export default router;
