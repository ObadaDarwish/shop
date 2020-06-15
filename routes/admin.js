const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth').isAuth;


router.get('/product/:code', adminController.getProduct);
router.get('/products', adminController.getProducts);
router.post('/product', adminController.postAddProduct);
router.put('/product/:code', adminController.putEditProducts);
router.delete('/product/:code', adminController.deleteProducts);

module.exports = router;





