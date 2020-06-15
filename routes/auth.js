const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');


router.post('/signUp', authController.postSignUp);
router.post('/login', authController.postLogin);
router.post('/resetPassword', authController.resetPassword);
router.put('/resetPassword',authController.updatePassword)
module.exports = router;



