const Router = require('express');
const router = new Router();
const ProductController = require('../controllers/productController');

router.get('/', ProductController.getAll);
router.get('/:slug', ProductController.getOne);

module.exports = router;
