const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        trim: true,
        validate(value) {
            if (value === 'password') {
                throw new Error('Password cant be password')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be greater then 0')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// ?? Token Generator
userSchema.methods.generateAuthToken = async function () {

    // ## Genearte Token from user ID
    const token = await jwt.sign({
        _id: this._id.toString()
    }, 'dumbyString')

    // ## Add token to Array
    this.tokens = this.tokens.concat({
        token
    })

    // ## Save User
    this.save()

    // ## Return token
    return token
}

// ?? Login User
userSchema.statics.findByCredentials = async (email, password) => {

    // ^^ Query DB by email
    const user = await User.findOne({
        email
    })

    // !! Error Handler
    if (!user) {
        throw new Error('Failed to login')
    }

    // ## compare stored password with submitted password
    const isMatch = await bcrypt.compare(password, user.password)

    // !! Error Handler
    if (!isMatch) {
        throw new Error('Failed to login')
    }

    // ## Return user data
    return user
}

// ?? Hash Password
userSchema.pre('save', async function (next) {

    // ## Check to see if password has been modified
    if (this.isModified('password')) {

        // ## Encrypt Password
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User;