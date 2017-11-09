angular.module('starter', ['ionic', 'home.controllers', 'ngclipboard', 'money.controllers', 'my.controllers', 'home.services', 'money.services', 'my.services', 'CacheService', 'services'])
    //身份证号过滤器，隐藏中间8位年月日
    .filter('mpidcard', function() {
        return function(value) {
            if (!value) return '';
            var mpidcard = value.substr(0, 6) + '********' + value.substr(14);
            return mpidcard
        };
    })
    //手机号过滤器，隐藏中间4位
    .filter('mphone', function() {
        return function(value) {
            if (!value) return '';
            var mphone = value.substr(0, 3) + '****' + value.substr(7);
            return mphone
        };
    })
    //时间转化，20170323转成2017-03-23
    .filter('timeymd', function() {
        return function(value) {
            if (!value) return '';
            var timeymd = value.substr(0, 4) + '-' + value.substr(4, 2) + '-' + value.substr(6);
            return timeymd
        };
    })
    .run(function($ionicPlatform, $rootScope, $state, Services, $ionicHistory, $state, $interval) {
        console.log("%c 泉水金服 %c Copyright \xa9 2016%s", 'font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;font-size:90px;color:#00bbee;-webkit-text-fill-color:#00bbee;-webkit-text-stroke: 1px #00bbee;', "font-size:12px;color:#999999;", (new Date).getFullYear())
            //ionic基本配置
        $ionicPlatform.ready(function() {
            if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);

            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        //基础路劲配置
        $rootScope.baseUrl = "/apis/api/"; //首页
        $rootScope.homeUrl = "/apis/weixin/index.html"; //其他
        $rootScope.uploadtxUrl = "/apis/eps/appService/appGateway/upload.htm"; //上传头像
        $rootScope.gatewayUrl = "/apis/eps/appService/appGateway/pcrimg.htm"; //网关
        $rootScope.stateonline = false;
        $rootScope.debug = true;
        //点击按钮倒计时
        $rootScope.timer = function(time, buttonid) {
            var btn = $(buttonid);
            btn.attr("disabled", true); //按钮禁止点击
            btn.html(time <= 0 ? "发送动态密码" : ("" + (time) + "秒后可发送"));
            var hander = setInterval(function() {
                if (time <= 0) {
                    clearInterval(hander); //清除倒计时
                    btn.html("发送验证码");
                    btn.attr("disabled", false);
                    return false;
                } else {
                    btn.html("" + (time--) + "秒后可发送");
                }
            }, 1000);
        };
        if (sessionStorage.token) {
            $rootScope.tokentime = $interval(function(){
                Services.getDataget("refreshToken", "", function(tokendata){
                    Services.console(tokendata)
                    if (tokendata.code=="0000") {
                        Services.console(tokendata.data.token)
                        sessionStorage.token = tokendata.data.token;
                    }
                })
            },600000);
        }
        var online = onlinenetwork({
            "time": 1000,
            "url": ""
        })

        online.onLineHandler(function() {
            $rootScope.stateonline = false;
            $rootScope.$apply();
        })

        online.offLineHandler(function() {
            $rootScope.stateonline = true;
            $rootScope.$apply();

        })
    })

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$provide', '$httpProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $provide, $httpProvider, $locationProvider) {
    //安卓ios兼容性配置
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('standard');
    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');
    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $ionicConfigProvider.scrolling.jsScrolling(true);
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var param = function(obj) {
      var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      for(name in obj) {
        value = obj[name];
        if(value instanceof Array) {
          for(i=0; i<value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value instanceof Object) {
          for(subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
          }
        }
        else if(value !== undefined && value !== null)
          query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
      }
      return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
    var htmlv = "2017-10-19 09:21:08";
    //ionic路由
    $locationProvider.html5Mode(true);
    $stateProvider
        .state('tab', {
            url: '/tab',
            abstract: true,
            templateUrl: 'templates/tabs.html?v=' + htmlv
        })
        .state('tab.home', {
            url: '/home',
            views: {
                'tab-home': {
                    templateUrl: 'templates/home/tab-home.html?v=' + htmlv,
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('guide', {
            url: '/guide',
            templateUrl: 'templates/home/guide.html?v=' + htmlv,
            controller: 'GuideCtrl'
        })
        .state('security', {
            url: '/security',
            templateUrl: 'templates/home/security.html?v=' + htmlv
        })
        .state('newuser', {
            url: '/newuser',
            templateUrl: 'templates/home/newuser.html?v=' + htmlv
        })
        .state('aboutlist', {
            url: '/aboutlist',
            templateUrl: 'templates/home/aboutlist.html?v=' + htmlv
        })
        .state('problems', {
            url: '/problems',
            templateUrl: 'templates/home/problems.html?v=' + htmlv,
            controller: 'problemsCtrl'
        })
        .state('notice', {
            url: '/notice',
            templateUrl: 'templates/home/notice.html?v=' + htmlv,
            controller: 'noticeCtrl'
        })
        .state('news', {
            url: '/news',
            templateUrl: 'templates/home/news.html?v=' + htmlv,
            controller: 'securityCtrl'
        })
        .state('newsdetail', {
            url: '/newsdetail?newsid',
            templateUrl: 'templates/home/newsdetail.html?v=' + htmlv,
            controller: 'newsdetailCtrl'
        })
        .state('integralmall', {
            url: '/integralmall',
            templateUrl: 'templates/home/integralmall.html?v=' + htmlv,
            controller: 'integralmallCtrl'
        })
        .state('more', {
            url: '/more',
            templateUrl: 'templates/home/more.html?v=' + htmlv,
            controller: 'MoreCtrl'
        })
        .state('feedback', {
            url: '/feedback',
            templateUrl: 'templates/home/feedback.html?v=' + htmlv,
            controller: 'FeedbackCtrl'
        })
        .state('error', {
            url: '/error',
            templateUrl: 'templates/home/error.html?v=' + htmlv
        })
        .state('tab.mall', {
            url: '/mall',
            views: {
                'tab-mall': {
                    templateUrl: 'templates/mall/tab-mall.html?v=' + htmlv
                }
            }
        })
        .state('tab.money', {
            url: '/money',
            views: {
                'tab-money': {
                    templateUrl: 'templates/money/tab-money.html?v=' + htmlv,
                    controller: 'MoneyCtrl'
                }
            }
        })
        .state('prodetail', {
            url: '/prodetail?proid&transferRegisterRid&curside',
            templateUrl: 'templates/money/prodetail.html?v=' + htmlv,
            controller: 'ProdetailCtrl'
        })
        .state('propay', {
            url: '/propay?proid&transferRegisterRid&curside',
            templateUrl: 'templates/money/propay.html?v=' + htmlv,
            controller: 'PropayCtrl'
        })
        .state('calculator', {
            url: '/calculator?proid',
            templateUrl: 'templates/money/calculator.html?v=' + htmlv,
            controller: 'CalculatorCtrl'
        })
        .state('tab.my', {
            url: '/my',
            cache: false,
            views: {
                'tab-my': {
                    templateUrl: 'templates/my/tab-my.html?v=' + htmlv,
                    controller: 'MyCtrl'
                }
            }
        })
        .state('myuser', {
            url: '/myuser',
            templateUrl: 'templates/my/myuser.html?v=' + htmlv,
            controller: 'MyuserCtrl'
        })
        .state('forgotpass', {
            url: '/forgotpass',
            templateUrl: 'templates/my/forgotpass.html?v=' + htmlv,
            controller: 'ForgotpassCtrl'
        })
        .state('login', {
            url: '/login?ref&userno',
            templateUrl: 'templates/my/login.html?v=' + htmlv,
            controller: 'LoginCtrl'
        })
        .state('paymentmanage', {
            url: '/paymentmanage',
            templateUrl: 'templates/my/paymentmanage.html?v=' + htmlv,
            controller: 'PaymentmanageCtrl'
        })
        .state('borrowmanage', {
            url: '/borrowmanage',
            templateUrl: 'templates/my/borrowmanage.html?v=' + htmlv,
            controller: 'BorrowmanageCtrl'
        })
        .state('financial', {
            url: '/financial',
            templateUrl: 'templates/my/financial.html?v=' + htmlv,
            controller: 'FinancialCtrl'
        })
        .state('recharge', {
            url: '/recharge',
            templateUrl: 'templates/my/recharge.html?v=' + htmlv,
            controller: 'RechargeCtrl'
        })
        .state('rechargelist', {
            url: '/rechargelist?index',
            templateUrl: 'templates/my/rechargelist.html?v=' + htmlv,
            controller: 'RechargelistCtrl'
        })
        .state('withdrawal', {
            url: '/withdrawal',
            templateUrl: 'templates/my/withdrawal.html?v=' + htmlv,
            controller: 'WithdrawalCtrl'
        })
        .state('withdrawallist', {
            url: '/withdrawallist',
            templateUrl: 'templates/my/withdrawallist.html?v=' + htmlv,
            controller: 'WithdrawallistCtrl'
        })
        .state('myticket', {
            url: '/myticket?index',
            templateUrl: 'templates/my/myticket.html?v=' + htmlv,
            controller: 'MyticketCtrl'
        })
        .state('mypoints', {
            url: '/mypoints',
            templateUrl: 'templates/my/mypoints.html?v=' + htmlv,
            controller: 'MypointsCtrl'
        })
        .state('pointlist', {
            url: '/pointlist',
            templateUrl: 'templates/my/pointlist.html?v=' + htmlv,
            controller: 'PointlistCtrl'
        })
        .state('setting', {
            url: '/setting',
            templateUrl: 'templates/my/setting.html?v=' + htmlv,
            controller: 'SettingCtrl'
        })
        .state('setusername', {
            url: '/setusername',
            templateUrl: 'templates/my/setusername.html?v=' + htmlv,
            controller: 'SetusernameCtrl'
        })
        .state('address', {
            url: '/address',
            templateUrl: 'templates/my/address.html?v=' + htmlv,
            controller: 'SettingCtrl'
        })
        .state('manageaddress', {
            url: '/manageaddress',
            templateUrl: 'templates/my/manageaddress.html?v=' + htmlv,
            controller: 'ManageaddressCtrl'
        })
        .state('modifyemail', {
            url: '/modifyemail',
            templateUrl: 'templates/my/modifyemail.html?v=' + htmlv,
            controller: 'ModifyemailCtrl'
        })
        .state('mytransfer', {
            url: '/mytransfer',
            templateUrl: 'templates/my/mytransfer.html?v=' + htmlv,
            controller: 'MytransferCtrl'
        })
        .state('mytransferlist', {
            url: '/mytransferlist',
            templateUrl: 'templates/my/mytransferlist.html?v=' + htmlv,
            controller: 'MytransferlistCtrl'
        })
        .state('invitefriends', {
            url: '/invitefriends',
            templateUrl: 'templates/my/invitefriends.html?v=' + htmlv,
            controller: 'InvitefriendsCtrl'
        })
        .state('invitefriendslist', {
            url: '/invitefriendslist',
            templateUrl: 'templates/my/invitefriendslist.html?v=' + htmlv,
            controller: 'InvitefriendsCtrl'
        })
        .state('bankcard', {
            url: '/bankcard',
            templateUrl: 'templates/my/bankcard.html?v=' + htmlv,
            controller: 'BankcardCtrl'
        })
        .state('addbankcard', {
            url: '/addbankcard',
            templateUrl: 'templates/my/addbankcard.html?v=' + htmlv,
            controller: 'BankcardCtrl'
        })
        .state('leaderboard', {
            url: '/leaderboard',
            templateUrl: 'templates/home/leaderboard.html?v=' + htmlv,
            controller: 'LeaderboardCtrl'
        });
    if (localStorage.guide) {
        $urlRouterProvider.otherwise('/tab/home');
    } else {
        $urlRouterProvider.otherwise('/guide');
    }

}]);
