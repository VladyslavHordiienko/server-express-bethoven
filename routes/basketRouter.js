const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');

const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

// router.post('/', checkRoleMiddleware('Admin'), ProductController.create);
router.post('/', basketController.create);

module.exports = router;
