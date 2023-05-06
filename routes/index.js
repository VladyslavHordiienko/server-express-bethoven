const Router = require('express');
const router = new Router();

const productRouter = require('./productRouter');
const categoryRouter = require('./categoryRouter');
const productAttrRouter = require('./productAttrRouter');
const basketRouter = require('./basketRouter');
const deliveriesRouter = require('./deliveriesRouter');
const paymentsRouter = require('./paymentsRouter');
const novaposhtaRouter = require('./novaposhtaRouter');

router.use('/category', categoryRouter);
router.use('/productAttr', productAttrRouter);
router.use('/product', productRouter);
router.use('/basket', basketRouter);
router.use('/deliveries', deliveriesRouter);
router.use('/payments', paymentsRouter);
router.use('/novaposhta', novaposhtaRouter);

module.exports = router;
