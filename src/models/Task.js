const mongoose = require('mongoose')
const validator = require('validator')

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})


module.exports = Task