// *****************************************************************************************
// ************************************ Main Application ***********************************
// *****************************************************************************************

// ?? Models
const User = require('./db/User')
const Task = require('./db/Task')
// const mon = require('./db/moongoose')

// ?? Routes
const userRouter = require('./routes/userRouter');
const taskRouter = require('./routes/taskRouter');

// ?? Vendor Modules
const express = require('express')
const helmet = require('helmet')
const chalk = require('chalk')
const mongoose = require('mongoose')
const {
    MongoClient
} = require('mongodb')


const log = console.log

const app = express()

// ?? Set headers with helmet
app.use(helmet())

app.use(express.json())
app.use(express.urlencoded())

// ************************************ Routes *********************************************
// ************************************ Users **********************************************

app.use(userRouter)
app.use(taskRouter)



// ************************************ Tasks **********************************************

// ************************************ Server *********************************************

const connectionUrl = 'mongodb://127.0.0.1:27017'
const dbName = 'taskManager';
const port = process.env.PORT || 8000;

// MongoClient.connect(connectionUrl, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true
// }, (error, client) => {
//     if (error) {
//         return log(chalk.redBright.bold.inverse("!!!!! Unable to connect to Mongo !!!!!"))
//     }

//     const db = client.db(dbName);

//     log(chalk.green.bold.inverse("<<<<< You are connected to Mongo >>>>>"))

// })

mongoose.connect(`${connectionUrl}/task-manager-api`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

app.listen(port, () => {
    log(chalk.green.bold.inverse(`<<<<< App is running on port ${port} >>>>>`))
})