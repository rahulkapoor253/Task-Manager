const mongoose = require('mongoose');
const User = require('../src/models/user');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser : true,
    useCreateIndex : true
});

//5ef211b15a393485025bf8c9
//promise chaining
// User.findByIdAndUpdate({_id :'5ef211b15a393485025bf8c9'}, {age : 30}).then((updatedUser) => {
//     console.log(updatedUser);
//     return User.countDocuments({ age : 30 });
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

//async await calls
const updateUserAge = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });
    console.log(user);
    const count = await User.countDocuments({ age });
    return count;
}

updateUserAge('5ef211b15a393485025bf8c9', 35).then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});