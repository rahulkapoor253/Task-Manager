const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const auth = require('../middleware/auth');

//---------------Task Routes------------------------
router.get('/tasks', auth, async (req, res) => {
    try{
        // const tasks = await Task.find({});
        await req.user.populate('tasks').execPopulate();
        res.send(req.user.tasks);
    }
    catch(ex) {
        res.send(500);
        res.send(ex);
    }

});

router.post('/tasks', auth, async (req, res) => {
    //we need to specify task owner which will be user -> _id
    const task = new Task({
        ...req.body,
        owner : req.user._id
    });

    try{
        await task.save();
        console.log(task);
        res.send(task);
    }
    catch(ex) {
        res.status(400);
        res.send(ex);
    }

});

router.get('/tasks/:id', auth, async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;
    try{
        //const task = await Task.findById(_id);
        const task = await Task.findOne({ _id, owner : req.user._id });//we make sure the task we fetch is created by owner itself

        if(task) {
            console.log(task);
            res.send(task);
        }
        else {
            res.status(400);
            res.send("No task found with this id : " + _id);
        }
    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValid = updates.every((update) => {
        return allowedUpdates.includes(update);
    })

    if(!isValid) {
        return res.status(400).send("Invalid key update");
    }

    //in findidandupdate we just provide the fields that we want to be updated
    try{
        const task = await Task.findOne({ _id : req.params.id, owner : req.user._id });
       if(!task) {
        return res.status(404).send("Something went wrong during task update");
       }
       updates.forEach((update) => task[update] = req.body[update] );
       await task.save();
       res.send(task);

    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

router.delete('/tasks/:id', auth, async (req, res) => {
    try{
        const deletedTask = await Task.findOneAndDelete({ _id : req.params.id, owner : req.user._id });
        if(!deletedTask){
            res.status(400).send("No task with id : " + _id + " to delete");
        }
        else {
            res.send(deletedTask);
        }
    }catch(ex) {
        res.status(500).send(ex);
    }

});

module.exports = router;