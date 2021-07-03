
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

router.get('/info', auth(), awaitHandlerFactory(userController.getCurrentUser));
router.get('/logout', auth(), awaitHandlerFactory(userController.getLogout));
router.get('/latency', auth(), awaitHandlerFactory(userController.latency));
router.post('/signup', awaitHandlerFactory(userController.createUser));
router.post('/signin', awaitHandlerFactory(userController.userLogin));
router.post('/signin/new_token', awaitHandlerFactory(userController.newToken));

module.exports = router;