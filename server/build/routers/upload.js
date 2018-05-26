"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koaRouter = require("koa-router");
const multer = require("koa-multer");
const path = require("path");
const upload = require("../controllers/upload");
const needLogin_1 = require("../middlewares/needLogin");
const router = new koaRouter({ prefix: '/upload' });
const getStorage = (dirname) => {
    return multer.diskStorage({
        destination(req, file, cb) {
            cb(null, path.join(__dirname, `../upload/${dirname}`));
        },
        filename(req, file, cb) {
            const originalname = file.originalname.split('.');
            const ext = originalname.pop();
            cb(null, `${originalname.join('.')}-${Date.now()}.${ext}`);
        }
    });
};
const imgUploader = multer({ storage: getStorage('image') });
const fileUploader = multer({ storage: getStorage('attachment') });
router.post('/imgs', needLogin_1.needLogin(), imgUploader.array('imgs', 5), upload.saveImgs);
router.post('/attachment', needLogin_1.needLogin(), fileUploader.array('attachments', 5), upload.saveAttachments);
router.post('/remove', needLogin_1.needLogin(), upload.remove);
exports.default = router;
//# sourceMappingURL=upload.js.map