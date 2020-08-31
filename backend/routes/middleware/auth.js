const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = (req.header ? req.header('x-auth-token') : req.headers('x-auth-token'));

    if (!token) {
        return res.status(401).json({ msg: 'Invalid token: token not found' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('JWT_PRIVATEKEY'));

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token: unverified' });
    }

}

module.exports = auth;