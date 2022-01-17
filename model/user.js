const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    //usually all of the properties inside the schema is object
    firstName:{
        type: String,
        default: null
    },
    lastName:{
        type: String,
        default: null
    },
    email:{
        type: String,
        unique: true,
        required: [true, 'email is mandatory']
    },
    password:{
        type: String
    },
    token: {
        type: String
    }
})

module.exports = mongoose.model('user', userSchema);