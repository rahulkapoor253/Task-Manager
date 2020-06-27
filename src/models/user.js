const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const Task = require('./task');

//to use middleware we need a schema in mongoose
const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true,
        trim : true
    },
    email : {
        type : String,
        unique : true,
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
    },
    tokens : [
        {
            token : {
                type : String,
                required : true
            }
        }
    ]
});

//we can also create virtual relationship between user/task
userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
});

//restrict data to show on each call
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

//generate auth token during logging in
userSchema.methods.generateAuthToken = async function () {
    const user = this;
    //need to convert _id to string as its objectID
    const token = jwt.sign({ _id : user._id.toString() }, "taskmanagerapp");
    console.log(token);
    //save token on user
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token;
}

//verify user email & password during login
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    if(!user) {
        throw new Error("no user with this email : " + email);
    }
    
    //it returns a boolean
    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched) {
        throw new Error("incorrect password supplied. Try again...");
    }
   
    //if all the supplied creds match
    return user;
};

//it is called before save operation is performed
userSchema.pre('save', async function(next) {
    const user = this;
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    //it will know when to perform the next operation
    next();
});

//delete all the related tasks of the user before the user is removed
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({ owner : user._id });//delete all the tasks with owner -> id

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;