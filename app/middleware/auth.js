const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    const token = req.headers.Authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      throw 'invalid user ID ';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Unauthentify request') 
    });
  };
};