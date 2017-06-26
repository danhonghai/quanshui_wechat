angular.module('home.controllers', ['services'])
    //首页
    .controller('HomeCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        //判断是否是首次进入系统从而控制是否跳转引导页
        if (!localStorage.guide) {
            $state.go('guide');
        }
        //跳转标详情页
        $scope.goprodetail = function(proid) {
            console.log(proid);
            $state.go('prodetail', { proid: proid, curside: "1" });
        }
        Services.ionicLoading();
        //获取首页数据
        HomeServices.getHomeData(function(data) {
            console.log(data);
            $ionicLoading.hide();
            if (data.bannerlist) {
                $scope.homebannerlists = data.bannerlist;
                $scope.xslist = data.xslist;
                $scope.borrowInfoPage = data.borrowInfoPage.items;
                $scope.noticList = data.noticList.items;
                var radialObjfun = function(index, value) {
                    var radialObj = $('#indicatorContainer' + index).radialIndicator({
                        radius: 70,
                        minValue: 0,
                        maxValue: 100,
                        barBgColor: '#ADD8FC',
                        barColor: '#198dfc',
                        initValue: 3,
                        format: '##%'

                    }).data('radialIndicator');
                    radialObj.animate(value);
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
                            radialObjfun(swiper.activeIndex, $scope.borrowInfoPage[swiper.activeIndex].apr);
                        }
                    });
                    radialObjfun(0, $scope.borrowInfoPage[0].apr);
                }, 1000);
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
    .controller('FeedbackCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        $scope.data = {};
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        console.log(userInfosession);
        $scope.feedbackbtn = function() {
            var paramterobj = {
                username: userInfosession.username,
                realname: $scope.data.name,
                content: $scope.data.problemtext
            }
            Services.getData("A036", paramterobj).success(function(data) {
                console.log(data);
                if (data.respHead.respCode == "000000") {
                    Services.ionicpopup('反馈成功', "感谢您的反馈，我们一定会及时改正！");
                    $scope.data = {};
                }
            });
        }

    }])
    .controller('securityCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        $scope.Hbody = $(window).height();
        var iframe = document.getElementById("iframe");

    }])
    .controller('integralmallCtrl', ['$scope', 'HomeServices', '$timeout', '$state', 'Services', '$ionicLoading', function($scope, HomeServices, $timeout, $state, Services, $ionicLoading) {
        if (sessionStorage.userInfo) {
            var paramterObj = {
                type: '1'
            }
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            $scope.integurl = "/apis/jfsc/webapp/goods.html?source=app&userId=" + userInfosession.id + "&sign=B78565A43A7D437267BAAB685B6E5F9D"
            Services.getData("A007", paramterObj).success(function(data) {
                console.log(data);
            });
            $scope.Hbody = $(window).height();
            var iframe = document.getElementById("iframe");
        }else{
            $state.go('login');
        }


    }]);
