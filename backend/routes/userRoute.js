const express = require('express');
const { User, validate } = require('../models/userModel');
const bcrypt = require('bcryptjs');

const router = express.Router();

router.get("/", async (req, res) => {
    const users = await User.find({}).sort('name').select('-password');
    if (users) {
        res.json(users);
    } else {
        res.status(500).json({ msg: "Error retrieving users from DB." });
    }
});

router.get('/me', async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.get("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ msg: "User not found" });
    }
});


router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(401).json({ msg: error.details[0].message });

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).json({ msg: 'User already exists' });
    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        isAdmin: req.body.isAdmin
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user = await user.save();
            if (user) {
                return res.json({
                    token: user.generateAuthToken(),
                    id: user.id,
                    name: user.name,
                    email: user.email,
                })
            }
            else return res.status(500).send({ msg: 'Something went wrong' });
        });
    });

});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).json({ msg: error.details[0].message });

    let user = await User.findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            isAdmin: req.body.isAdmin
        },
        { new: true }
    );

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
});

router.put("/changepassword/:id", async (req, res) => {
    const newPassword = req.body.password;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ msg: 'Password must be at least 8 characters' });

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(newPassword, salt);
    let user = await User.findByIdAndUpdate(req.params.id,
        {
            password: passHash,
        },
        { new: true }
    );

    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
});

router.delete("/:id", async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (user) {
        res.json(user);
    }
    else {
        res.status(404).json({ msg: 'User not found' });
    }
});

module.exports = router;