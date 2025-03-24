const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authe');


router.get('/home',auth,(req,res) =>{
    res.render('home');
});









module.exports = router;
