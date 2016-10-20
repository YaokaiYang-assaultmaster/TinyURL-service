/**
 * Created by YangYaokai on 16/9/25.
 */

var UrlModel = require("../models/urlModel");
var redis = require("redis");


//process.env. + 东西是node.js获取环境变量的方法
//传入环境变量的方法是在: node appname.js REDIS_PORT_6379_TCP_PORT = ...
//但是此处的两个环境变量docker会自动替我们填写
var port = process.env.REDIS_PORT_6379_TCP_PORT;
var host = process.env.REDIS_PORT_6379_TCP_ADDR;

var redisClient = redis.createClient(port, host);
redisClient.flushall();

var chars = [];
var genCharArray = function(chars) {
    for (var i = 0; i <= 61; i++) {
        if (i >= 0 && i <= 25) {
            chars[i] = String.fromCharCode(97 + i);
        } else if (i >= 26 && i <= 51) {
            chars[i] = String.fromCharCode(65 + i - 26);
        } else {
            chars[i] = String.fromCharCode(48 + i - 52);
        }
    }

    return chars;
}

chars = genCharArray(chars);

var getShortUrl = function (longUrl, callback) {
    if (longUrl.indexOf('http') === -1) {
        longUrl = "http://" + longUrl;
    }

    redisClient.get(longUrl, function (err, shortUrl) { //redisClient.get(key, function);
        if (shortUrl) {
            console.log("byebye mongo");
            callback({
                shortUrl: shortUrl,
                longUrl: longUrl
            });
        } else {
            UrlModel.findOne({longUrl: longUrl}, function (err, data) {
                //a callback function is put to this function.
                //Call back this function when I/O operation is finished.
                //if exists longUrl, a longUrl is sent back
                //if not, undefined is sent back.

                if (data) {
                    callback(data);
                    redisClient.set(data.shortUrl, data.longUrl);
                    redisClient.set(data.longUrl, data.shortUrl);
                } else { //if shortUrl not exist
                    generateShortUrl(function (shortUrl) {
                        var url = new UrlModel({
                            shortUrl: shortUrl,
                            longUrl: longUrl
                        });
                        url.save();
                        callback(url);
                        redisClient.set(shortUrl, longUrl);
                        redisClient.set(longUrl, shortUrl);
                    })
                }
            });
        }
    });

};


/* My code for convert decimal to base-62 value */
var generateShortUrl = function (callback) {

    UrlModel.count({}, function (err, num) {
        callback(decimalTransfer(num + 1));
    });
};

var decimalTransfer = function(len) { //transfer a decimal value to a 62-nary value
    var ret = "";

    while (len) {
        var curr = len % 62;
        ret = chars[curr - 1] + ret;
        len = Math.floor(len / 62);
    }

    return ret;
}


var getLongUrl = function (shortUrl, callback) {
    redisClient.get(shortUrl, function(err, longUrl) {
       if (longUrl) {
           console.log("byebye mongo");
           callback({
               shortUrl: shortUrl,
               longUrl: longUrl
           });
       } else {
           UrlModel.findOne({shortUrl: shortUrl}, function (err, data) {
              callback(data);
               redisClient.set(shortUrl, longUrl);
               redisClient.set(longUrl, shortUrl);
           });
       }
    });
};

module.exports = {
    getShortUrl: getShortUrl,
     getLongUrl: getLongUrl
};