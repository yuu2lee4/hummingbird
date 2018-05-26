import * as koaRouter from 'koa-router';
import * as multer from 'koa-multer';
import * as path from 'path';
import * as upload from '../controllers/upload';
import { needLogin } from '../middlewares/needLogin';

const router = new koaRouter({prefix : '/upload'});
const getStorage = (dirname) => {
    return multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, `../upload/${dirname}`))
        },
        filename(req, file, cb) {
            const originalname = file.originalname.split('.');
            const ext = originalname.pop();
            cb(null, `${originalname.join('.')}-${Date.now()}.${ext}`);
        }
    })
}
const imgUploader = multer({ storage: getStorage('image') });
const fileUploader = multer({ storage: getStorage('attachment') });

router.post('/imgs', needLogin(),imgUploader.array('imgs', 5), upload.saveImgs);
router.post('/attachment', needLogin(),fileUploader.array('attachments', 5), upload.saveAttachments);
router.post('/remove', needLogin(), upload.remove);

export default router;
