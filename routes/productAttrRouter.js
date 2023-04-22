const Router = require('express');
const router = new Router();

const productAttrController = require('../controllers/productAttrController');

const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// router.post('/', checkRoleMiddleware('Admin'), categoryController.create);
// router.post('/', productAttrController.create);
// router.get('/:id', productAttrController.getFiltersBelongsCategory);
router.get('/', productAttrController.getAll);

module.exports = router;
