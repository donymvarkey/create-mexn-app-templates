const jwt = require('jsonwebtoken');
const config = require('../config');

const isAuthorized = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      message: 'Unauthorized: Missing or invalid token',
      data: null,
    });
  }

  const accessToken = authHeader.split(' ')[1];
  const secretKey = config.secret || process.env.SECRET || 'secret';

  jwt.verify(accessToken, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        statusCode: 401,
        message: 'Unauthorized: Invalid or expired token',
        data: null,
      });
    }

    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      statusCode: 403,
      message: 'Forbidden: Access denied',
      data: null,
    });
  }
  next();
};

module.exports = {
  isAuthorized,
  isAdmin,
};
