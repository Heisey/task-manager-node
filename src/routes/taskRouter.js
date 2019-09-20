const express = require('express')
const chalk = require('chalk')

const taskRouter = new express.Router()
const log = console.log


const Task = require('../models/Task')

// ^^ Get Tasks
taskRouter.get('/tasks', async (req, res, next) => {
    try {

        // ^^ Query DB
        const tasks = await Task.find()

        // !! Error Handler
        if (!tasks) {
            log(chalk.red.bold.inverse("!!!!! Unable to get tasks !!!!!"))
            return res.status(500).send()
        }

        // ^^ Response
        res.send(tasks)

        // !! Error Handler
    } catch (err) {
        log(chalk.red.bold.inverse("!!!!! Unable to get tasks !!!!!"))
        res.status(500).send()
    }
})

// ^^ Get Task
taskRouter.get('/tasks/:id', async (req, res, next) => {

    // ## Task ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const task = await Task.findById(_id)

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
taskRouter.post('/tasks', async (req, res, next) => {

    // ## Create Task
    const task = new Task(req.body)

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
taskRouter.patch('/tasks/:id', async (req, res, next) => {

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
        const task = await Task.findByIdAndUpdate(_id, req.body, {
            new: true,
            runValidators: true
        })

        // !! Error Handler
        if (!task) {
            return res.status(400).send("!!!!! Unable to update task !!!!!")
        }

        // ^^ Response
        res.status(201).send(task)

        // !! Error Handler
    } catch (err) {
        res.status(400).send("!!!!! Unable to update task !!!!!")
    }
})

// ^^ Delete Task
taskRouter.delete('/tasks/:id', async (req, res) => {

    // ## Task ID
    const _id = req.params.id

    try {
        // ^^ Query DB
        const task = await Task.findById(_id)

        // ## Update Use
        updates.forEach(update => task[update] = req.body[update])

        // ^^ Query DB to save
        await task.save()

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