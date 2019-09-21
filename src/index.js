// *****************************************************************************************
// ************************************ Main Application ***********************************
// *****************************************************************************************

// ?? Models
const User = require('./models/User')
const Task = require('./models/Task')

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

app.use(userRouter)
app.use(taskRouter)



// ************************************ Security *******************************************



// ************************************ Tasks **********************************************

// ************************************ Server *********************************************

const connectionUrl = process.env.LOCAL_DB
const port = process.env.PORT || 3000;

mongoose.connect(`${connectionUrl}/task-manager-api`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, () => {
    log(chalk.green.bold.inverse(`<<<<< DataBase Connected to App >>>>>`))
})

app.listen(port, () => {
    log(chalk.green.bold.inverse(`<<<<< App is running on port ${port} >>>>>`))
})