const app = require('./app');
const {PORT} = process.env;     //can also be written as process.env.PORT

app.listen(PORT, (req, res) => {
    console.log(`Server is running at port ${PORT} ...`);
});