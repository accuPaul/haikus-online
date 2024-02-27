const express = require('express');
const { User, validate } = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../routes/middleware/auth');

const router = express.Router();

// @route   GET /auth/user
// @desc    Get user data
// @access  Private

router.get("/user", auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password')
    if (user) {
        res.json(user);
    } else {
        res.status(500).json({ msg: "Error retrieving users from DB." });
    }
});

router.get("/refresh", auth, async(req, res) => {
    const user = await User.findById(req.user.id)
    if (user) {
        res.json(user.generateAuthToken())
    } else return res.status(401).json({ msg: 'invalid user or password' });
})

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: 'Please enter all fields' });

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json({ msg: 'User does not exist' });


    bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) {
        }
        if (isMatch) {
            res.json({
                token: user.generateAuthToken(),
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            });
        }
        else return res.status(400).json({ msg: 'invalid user or password' });
    });

});

module.exports = router;