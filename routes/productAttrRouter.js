const Router = require('express');
const router = new Router();
const productAttrController = require('../controllers/productAttrController');

router.get('/', productAttrController.getAll);

module.exports = router;
