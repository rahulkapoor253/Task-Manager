const app = require('./appnew');
const port = process.env.PORT;

app.listen(port, () => {
    console.log("running server on : " + port);
});