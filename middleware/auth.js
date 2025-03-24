const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const auth = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.token;
    
    // Add debugging
    console.log('Cookie token:', token);
    
    // Check if token exists
    if (!token) {
      console.log('No token found, redirecting to login');
      return res.redirect('/user/login');
    }
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded);
    
    // Add user data to request
    req.user = decoded;
    
    // Proceed to next middleware/route handler
    next();
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.redirect('/user/login');
  }
};

module.exports = auth; 