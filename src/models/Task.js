const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema;

const taskSchema = Schema({
    description: {
        type: String,
        trim: true,
        lowercase: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
})

const Task = mongoose.model('Task', taskSchema)


module.exports = Task