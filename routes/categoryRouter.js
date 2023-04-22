const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');

const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// router.post('/', checkRoleMiddleware('Admin'), categoryController.create);
router.post('/', categoryController.create);
router.get('/', categoryController.getAll);
router.get('/:slug', categoryController.getOne);

module.exports = router;
