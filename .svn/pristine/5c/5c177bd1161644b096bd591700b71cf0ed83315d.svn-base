angular.module('home.services', ['services'])

.service('HomeServices', ['Services', '$rootScope', '$http', 'cacheService', function(Services, $rootScope, $http, cacheService) {
    return {
        getHomeData: function(collfun) {
            var data = {
                "reqHead": {
                    "functionId": "",
                    "terminalType": "3",
                    "terminalId": "",
                    "transTime": Services.getNowTime(),
                    "version": "1.0.0",
                    "clientIp": ""
                },
                "body": {
                }
            }
            $http.post($rootScope.homeUrl, angular.toJson(data)).success(function(data) {
                return collfun(data)
            });
        }
    };
}]);
