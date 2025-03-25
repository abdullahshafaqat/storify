const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; 

const auth = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    
    if (!token) {
      return res.redirect('/user/login');
    }
    else{
        return next();
    }   
    
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.redirect('/user/login');
  }
};

module.exports = auth;