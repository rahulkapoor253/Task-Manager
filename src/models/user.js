const mongoose = require('mongoose');
const validator = require('validator');

const User = mongoose.model('User', {
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        required : true,
        trim : true,
        lowercase : true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Enter a correct email and try again...");
            }
        }
    },
    password : {
        type : String,
        required : true,
        minlength : 5,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("password should not contain password itself");
            }
        }
    },
    age : {
        type : Number,
        default : 1,
        validate(value) {
            if(value <= 0) {
                throw new Error("age cant be zero or negative");
            }
        }
    }
});

module.exports = User;