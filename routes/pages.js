const express = require("express");
const authController = require('../controllers/auth.js');
const router = express.Router();


router.get('/', (req, res) => {
    res.render('home');
});

router.get('/simple_checkout',authController.snap);





module.exports = router;