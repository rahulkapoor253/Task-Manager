const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//to use middleware we need a schema in mongoose
const userSchema = mongoose.Schema({
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

//it is called before save operation is performed
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    //it will know when to perform the next operation
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;