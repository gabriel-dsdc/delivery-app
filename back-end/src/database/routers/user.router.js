const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

const { userController } = require('../controllers');

router.post('/newUser', userController.newUser);
router.post('/login', userController.login);
router.get('/sellers', authMiddleware, userController.getAllSellers);

module.exports = router;
