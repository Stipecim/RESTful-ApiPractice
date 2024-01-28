const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const OrdersController = require('../controllers/orders');


router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/',checkAuth, OrdersController.orders_create_order);

router.get('/:orderID', OrdersController.orders_get_order);

router.delete('/:orderID', checkAuth, OrdersController.orders_order_delete);

module.exports = router;