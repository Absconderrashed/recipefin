const express = require('express');
const path = require('path');
const port = process.env.PORT || 8080;
const http = require('http');
const app = express();

const server = http.createServer(app).listen(port, ()=> console.log(`server started on port: ${port}`));
app.use(express.static(__dirname + '/dist'));

app.get('/', (req, res) =>{
    res.sendfile(path.resolve(__dirname, '/dist', 'index.html'))
});
