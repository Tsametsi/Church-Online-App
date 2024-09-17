// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Rate limiter for login requests
exports.loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per window
    message: 'Too many login attempts from this IP, please try again later.'
});
