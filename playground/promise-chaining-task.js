//5ef212de9b0503850ac36719
const mongoose = require('mongoose');
const Task = require('../src/models/task');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser : true,
    useCreateIndex : true
});

//promise chaining
// Task.findByIdAndDelete({_id :'5ef212de9b0503850ac36719'}).then((deletedTask) => {
//     if(!deletedTask) {
//         console.log("No such task to delete");
//     }
//     else {
//         console.log(deletedTask);
//         return Task.countDocuments({ completed : false });
//     }
// }).then((result) => {
//     console.log(result);
// }).catch((err) => {
//     console.log(err);
// });

//5ef4c6bda64c6407ee06fc8e
const removeTaskCount = async (id) => {
    const removedTask = await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed : false });
    return count;
}

removeTaskCount('5ef4c6bda64c6407ee06fc8e').then((result) => {
    console.log(result);
}).catch((err) => {
    console.log(err);
});