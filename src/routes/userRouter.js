const chalk = require('chalk')
const express = require('express')

// ?? Middleware
const auth = require('../middleware/auth');

const User = require('../models/User')

const userRouter = new express.Router()
const log = console.log


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


// ^^ Get all Users
userRouter.get('/users/me', auth, async (req, res, next) => {
    res.send(req.user)
})


// ^^ Get User
userRouter.get('/users/:id', async (req, res, next) => {

    // ## User ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const user = await User.findById(_id)

        // !! Error Handler
        if (!user) {
            return res.status(404).send("unable to find user")
        }

        // ^^ Response
        res.send(user)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to get user !!!!!"))
        res.status(500).send()
    }
})

// ^^ Update User
userRouter.patch('/users/:id', async (req, res, next) => {

    // ## User ID
    const _id = req.params.id

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
        // ^^ Query DB
        const user = await User.findById(_id)

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
userRouter.delete('/users/:id', async (req, res) => {

    // ## User ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const user = await User.findByIdAndDelete(_id)

        // !! Error Handler
        if (!user) {
            return res.status(400).send("!!!!! Unable to Delete user !!!!!")
        }

        // ^^ Response
        res.status(200).send('User Deleted')

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to Find and delete task !!!!!")
    }
})


module.exports = userRouter