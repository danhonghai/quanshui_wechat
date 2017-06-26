angular.module('services', [])
    .service('Services', ['$http', '$rootScope', 'cacheService', '$ionicLoading', '$ionicPopup', '$state', '$filter', function($http, $rootScope, cacheService, $ionicLoading, $ionicPopup, $state, $filter) {
        return {
            //请求数据遮罩层
            ionicLoading: function() {
                $ionicLoading.show({
                    template: '请稍后...',
                    hideOnStateChange: true, //切换视图隐藏
                    duration: 15000 //后台长时间没响应，15秒后自动隐藏
                });
            },
            //时间转化成多长时间前
            zhtime: function(timesdata) {
                var date = new Date();    
                var seperator1 = "-";    
                var seperator2 = ":";    
                var month = date.getMonth() + 1;    
                var strDate = date.getDate();    
                if (month >= 1 && month <= 9) {        
                    month = "0" + month;    
                }    
                if (strDate >= 0 && strDate <= 9) {        
                    strDate = "0" + strDate;    
                }    
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate             + " " + date.getHours() + seperator2 + date.getMinutes()             + seperator2 + date.getSeconds();
                var dateSplitted = timesdata.split(' '); // date must be in DD-MM-YYYY format
                var hmm = angular.toJson(dateSplitted[1]); //"15:39:04"
                var ymd = angular.toJson(dateSplitted[0]); //"2016-3-30"
                var hmmspli = hmm.split(':'); //[""15", "39", "04""]
                var ymdspli = ymd.split('-'); //[""2016", "2", "30""]
                var nowdateSplitted = currentdate.split(' '); // date must be in DD-MM-YYYY format
                var nowhmm = angular.toJson(nowdateSplitted[1]); //"16:10:59"
                var nowymd = angular.toJson(nowdateSplitted[0]); //"2016-03-30"
                var nowhmmspli = nowhmm.split(':'); //[""16", "11", "34""]
                var nowymdspli = nowymd.split('-'); //[""2016", "03", "30""]
                var showymd = (ymdspli[1] + "/" + ymdspli[2]).substring(0, 5);
                if (nowymdspli[0].split('"')[1] - ymdspli[0].split('"')[1] > 0) {
                    // if (nowymdspli[1] - ymdspli[1] >= 0) {
                    //     return timesdata;
                    // } else if (nowymdspli[1] - ymdspli[1] < 0) {
                    //     return nowymdspli[1] - ymdspli[1] + 12 + "个月前";
                    // }
                    return showymd
                } else {
                    if (nowymdspli[1] - ymdspli[1] > 0) {
                        // return nowymdspli[1] - ymdspli[1] + "个月前";
                        return showymd
                    } else {
                        if (nowymdspli[2].split('"')[0] - ymdspli[2].split('"')[0] > 0) {
                            // return nowymdspli[2].split('"')[0] - ymdspli[2].split('"')[0] + "天前";
                            return showymd
                        } else {
                            if (nowhmmspli[0].split('"')[1] - hmmspli[0].split('"')[1] > 0) {
                                return nowhmmspli[0].split('"')[1] - hmmspli[0].split('"')[1] + "小时前";
                            } else {
                                if (nowhmmspli[1] - hmmspli[1] > 0) {
                                    return nowhmmspli[1] - hmmspli[1] + "分钟前";
                                } else {
                                    return nowhmmspli[2].split('"')[0] - hmmspli[2].split('"')[0] + "秒前";
                                }
                            }
                        }
                    }
                }

            },
            //获取当前时间
            getNowTime: function() {
                var date = new Date();
                var seperator1 = "";
                var seperator2 = "";
                var month = date.getMonth() + 1;
                var strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();
                return currentdate;
            },
            //获取服务器时间
            getServerTime: function(day, backfun) {
                $http.post("http://192.168.5.17:8080/eps/getSystemTime.htm").success(function(data){
                    var begintime = $filter('date')(data.time,'yyyy-MM-dd');
                    var endtime = $filter('date')(data.time+86400000*day,'yyyy-MM-dd');
                    backfun(begintime + '_' + endtime)
                })
            },
            //主要的数据接口
            getData: function(functionId, parameter) {
                var data = {
                    "reqHead": {
                        "functionId": functionId,
                        "terminalType": "3",
                        "terminalId": "",
                        "transTime": this.getNowTime(),
                        "version": "1.0.0",
                        "clientIp": ""
                    },
                    "body": parameter
                }
                return cacheService.cacheObject(functionId, 600, $http.post, this, [$rootScope.baseUrl, angular.toJson(data)]);
            },
            //上传头像
            getupdatatx: function(functionId, parameter) {
                var data = {
                    "reqHead": {
                        "functionId": functionId,
                        "terminalType": "3",
                        "terminalId": "",
                        "transTime": this.getNowTime(),
                        "version": "1.0.0",
                        "clientIp": ""
                    },
                    "body": parameter
                }
                return cacheService.cacheObject(functionId, 600, $http.post, this, [$rootScope.uploadtxUrl, angular.toJson(data)]);
            },
            //弹出提示框
            ionicpopup: function(title, template) {
                $ionicPopup.alert({
                    title: title,
                    template: template
                });
            }
        };
    }]);
