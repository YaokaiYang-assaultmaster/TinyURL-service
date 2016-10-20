/**
 * Created by YangYaokai on 16/9/25.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var urlService = require('../services/urlService');
var statsService = require('../services/statsService');

router.post("/urls", jsonParser, function (req, res) {
    //如果请求以/api/v1开头则到这里处理。如果请求是post且以/urls开头，则用这个handler处理
    var longUrl = req.body.longUrl;
    urlService.getShortUrl(longUrl, function (url) {
        res.json(url);
    });

});

router.get("/urls/:shortUrl", function (req, res) {
    var shortUrl = req.params.shortUrl;
    urlService.getLongUrl(shortUrl, function(url) {
        res.json(url);
    });
});

router.get("/urls/:shortUrl/:info", function (req, res) {
    statsService.getUrlInfo(req.params.shortUrl, req.params.info, function (data) {
        res.json(data);
    });
});

module.exports = router; //返回require需要的东西。类似于java的return;