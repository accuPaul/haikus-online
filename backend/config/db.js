const mongoose = require('mongoose')
const { User } = require('../models/userModel')
const firstUser = require('./firstUser')
const { Haiku } = require('../models/haikuModel')
const loadFromFile = require('./loadFromFile')

const connectDB = async () => {
    try {
        const dbRoute = "mongodb://127.0.0.1:27017/"

        console.log(`dbRoute = ${dbRoute}`)
        const conn = await mongoose.connect(dbRoute, { useNewUrlParser: true, useUnifiedTopology: true,
        user: process.env.MONGO_ROOT_USER, pass: process.env.MONGO_ROOT_PW, dbName: 'HaikuProject' })

        console.log(`MongoDB connected to ${conn.connection.db.databaseName}`)

        const doesFirstUserExist = await User.exists({name: process.env.FIRST_USER_NAME});
    
        if (!doesFirstUserExist) {
            doesFirstUserExist = firstUser();
        }

        const doHaikusExist = await Haiku.exists({ auth: doesFirstUserExist._id})

        if (!doHaikusExist) {
            loadFromFile(doesFirstUserExist._id)
        }
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

module.exports = connectDB