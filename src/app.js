const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
//---------use router------------
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("running server on : " + port);
});