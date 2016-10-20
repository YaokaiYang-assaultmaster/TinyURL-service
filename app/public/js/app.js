var app = angular.module("tinyurlApp", ["ngRoute", "ngResource", "chart.js"]);

app.config(function ($routeProvider) {
    $routeProvider
        .when("/", {   //当请求的url是"/"的时候，就用如下template和controller来处理。
            templateUrl: "./public/views/home.html",
            controller: "homeController"
        })
        .when("/urls/:shortUrl", {
            templateUrl: "./public/views/url.html",
            controller: "urlController"
        });
});