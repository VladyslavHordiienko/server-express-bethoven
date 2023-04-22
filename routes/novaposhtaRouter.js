const Router = require('express');
const router = new Router();
const NovaposhtaController = require('../controllers/novaposhtaController');

router.get('/', NovaposhtaController.getAll);

module.exports = router;
