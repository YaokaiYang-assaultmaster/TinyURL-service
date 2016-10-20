/**
 * Created by YangYaokai on 16/9/29.
 */
angular.module("tinyurlApp")
    .controller("homeController", ["$scope", "$http", "$location", function($scope, $http, $location) {
        //scope关联了view中的输入框等元素和controller里的相对应的model
        $scope.submit = function () {
            $http.post("/api/v1/urls", {
                longUrl: $scope.longUrl
            }).success(function (data) {
                $location.path("/urls/" + data.shortUrl);
            }); //当请求成功返回时，用success()处理
        }
    }]);