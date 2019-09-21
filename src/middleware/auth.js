const User = require('../models/User')

const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {

    try {
        // ## Parse String to get token
        const token = req.header('Authorization').replace('Bearer ', '')

        // ## Verify Token
        const decoded = jwt.verify(token, process.env.SECRET)

        // ^^ Query DB to find user by email and token
        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        // !!  Error Handler
        if (!user) {
            throw new Error("Failed")
        }

        // ## Set req obj wtih token and user
        req.token = token
        req.user = user

        // ## Call next function
        next()

        // !! Error Handler
    } catch (err) {
        res.status(401).send(err)
    }


}

module.exports = auth