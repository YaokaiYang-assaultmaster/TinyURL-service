/**
 * Created by YangYaokai on 16/9/25.
 */
var express = require('express');
var app = express(); //create server
var restRouter = require('./routes/rest');
var redirectRouter = require('./routes/redirect');
var indexRouter = require('./routes/index');
var mongoose = require('mongoose');
var useragent = require('express-useragent');

mongoose.connect("[put your mongodb URL here]");

app.use("/public", express.static(__dirname + "/public"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));

//接收到的所有http请求放到如下命令中处理，解析后把得到整个文件再装回request中。相当于预处理http请求。
//只希望这部分代码处理post请求，所以放到这个位置。
app.use(useragent.express());

app.use("/api/v1", restRouter); //如果url以/api/v1开头

app.use("/", indexRouter);

app.use("/:shortUrl", redirectRouter); //":"的意思是其后跟的是一个变量，express会做模式匹配

app.listen(3000);

