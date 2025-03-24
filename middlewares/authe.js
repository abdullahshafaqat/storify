const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use environment variable in production

const auth = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    // Check if token exists
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