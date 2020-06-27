const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

//---------------Task Routes------------------------
router.get('/tasks', async (req, res) => {
    try{
        const tasks = await Task.find({});
        if(tasks.length > 0) {
            console.log(tasks);
            res.send(tasks);
        }
        else {
            res.status(400);
            res.send("No tasks found");
        }
    }
    catch(ex) {
        res.send(500);
        res.send(ex);
    }

});

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try{
        await task.save();
        res.send(task);
    }
    catch(ex) {
        res.status(400);
        res.send(ex);
    }

});

router.get('/tasks/:id', async (req, res) => {
    console.log(req.params.id);
    const _id = req.params.id;
    try{
        const task = await Task.findById(_id);
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

router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    //restriction on key updates
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
        const updatedTask = await Task.findByIdAndUpdate(_id, req.body, { new : true, runValidators : true });
        //we can have error, no user with id, update success
        if(!updatedTask) {
            res.status(400);
            res.send("Something went wrong");
        }
        else {
            console.log(updatedTask);
            res.send(updatedTask);
        }
    }
    catch(ex) {
        res.status(500);
        res.send(ex);
    }

});

router.delete('/tasks/:id', async (req, res) => {
    const _id = req.params.id;

    try{
        const deletedTask = await Task.findByIdAndDelete(_id);
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