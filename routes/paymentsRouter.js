const Router = require('express');
const router = new Router();
const PaymentsController = require('../controllers/paymentsController');

router.get('/', PaymentsController.getAll);

module.exports = router;
