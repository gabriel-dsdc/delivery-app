const express = require('express');

const router = express.Router();

const { productController } = require('../controllers');

router.get('/', productController.findAll);

module.exports = router;
