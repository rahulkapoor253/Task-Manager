const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT || 3000;

const multer = require('multer');
var upload = multer({ 
    dest: 'images',
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error("File extensions must be doc docx file"));
        }
        cb(undefined, true);
        // cb(undefined, false);
    }
});

app.post('/upload', upload.single('upload'), (req, res) => {
    res.send();
});

app.use(express.json());
//---------use router------------
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log("running server on : " + port);
});