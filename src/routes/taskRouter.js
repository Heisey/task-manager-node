const auth = require('../middleware/auth')

const chalk = require('chalk')
const express = require('express')

const log = console.log

const taskRouter = new express.Router()

const Task = require('../models/Task')

// ^^ Get Tasks
taskRouter.get('/tasks', auth, async (req, res, next) => {
    const match = {}
    const sort = {}

    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if (req.query.field) {
        sort[req.query.field] = req.query.order === 'desc' ? -1 : 1
    }
    log(sort)
    try {

        // ^^ Query DB
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: req.query.limit * 1,
                skip: req.query.page * 1,
                sort
            }
        }).execPopulate()

        // ^^ Response
        res.send(req.user.tasks)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to get tasks !!!!!"))
        res.status(500).send()
    }
})

// ^^ Get Task
taskRouter.get('/tasks/:id', auth, async (req, res, next) => {

    // ## Task ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const task = await Task.findOne({
            _id,
            creator: req.user._id
        })
        log(task)
        // !! Error Handler
        if (!task) {
            log(chalk.red.bold.inverse("!!!!! Unable to get task !!!!!"))
            return res.status(404).send("!!!!! Unable to get task !!!!!")
        }

        // ^^ Response
        res.send(task)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to get task !!!!!"), err)
        res.status(501).send()
    }
})

// ^^ Create Task
taskRouter.post('/tasks', auth, async (req, res, next) => {

    // ## Create Task
    const task = new Task({
        ...req.body,
        creator: req.user._id
    })

    try {
        // ^^ Query DB to save
        await task.save()

        // ^^ Response
        res.status(201).send(task)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to create task !!!!!"), err)
        res.status(400).send("!!!!! Unable to create task !!!!!")
    }
})

// ^^ Update Task
taskRouter.patch('/tasks/:id', auth, async (req, res, next) => {

    // ## Task ID
    const _id = req.params.id

    // ## Check Fields
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    // !! Error Handler
    if (!isValidOperation) {
        return res.status(400).send("Invalid Update")
    }

    try {
        // ^^ Query DB
        const task = await Task.findOne({
            _id,
            creator: req.user._id
        })

        // !! Error Handler
        if (!task) {
            return res.status(400).send("!!!!! Unable to update task !!!!!")
        }

        updates.forEach(update => task[update] = req.body[update])

        await task.save()

        // ^^ Response
        res.status(201).send(task)

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to update task !!!!!")
    }
})

// ^^ Delete Task
taskRouter.delete('/tasks/:id', auth, async (req, res) => {

    // ## Task ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const task = await Task.findOneAndDelete({
            _id,
            creator: req.user._id
        })

        // !! Error Handler
        if (!task) {
            return res.status(400).send("!!!!! Unable to Delete task !!!!!")
        }

        // ^^ Response
        res.status(200).send('Task Deleted')

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to Find and delete task !!!!!")
    }
})


module.exports = taskRouter