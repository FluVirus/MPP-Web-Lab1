global.fileRepository = "userfiles/";

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require("fs-extra");
const path = require("path"); //todel
const mysql = require("mysql2");
const dao = require('./model/db/dbdao');

const controllerFiles = require("./controllers/controllerFiles.js");
const controllerMain = require("./controllers/controllerMain.js");

const app = express();
const urlParser = bodyParser.urlencoded({extended: false});

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.post('/deleteFiles', urlParser, controllerFiles.deleteFiles);
app.get('/downloadFile', urlParser, controllerFiles.downloadFile);
app.post('/uploadFile', urlParser, controllerFiles.uploadFile);
app.post('/updateContent', urlParser, controllerMain.updateContent);
app.post("/newTask", urlParser, controllerMain.newTask);
app.post("/deleteTask", urlParser, controllerMain.deleteTask);
//app.post("/filter", urlParser, controllerMain.filter);

app.get("/edit", controllerMain.edit);
app.get("/new", controllerMain.new);
//app.get("/details", controllerMain.details);
app.get("/", controllerMain.main);

app.get('*', controllerMain.notFound);

module.exports.server = app.listen(80);
