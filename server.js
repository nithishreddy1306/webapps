const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const io = require('socket.io')(server);
const socketIO = require('./server/socket-io');
const apis = require('./server/api');

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*"); //Allow all methods
    next();
});

socketIO(app, io);
apis(app);

server.listen(8080); //Server runs on port 8080