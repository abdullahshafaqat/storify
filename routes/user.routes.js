const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userModel = require('../models/user.model');
const { body, validationResult } = require('express-validator');

 
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', [
    body('username').trim().isLength({min:3}).withMessage('Username must be at least 3 characters'),
    
    body('email').trim().isEmail().withMessage('Must provide a valid email')
        .isLength({min:5}).withMessage('Email must be at least 5 characters'),
    
    body('password').trim().isLength({min:6}).withMessage('Password must be at least 6 characters')
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array(),
            message: "Invalid data"
        });
    }
    
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await userModel.create({
            username,
            email,
            password: hashedPassword
        });
        
        res.status(201).json({
            user: {
                username: newUser.username,
                email: newUser.email,
                password: hashedPassword,
                id: newUser._id,
                __v: newUser.__v,
                
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        });
    }
});

router.get('/login',(req,res) =>{
    res.render('login')
    })
    router.post('/login',[
        body('username').trim().isLength({min:3}).withMessage('Username must be at least 3 characters'),
        body('password').trim().isLength({min:6}).withMessage('Password must be at least 6 characters')
    ],async(req,res) =>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({
                errors: errors.array(),
                message: "Invalid data"
            });
        }
        const {username,password} = req.body;
        
        const user = await userModel.findOne({username: username});
        if(!user){
            return res.status(400).json({
                message: "Invalid username or password"
            });
         }
         
       const isMatch = await bcrypt.compare(password,user.password);
       if(!isMatch){
        return res.status(400).json({
            message: "Invalid username or password"
        })
        }
        const token = jwt.sign(
            { 
                _id: user._id,
                userId: user._id,
                username: user.username
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    res.cookie('token',token)
    res.send('Login successful')
            
        })
    module.exports = router;
    




