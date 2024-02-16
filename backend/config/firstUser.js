const { User } = require('../models/userModel');
const bcrypt = require('bcryptjs')

const firstUser = () => {
    let user = new User({
        name: process.env.FIRST_USER_NAME,
        email: process.env.FIRST_USER_EMAIL,
        password: process.env.FIRST_USER_PW,
        isAdmin: true
    });

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(user.password, salt, async (err, hash) => {
            if (err) throw err;
            user.password = hash;
            user = await user.save();
        });
    });

    console.log(`created user ${JSON.stringify(user)}`)
    return user;
}

module.exports = firstUser;