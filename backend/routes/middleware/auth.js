const config = require('config');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'Invalid token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.get('JWT_PRIVATEKEY'));

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Invalid token' });
    }

}

module.exports = auth;