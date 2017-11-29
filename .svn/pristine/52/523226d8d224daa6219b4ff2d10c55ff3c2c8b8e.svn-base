angular.module('my.services', [])

.service('MyServices', ['$rootScope', 'Services', 'cacheService', '$http', function($rootScope, Services, cacheService, $http) {
    return {
        //获取用户红包列表
        getUserredb: function(functionId, userId, userNo, redPaperStatus, pageNumber, pageSize) {
        	var data = {
                "reqHead": {
                    "functionId": functionId,
                    "terminalType": "3",
                    "terminalId": "",
                    "transTime": Services.getNowTime(),
                    "version": "1.0.0",
                    "clientIp": ""
                },
                "body": {
                    userId: userId,
                    userNo: userNo,
                    redPaperStatus: redPaperStatus,
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
            }
            return cacheService.cacheObject('phoneCode', 0, $http.post, this, [$rootScope.baseUrl, angular.toJson(data)]);
        },
        //获取用户加息券列表
        getUserticket: function(functionId, userId, userNo, status, pageNumber, pageSize) {
        	var data = {
                "reqHead": {
                    "functionId": functionId,
                    "terminalType": "3",
                    "terminalId": "",
                    "transTime": Services.getNowTime(),
                    "version": "1.0.0",
                    "clientIp": ""
                },
                "body": {
                    userId: userId,
                    userNo: userNo,
                    status: status,
                    pageNumber: pageNumber,
                    pageSize: pageSize
                }
            }
            return cacheService.cacheObject('phoneCode', 0, $http.post, this, [$rootScope.baseUrl, angular.toJson(data)]);
        }
    }
}]);
