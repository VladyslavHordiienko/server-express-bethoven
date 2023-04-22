const Router = require('express');
const router = new Router();
const ProductController = require('../controllers/productController');

const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// router.post('/', checkRoleMiddleware('Admin'), ProductController.create);
// router.post('/', ProductController.create);
router.get('/', ProductController.getAll);
router.get('/:slug', ProductController.getOne);

module.exports = router;
