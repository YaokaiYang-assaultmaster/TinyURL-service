/**
 * Created by YangYaokai on 16/9/29.
 */
var express = require('express');
var router = express.Router();
var path = require('path');

router.get("/favicon.ico", function (req, res) {
    res.sendFile("favicon.ico", {root: path.join(__dirname, '../public/views/')});
});

router.get("/", function (req, res) {
    res.sendFile("index.html", {root : path.join(__dirname, '../public/views/')});
});

module.exports = router;