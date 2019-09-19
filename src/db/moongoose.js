// const mongoose = require('mongoose')

// const connectionUrl = 'mongodb://127.0.0.1:27017'
// const dbName = 'taskManager';

// mongoose.connect(`${connectionUrl}/task-manager-api`, {
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useUnifiedTopology: true
// })



// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         lowercase: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const me = new User({
//     name: 'Moi',
//     email: 'test@123.com',
//     age: 99,
//     password: 'passwo654rd'
// })

// me.save()
//     .then(result => {
//         console.log(result)
//     })
//     .catch(error => {
//         console.log(error)
//     })