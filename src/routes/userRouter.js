const chalk = require('chalk')
const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

// ?? Middleware
const auth = require('../middleware/auth');
const {
    sendWelcomeEmail,
    sendWFarwellEmail
} = require('../emails/account')

const User = require('../models/User')

const userRouter = new express.Router()
const log = console.log

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('File must be a image'))
        }

        cb(undefined, true)

    }
})


// ^^ Login User
userRouter.post('/users/login', async (req, res, next) => {

    // ## Get Submitted password and email
    const {
        email,
        password
    } = req.body

    try {

        // ^^ Query DB for user by email and check credentials
        const user = await User.findByCredentials(email, password)

        // ## Generate Authentication Token
        const token = await user.generateAuthToken()

        // ^^ Response
        res.send({
            user,
            token
        })

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Failed to login"))
        res.status(400).send(err)
    }
})

// ^^ Create User
userRouter.post('/users', async (req, res, next) => {

    // ## Create User
    const user = new User(req.body)

    try {

        // ^^ Query DB to save
        await user.save()

        sendWelcomeEmail(user.email, user.name)

        // ## Generate Authentication Token
        const token = await user.generateAuthToken()

        // ^^ Response
        res.status(201).send({
            user,
            token
        })

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to create user !!!!!"))
        res.status(400).send("!!!!! Unable to create user !!!!!")
    }
})

// ^^ Logout session
userRouter.post('/users/logout', auth, async (req, res, next) => {
    try {
        // ## remove token out of tokens array
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })

        // ^^ Query DB to save
        await req.user.save()

        // ^^ Response
        res.send()

        // !! Error Handler
    } catch (error) {
        res.status(500).send()
    }
})

// ^^ Logout All session
userRouter.post('/users/logoutall', auth, async (req, res, next) => {
    try {
        // ## Clear tokens array
        req.user.tokens = []

        // ^^ Query DB to save
        await req.user.save()

        // ^^ Response
        res.send()

        // !! Error Handler
    } catch (error) {
        res.status(500).send()
    }
})

// ^^ Upload Profile Pic
userRouter.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res, next) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()

    req.user.avatar = buffer

    try {
        await req.user.save()

        res.send('file uploaded')
    } catch (error) {
        res.status(400).send({
            error: error.message
        })
    }

}, (error, req, res, next) => {
    res.status(400).send({
        error: error.message
    })
})

// ^^ Get Users Profile
userRouter.get('/users/me', auth, async (req, res, next) => {
    res.send(req.user)
})

// ^^ Get Avatar
userRouter.get('/users/:id/avatar', async (req, res, next) => {
    const _id = req.params.id

    try {
        const user = await User.findById(_id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/png').send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})


// ^^ Update User
userRouter.patch('/users/me', auth, async (req, res, next) => {

    // ## User from req
    const user = req.user;;

    // ## Check Fields
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    // !! Error Handler
    if (!isValidOperation) {
        return res.status(400).send("Invalid Update")
    }

    try {

        // ## Update User
        updates.forEach(update => user[update] = req.body[update])

        // ^^ Query DB to save
        await user.save()

        // !! Error Handler
        if (!user) {
            log(chalk.red.bold.inverse("!!!!! Unable to update user !!!!!"))
            return res.status(400).send("!!!!! Unable to update user !!!!!")
        }

        // ^^ Response
        res.send(user)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to update user !!!!!"))
        res.status(400).send("Unable to update user")
    }
})

// ^^ Delete User
userRouter.delete('/users/me', auth, async (req, res) => {

    // ## User ID
    const {
        _id,
        name,
        email
    } = req.user

    try {
        // ^^ Query DB to Delete
        await req.user.remove()

        sendWFarwellEmail(email, name)
        // ^^ Response
        res.send('User Deleted')

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to Find and delete task !!!!!")
    }
})

// ^^ Delete Avatar
userRouter.delete('/users/me/avatar', auth, async (req, res) => {

    const user = req.user

    user.avatar = undefined

    try {
        await user.save()

        // ^^ Response
        res.send()

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to Delete Avatar !!!!!")
    }
})


module.exports = userRouter