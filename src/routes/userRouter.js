const express = require('express')
const chalk = require('chalk')

const User = require('../db/User')

const userRouter = new express.Router()
const log = console.log

// ^^ Get all Users
userRouter.get('/users', async (req, res, next) => {
    try {

        // ^^ Query DB 
        const users = await User.find()

        // !! Error Handler
        if (!users) {
            return res.status(404).send('Users not found')
        }

        // ^^ Response
        res.send(users)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to get users"))
        res.status(500).send(err)
    }
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

// ^^ Create User
userRouter.post('/users', async (req, res, next) => {

    // ## Create User
    const user = new User(req.body)

    try {

        // ^^ Query DB to save
        await user.save()

        // ^^ Response
        res.status(201).send(user)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to create user !!!!!"))
        res.status(400).send("!!!!! Unable to create user !!!!!")
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
        const user = await User.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })

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