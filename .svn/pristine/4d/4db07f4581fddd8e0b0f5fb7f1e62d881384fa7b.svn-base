angular.module('money.services', [])

.service('MoneyServices', ['$rootScope', 'Services', 'cacheService', '$http', function($rootScope, Services, cacheService, $http) {
    return {
        getMoney: function(functionId, pageNumber, pageSize, nhsyOrder, qixianOrder, moneyOrder, touzijinduOrder) {
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
                    pageNumber: pageNumber,
                    pageSize: pageSize,
                    nhsyOrder:nhsyOrder, //年化收益排序
                    qixianOrder:qixianOrder, //投资期限排序
                    moneyOrder:moneyOrder, //理财金额排序
                    touzijinduOrder:touzijinduOrder //投资进度排序
                }
            }
            return cacheService.cacheObject('homebanner', 600, $http.post, this, [$rootScope.baseUrl, angular.toJson(data)]);
        }
    };
}]);
