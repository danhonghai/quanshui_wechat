angular.module('home.controllers', ['services'])
    //首页
    .controller('HomeCtrl', ['$scope', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, $timeout, $state, Services, $ionicLoading) {
        //判断是否是首次进入系统从而控制是否跳转引导页
        if (!localStorage.guide) {
            $state.go('guide');
        }
        //跳转标详情页
        $scope.goprodetail = function(proid) {
            //console.log(proid);
            $state.go('prodetail', { proid: proid, curside: "1" });
        }
        $scope.noticelink = function(newsid){
            //console.log(newsid);
            $state.go("newsdetail",{"newsid": newsid});
        }
        Services.ionicLoading();
        //获取首页数据
        var homedata = {
            type:1,
            count1:1,
            count2:2,
            count3:999,
            code:"platform_info"
        }
        Services.getData("noauth/bannerShow", 60000, homedata, function(data){
            $ionicLoading.hide();
            if (data.data.data) {
                $scope.homebannerlists = data.data.data;
                $scope.xslist = data.data.recommendBorrow;
                $scope.borrowInfoPage = data.data.rapidInvestmentBorrow;
                $scope.noticList = data.data.articles;
                var radialObjfun = function(index, value) {
                    Meter.setOptions({
                        element: 'meter'+index,
                        centerPoint: {
                            x: 90,
                            y: 90
                        },
                        radius: 90,
                        data: {
                            value: value*100,
                            title: '投资进度(%)',
                            subTitle: '',
                            area: [{
                                min: 0, max: 25, text: ''
                            },{
                                min: 25, max: 50, text: ''
                            },{
                                min: 50, max: 75, text: ''
                            },{
                                min: 75, max: 100, text: ''
                            }]
                        }
                    }).init();
                }
                $timeout(function() {
                    var swiper = new Swiper('.swiper-container1', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        autoHeight: true, //enable auto height
                        autoplay: 3000,
                        autoplayDisableOnInteraction: false,
                        loop: true
                    });
                    var swiper = new Swiper('.swiper-container3', {
                        pagination: '.swiper-pagination',
                        autoplay: 2000,
                        autoplayDisableOnInteraction: false,
                        loop: true
                    });
                    var swiper = new Swiper('.swiper-container2', {
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        onSlideChangeStart: function(swiper) {
                            radialObjfun(swiper.activeIndex, $scope.borrowInfoPage[swiper.activeIndex].planRat);
                        }
                    });
                    radialObjfun(0, $scope.borrowInfoPage[0].planRat);
                }, 100);
                
            }

        })
    }])
    .controller('GuideCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        if (localStorage.guide) {
            $state.go('tab.home');
        }
        $scope.enterfun = function() {
            localStorage.guide = "2017-3-23 15:44:00";
            $state.go('tab.home');
        }

    }])
    .controller('MoreCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {

    }])
    .controller('FeedbackCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicPopup', function($scope, HomeServices, $timeout, $state, Services, $ionicPopup) {
        $scope.data = {};
        var userInfosession = angular.fromJson(sessionStorage.userinfo);
        //console.log(userInfosession);
        $scope.feedbackbtn = function() {
            Services.getData("messageFeedback", 1, $scope.data, function(data){
            Services.console(data);
            if (data.code=="0000") {
                $scope.optionsPopup = $ionicPopup.show({
                    template: "<h4>反馈成功</h4>" + "<p>感谢您的宝贵意见，我们尽快改正。</p>",
                    title: "温馨提示",
                    scope: $scope,
                    buttons: [{
                        text: "返回",
                        type: "calm",
                        onTap: function(e) {
                            $scope.data.content ="";
                            $state.go("more");
                        }
                    }]
                });
            }else{
                Services.ionicpopup("温馨提示", data.msg)
            }
        })
        }

    }])
    .controller('securityCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        $scope.moredata = false; //控制加载更多
        var vm = [];
        $scope.doRefresh = function () {
            $scope.pageNumber = 0;
            vm = [];
            $scope.loadMore()
        };
        //上滑加载更多
        $scope.loadMore = function () {
            $scope.pageNumber += 1;
            var pointobj = {
                count: $scope.pageSize,
                pageNumber: $scope.pageNumber,
                code: "media_report"
            }
            Services.getReturnData("noauth/newsShow", pointobj).then(
            function successCallback(response) {
                Services.console(response);
                if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                    Services.console(response.data.data.articles);
                    vm = vm.concat(response.data.data.articles);
                    $scope.pointdetails = vm;
                    var wblength = response.data.data.articles.length;
                    if (wblength < $scope.pageSize) {
                        $scope.moredata = true;
                    }else{
                        $scope.moredata = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                }else{
                    Services.ionicpopup("",response.msg)
                }
            }, 
            function errorCallback(response) {
                Services.console(response);
                if(response.status=="401"){
                    $scope.optionsPopup = $ionicPopup.show({
                        template: "登录过期，请重新登录",
                        title: "温馨提示",
                        scope: $scope,
                        buttons: [{
                            text: "取消"
                        }, {
                            text: "重新登录",
                            type: "calm",
                            onTap: function(e) {
                                sessionStorage.token = "";
                                sessionStorage.__tempCache = "";
                                $state.go("login");
                            }
                        }]
                    });
                    return false;
                }else{
                    Services.ionicpopup("", "错误"+response.status+"<br>" + response.data.message)
                }
            });
        };
        $scope.linknews = function(newsid){
            //console.log(newsid);
            $state.go("newsdetail",{"newsid": newsid});
        }
    }])
    .controller('newsdetailCtrl', ['$scope', 'HomeServices', '$stateParams', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $stateParams, $state, Services, $ionicLoading) {
        if ($stateParams.newsid) {
            var pointobj = {
                id:$stateParams.newsid
            };
            Services.getReturnData("noauth/newsShowDetail", pointobj).then(
            function successCallback(response) {
                Services.console(response);
                if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                    $scope.newdetaildata = response.data.data.article;
                }else{
                    Services.ionicpopup("",response.msg);
                }
            }, 
            function errorCallback(response) {
                Services.console(response);
                if(response.status=="401"){
                    $scope.optionsPopup = $ionicPopup.show({
                        template: "登录过期，请重新登录",
                        title: "温馨提示",
                        scope: $scope,
                        buttons: [{
                            text: "取消"
                        }, {
                            text: "重新登录",
                            type: "calm",
                            onTap: function(e) {
                                sessionStorage.token = "";
                                sessionStorage.__tempCache = "";
                                $state.go("login");
                            }
                        }]
                    });
                    return false;
                }else{
                    Services.ionicpopup("","错误500<br>" + response.data.message);
                }
            });
        }

    }])
    .controller('noticeCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        $scope.moredata = false; //控制加载更多
        var vm = [];
        $scope.doRefresh = function () {
            $scope.pageNumber = 0;
            vm = [];
            $scope.loadMore()
        };
        //上滑加载更多
        $scope.loadMore = function () {
            $scope.pageNumber += 1;
            var pointobj = {
                count: $scope.pageSize,
                pageNumber: $scope.pageNumber,
                code: "platform_news"
            }
            Services.getReturnData("noauth/newsShow", pointobj).then(
            function successCallback(response) {
                Services.console(response);
                if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                    Services.console(response.data.data.articles);
                    vm = vm.concat(response.data.data.articles);
                    $scope.pointdetails = vm;
                    var wblength = response.data.data.articles.length;
                    if (wblength < $scope.pageSize) {
                        $scope.moredata = true;
                    }else{
                        $scope.moredata = false;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    $scope.$broadcast('scroll.refreshComplete');
                }else{
                    Services.ionicpopup("",response.msg)
                }
            }, 
            function errorCallback(response) {
                Services.console(response);
                if(response.status=="401"){
                    $scope.optionsPopup = $ionicPopup.show({
                        template: "登录过期，请重新登录",
                        title: "温馨提示",
                        scope: $scope,
                        buttons: [{
                            text: "取消"
                        }, {
                            text: "重新登录",
                            type: "calm",
                            onTap: function(e) {
                                sessionStorage.token = "";
                                sessionStorage.__tempCache = "";
                                $state.go("login");
                            }
                        }]
                    });
                    return false;
                }else{
                    Services.ionicpopup("", "错误"+response.status+"<br>" + response.data.message)
                }
            });
        };
        $scope.linknews = function(newsid){
            //console.log(newsid);
            $state.go("newsdetail",{"newsid": newsid});
        }
    }])
    .controller('problemsCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        Services.getData("noauth/helpCenter", 60, "", function(data){
            Services.console(data);
            $scope.helplists = data.data.article;
            for (var i = 0; i < $scope.helplists.length; i++) {
                $scope.helplists[i].success = false;
            }
        })
        $scope.findetailsfun = function(index){
            for (var j = 0; j < $scope.helplists.length; j++) {
                if (index!=j) {
                    $scope.helplists[j].success = false;
                }
            }
            $scope.helplists[index].success = !$scope.helplists[index].success;
        }

    }])
    .controller('LeaderboardCtrl', ['$scope', '$state', '$ionicHistory', '$ionicPopup', 'Services', '$ionicLoading', function(
        $scope, $state, $ionicHistory, $ionicPopup, Services, $ionicLoading) {
        var Leaderboardata = {
            count:20
        }
        $scope.datatop = [];
        $scope.databot = [];
        Services.getData("noauth/heroRank_xnk", 10, Leaderboardata, function(data){
            Services.console(data);
            $scope.data = data.data.userToRank;
            if ($scope.data.length<=3) {
                $scope.datatop = $scope.data;
            }else{
                for (var i = 0; i < $scope.data.length; i++) {
                    if (i<3) {
                        $scope.datatop.push($scope.data[i])
                    }else{
                        $scope.databot.push($scope.data[i])
                    }
                }
            }
            // //console.log($scope.datatop);
        })
    }])
    .controller('CallbackCtrl', ['$scope', '$timeout', '$state', 'Services', '$ionicLoading', '$location', '$interval', function($scope, $timeout, $state, Services, $ionicLoading, $location, $interval) {
        $scope.data = {
            time:4,
            msg:$location.search().msg,
            token:$location.search().token,
            code:$location.search().code,
            tab:$location.search().tab,
        };
        if ($location.search().token) {
            sessionStorage.token = $location.search().token;
        }
        $scope.linkfun = function (){
            $state.go("tab.my");
            $interval.cancel($scope.linktime);
        };
        $scope.linktime = setInterval(function(){
            if ($scope.data.time<=0) {
                $scope.data.time = "0";
                $scope.linkfun();
           }else{
                $scope.data.time--;
           }
        },1000); 
    }])
    .controller('integralmallCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        if (sessionStorage.userinfo) {
            var paramterObj = {
                type: '1'
            }
            var userInfosession = angular.fromJson(sessionStorage.userinfo);
            $scope.integurl = "/apis/jfsc/webapp/goods.html?source=app&userId=" + userInfosession.id + "&sign=B78565A43A7D437267BAAB685B6E5F9D"
            Services.getData("A007", paramterObj).success(function(data) {
                //console.log(data);
            });
            $scope.Hbody = $(window).height();
            var iframe = document.getElementById("iframe");
        }else{
            $state.go('login');
        }


    }]);
