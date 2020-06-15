const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop');

router.get('/cart', shopController.getCart);
router.post('/cart/add', shopController.addToCart);
router.delete('/cart/:code', shopController.removeItem);
router.get('/orders', shopController.getOrders);
router.post('/order', shopController.createOrder);
router.get('/invoice/:orderId', shopController.getInvoice);
router.get('/checkoutSession',shopController.postCreateCheckoutSessionId);
module.exports = router;

