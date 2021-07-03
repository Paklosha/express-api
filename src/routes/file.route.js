const express = require('express');
const router = express.Router();
const fileController = require('../controllers/file.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');
const upload = require('../multer')


router.get('/list', auth(), awaitHandlerFactory(fileController.getList));
router.get('/:id', auth(), awaitHandlerFactory(fileController.getFile));
router.get('/download/:id', auth(), awaitHandlerFactory(fileController.downloadFile));
router.post('/upload', auth(), upload.single('file'), awaitHandlerFactory(fileController.fileUpload));
router.put('/update/:id', auth(), upload.single('file'), awaitHandlerFactory(fileController.fileUpdate));
router.delete('/delete/:id', auth(), awaitHandlerFactory(fileController.deleteFile));

module.exports = router;