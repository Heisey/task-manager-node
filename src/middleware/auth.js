const User = require('../models/User')

const jwt = require('jsonwebtoken')

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '')

        const decoded = jwt.verify(token, 'dumbyString')

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        })

        if (!user) {
            throw new Error("Failed")
        }

        req.user = user
        next()
    } catch (err) {
        res.status(401).send({
            error: "please authenticate"
        })
    }


}

module.exports = auth