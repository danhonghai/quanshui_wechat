angular.module('my.controllers', [])
    //我的
    .controller('MyCtrl', ['$scope', '$state', '$ionicHistory', '$ionicPopup', 'Services', '$ionicLoading', function(
        $scope, $state, $ionicHistory, $ionicPopup, Services, $ionicLoading) {
        if (!localStorage.guide) {
            $state.go('guide');
        }
        $scope.showShare = function() {
            $scope.optionsPopup = $ionicPopup.show({
                template: "您未登入，是否立即登入",
                title: "温馨提示",
                scope: $scope,
                buttons: [{
                    text: "返回",
                    // type: "button-positive",
                    onTap: function(e) {
                        $ionicHistory.goBack();
                    }
                }, {
                    text: "立即登入",
                    type: "button-positive",
                    onTap: function(e) {
                        $state.go('login');
                    }
                }]
            });
        }
        if (sessionStorage.userInfo) {
            //已登入
            Services.ionicLoading();
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            var parameterObj = {
                    userId: userInfosession.id,
                    userNo: userInfosession.userNo
                }
                //获取用户信息
            Services.getData("A014", parameterObj).success(function(data) {
                console.log(data);
                $scope.userInfosession = data.body;
                //获取用户账户信息
                Services.getData("A015", parameterObj).success(function(data) {
                    console.log(data);
                    $ionicLoading.hide();
                    $scope.userUserInfoData = data.body;
                });
            });
            //跳转红包页面，根据参数定位到红包或者加息券
            $scope.gomyticket = function(index) {
                $state.go('myticket', {
                    index: index
                });
            }
        } else {
            $scope.showShare();
        }
        $scope.$on("$ionicView.unloaded", function() {
            if ($scope.optionsPopup) {
                $scope.optionsPopup.close();
            }
        });
    }])
    //登入注册
    .controller('LoginCtrl', ['$scope', '$rootScope', 'Services', '$ionicPopup', '$ionicLoading', '$state', '$stateParams', function(
        $scope, $rootScope, Services, $ionicPopup, $ionicLoading, $state, $stateParams) {
        $scope.data = {};
        $scope.logintabtit = [{
            name: "登入",
            success: true
        }, {
            name: "注册",
            success: false
        }];
        $scope.imgkey = Services.getNowTime();
        $scope.data.imgcode = $rootScope.gatewayUrl + "?imgKey=" + Services.getNowTime();
        //刷新图片验证码
        $scope.imgcodefun = function() {
                $scope.imgkey = Services.getNowTime();
                $scope.data.imgcode = $rootScope.gatewayUrl + "?imgKey=" + Services.getNowTime();
            }
            //登入注册切换
        $scope.logintabfun = function(index) {
            for (var i = 0, len = $scope.logintabtit.length; i < len; i++) {
                if (index === i) {
                    $scope.logintabtit[i].success = true;
                } else {
                    $scope.logintabtit[i].success = false;
                }
            }
        }
        $scope.agreexy = function() {
                $scope.play_lights = !$scope.play_lights;
            }
            //获取手机验证码
        $scope.getphoneCodefun = function() {
                var codeparameterObj = {
                    mobileNo: $scope.data.phone,
                    busiType: "01",
                    imgKey: $scope.imgkey,
                    imgCode: $scope.data.inimgcode
                }
                if ($scope.data.phone) {
                    if ($scope.data.inimgcode) {
                        Services.ionicLoading();
                        Services.getData("A001", codeparameterObj).success(function(data) {
                            console.log(data);
                            $ionicLoading.hide();
                            if (data.respHead.respCode == "000000") {
                                $rootScope.timer(60, "#sendButton_reg");
                                Services.ionicpopup('发送成功', "验证码发送成功！");
                            } else {
                                Services.ionicpopup('发送失败', "验证码发送失败，请重试！");
                            }
                        });
                    } else {
                        Services.ionicpopup('发送失败', "请输入图片验证码");
                    }
                } else {
                    Services.ionicpopup('发送失败', "请输入手机号");
                }
            }
            //注册
        $scope.register = function() {
                var registerparameterObj = {
                    mobileNo: $scope.data.phone,
                    password: $scope.data.password,
                    userType: "1",
                    verifyCode: $scope.data.code,
                    busiType: "01",
                    invateCode: $scope.data.yqm,
                }
                var parameterObj = {
                    loginId: $scope.data.phone,
                    password: $scope.data.password
                }
                if ($stateParams.ref) {
                    registerparameterObj.ref = $stateParams.ref;
                }
                Services.ionicLoading();
                Services.getData("A010", registerparameterObj).success(function(data) {
                    console.log(data);
                    if (data.respHead.respCode == "000000") {
                        Services.getData("A011", parameterObj).success(function(data) {
                            $ionicLoading.hide();
                            console.log(data);
                            sessionStorage.userInfo = angular.toJson(data.body);
                        });
                        $ionicPopup.show({
                                template: "感谢您的注册！",
                                title: "注册成功",
                                scope: $scope,
                                buttons: [{
                                    text: "返回首页",
                                    // type: "button-positive",
                                    onTap: function(e) {
                                        $state.go('tab.home');
                                    }
                                }, {
                                    text: "立即投资",
                                    type: "button-positive",
                                    onTap: function(e) {
                                        $state.go('tab.money');
                                    }
                                }]
                            })
                            .then(function(res) {
                                //按钮回调
                            });
                    } else {
                        $ionicLoading.hide();
                        Services.ionicpopup('注册失败', data.respHead.respMsg);
                    }
                });
            }
            //登入
        $scope.login = function() {
            var loginparameterObj = {
                loginId: $scope.data.loginphone,
                password: $scope.data.loginpassword
            }
            Services.ionicLoading();
            Services.getData("A011", loginparameterObj).success(function(data) {
                $ionicLoading.hide();
                console.log(data);
                sessionStorage.userInfo = angular.toJson(data.body);
                if (data.respHead.respCode == "000000") {
                    $state.go('tab.my');
                } else {
                    Services.ionicpopup('登入失败', data.respHead.respMsg);
                }
            });
        }
    }])
    //忘记密码
    .controller('ForgotpassCtrl', ['$scope', '$rootScope', 'Services', '$ionicPopup', '$ionicLoading', '$state', function(
        $scope, $rootScope, Services, $ionicPopup, $ionicLoading, $state) {
        $scope.data = {};
        $scope.imgkey = Services.getNowTime();
        $scope.data.imgcode = $rootScope.gatewayUrl + "?imgKey=" + Services.getNowTime();
        //刷新图片验证码
        $scope.imgcodefun = function() {
                $scope.imgkey = Services.getNowTime();
                $scope.data.imgcode = $rootScope.gatewayUrl + "?imgKey=" + Services.getNowTime();
            }
            //获取手机验证码
        $scope.getphoneCodefun = function() {
            var codeparameterObj = {
                mobileNo: $scope.data.phone,
                busiType: "02",
                imgKey: $scope.imgkey,
                imgCode: $scope.data.inimgcode
            }
            if ($scope.data.phone) {
                if ($scope.data.inimgcode) {
                    Services.ionicLoading();
                    Services.getData("A001", codeparameterObj).success(function(data) {
                        console.log(data);
                        $ionicLoading.hide();
                        if (data.respHead.respCode == "000000") {
                            $rootScope.timer(60, "#sendButton_reg");
                            Services.ionicpopup('发送成功', "验证码发送成功！");
                        } else {
                            Services.ionicpopup('发送失败', "验证码发送失败，请重试！");
                        }
                    });
                } else {
                    Services.ionicpopup('发送失败', "请输入图片验证码");
                }
            } else {
                Services.ionicpopup('发送失败', "请输入手机号");
            }
        }
        $scope.backPassword = function() {
            var parameterObj = {
                mobileNo: $scope.data.phone,
                password: $scope.data.password,
                verifyCode: $scope.data.yzm,
                busiType: "02"
            }
            Services.ionicLoading();
            Services.getData("A012", parameterObj).success(function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    $ionicPopup.show({
                        template: "密码重置成功！",
                        title: "温馨提示",
                        scope: $scope,
                        buttons: [{
                            text: "立即登入",
                            type: "button-positive",
                            onTap: function(e) {
                                $state.go('login');
                            }
                        }]
                    })
                } else {
                    Services.ionicpopup('温馨提示', data.respHead.respMsg);
                }
            });
        }
    }])
    //充值
    .controller('RechargeCtrl', ['$scope', '$state', '$http', function($scope, $state, $http) {
        $scope.data = {};
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        $scope.clearmoney = function() {
            console.log($scope.data.money);
            $scope.data.money = "";
        }
        $scope.rechargelist = function(index) {
            $state.go("rechargelist", {
                index: index
            })
        }
        $scope.rechargefun = function() {
            // var paramenter = {
            //     "functionId": "A032",
            //     "terminalType": "3",
            //     "terminalId": "",
            //     "transTime": "",
            //     "version": "1.0.0",
            //     "clientIp": "",
            //     userId: userInfosession.id,
            //     userNo: userInfosession.userNo,
            //     money: $scope.data.money
            // }
            $http.get(
                '/apis/eps/appService/appGateway.htm?functionId=A032&terminalType=3&terminalId=&transTime=&version=1.0.0&clientIp=&userId=' +
                userInfosession.id + '&userNo=' + userInfosession.userNo + '&money=' + $scope.data.money).success(function(
                data) {
                console.log(data);
            });
        }
    }])
    //充值列表
    .controller('RechargelistCtrl', ['$scope', '$timeout', '$rootScope', 'Services', '$ionicPopup', '$ionicLoading',
        '$state', '$stateParams',
        function($scope, $timeout, $rootScope, Services, $ionicPopup, $ionicLoading, $state,
            $stateParams) {
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            $scope.prolisttit = [{
                name: "充值记录",
                success: true
            }, {
                name: "提现记录",
                success: false
            }]
            Services.ionicLoading();
            var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                pageNumber: "",
                pageSize: ""
            }
            var functionid = ""
            $scope.protittopfc = function(index) {
                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index == i) {
                        $scope.prolisttit[i].success = true;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
                if (index == 0) {
                    functionid = "A018"
                } else {
                    functionid = "A019"
                }
                Services.getData(functionid, parameterObj).success(function(data) {
                    console.log(data);
                    $ionicLoading.hide();
                    if (data.respHead.respCode == "000000") {
                        $scope.rechargeData = data.body.list ? data.body.list : [];
                    }
                });
            }
            if (!$stateParams.index) {
                $scope.protittopfc(0);
            } else {
                $scope.protittopfc($stateParams.index);
            }
        }
    ])
    //提现
    .controller('WithdrawalCtrl', ['$scope', '$state', function($scope, $state) {
        $scope.data = {};
        $scope.clearmoney = function() {
            console.log($scope.data.money);
            $scope.data.money = "";
        }
        $scope.rechargelist = function(index) {
            $state.go("rechargelist", {
                index: index
            })
        }
        // mobiscroll.scroller('#select_bank', {
        //     theme: "ios",
        //     display: "bottom",
        //     lang: "zh",
        //     wheels: [
        //         [{
        //             label: '选择银行',
        //             data: ['工商银行1', '工商银行2', '工商银行3', '工商银行4', '工商银行5', '工商银行6', '工商银行7', '工商银行8']
        //         }]
        //     ]
        // });
    }])
    //提现列表
    .controller('WithdrawallistCtrl', ['$scope', '$timeout', '$rootScope', 'MyServices', 'Services', '$ionicPopup',
        '$ionicLoading', '$state', '$stateParams',
        function($scope, $timeout, $rootScope, MyServices, Services,
            $ionicPopup, $ionicLoading, $state, $stateParams) {
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            Services.ionicLoading();
            var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                pageNumber: "",
                pageSize: ""
            }
            Services.getData("A019", parameterObj).success(function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    $scope.withdrawalData = data.body.list ? data.body.list : [];
                }
            });
        }
    ])
    //修改头像
    .controller('MyuserCtrl', ['$scope', '$rootScope', 'Services', function($scope, $rootScope, Services) {
        $scope.shtx = false;
        $scope.data = {
            backimgtx: ""
        };
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var parameterObj = {
            userId: userInfosession.id,
            userNo: userInfosession.userNo
        }
        Services.getData("A014", parameterObj).success(function(data) {
            console.log(data);
            $scope.userInfosession = data.body;
            $scope.data.backimgtx = data.body.imagePath;
        });
        $("#imgFile").change(function(e) {
            console.log(e);
            var files = this.files;
            var reader = new FileReader();
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
                console.log(e);
                var mb = (e.total / 1024) / 1024;
                if (mb >= 2) {
                    Services.ionicpopup('上传失败', "文件大小大于2M");
                    return;
                } else {
                    console.log(this.result);
                    $scope.data.backimgtx = this.result;
                    $scope.$apply();
                    console.log(this.result.split(",")[1]);
                    var updatatx = {
                        userNo: userInfosession.userNo,
                        imgFile: this.result.split(",")[1]
                    }
                    $.ajax({
                        type: 'post',
                        url: $rootScope.uploadtxUrl,
                        dataType: 'json',
                        data: JSON.stringify(updatatx),
                        success: function(resData) {
                            console.log(resData);
                            if (resData.respHead.respCode == "000000") {
                                Services.ionicpopup('提示', "上传成功");
                            } else {
                                Services.ionicpopup('提示', resData.respHead.respMsg);
                            }
                        }
                    });
                }
            }
        });
    }])
    //还款管理
    .controller('PaymentmanageCtrl', ['$scope', '$timeout', function($scope, $timeout) {
        $scope.prolisttit = [{
            name: "默认",
            success: true
        }, {
            name: "近7天",
            success: false
        }, {
            name: "近1个月",
            success: false
        }, {
            name: "近2个月",
            success: false
        }, {
            name: "近6个月",
            success: false
        }, {
            name: "近1年",
            success: false
        }, ]
        $timeout(function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            });
        }, 500);
        $scope.protittopfc = function(index) {
            for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                if (index === i) {
                    $scope.prolisttit[i].success = true;
                } else {
                    $scope.prolisttit[i].success = false;
                }
            }
        }
    }])
    //还款记录
    .controller('BorrowmanageCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.prolisttit = [{
            name: "默认",
            numday: 0,
            success: true
        }, {
            name: "近7天",
            numday: 7,
            success: false
        }, {
            name: "近1个月",
            numday: 30,
            success: false
        }, {
            name: "近2个月",
            numday: 60,
            success: false
        }, {
            name: "近6个月",
            numday: 180,
            success: false
        }, {
            name: "近1年",
            numday: 365,
            success: false
        }, ]
        $scope.borrowstatelists = [{
            name: "投标中",
            success: true
        }, {
            name: "还款中",
            success: false
        }, {
            name: "已完结",
            success: false
        }]
        $timeout(function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            });
        }, 500);
        $scope.moredata = false; //控制加载更多
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var vm = [];
        var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                startTime: "",
                endTime: "",
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            //获取数据
        $scope.getMoneyData = function(parameterObj) {
                Services.getData("A021", parameterObj).success(function(data) {
                        console.log(data);
                        if (data.respHead.respCode == "000000") {
                            vm = [];
                            $scope.financialData = data.body.list ? data.body.list : [];
                        }
                        if (data.body.totalPage == 1) {
                            $scope.moredata = true;
                        } else {
                            $scope.moredata = false;
                        }

                        $scope.pageNumber = 0;
                    })
                    .
                finally(function() {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
            //下拉刷 新
        $scope.doRefresh = function() {
            parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            for (var i = $scope.borrowstatelists.length - 1; i >= 0; i--) {
                if ($scope.borrowstatelists[i].success) {
                    parameterObj.tenderStatus = i;
                    parameterObj.pageNumber = 1;
                    $scope.getMoneyData(parameterObj);
                }
            }
        };
        //上拉加载
        $scope.loadMore = function() {
            $scope.pageNumber += 1;
            console.log($scope.pageNumber);
            parameterObj.pageNumber = $scope.pageNumber;
            parameterObj.pageSize = $scope.pageSize;
            console.log(parameterObj);
            Services.getData("A021", parameterObj).success(function(data) {
                console.log(data);
                if (data.respHead.respCode == "000000") {
                    vm = vm.concat(data.body.list ? data.body.list : []);
                    $scope.financialData = vm;
                    if ($scope.pageNumber >= data.body.totalPage) {
                        $scope.moredata = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                console.log($scope.financialData);
            }).error(function() {});
        };
        //时间筛选
        $scope.protittopfc = function(index) {
                $scope.financialData = [];
                vm = [];
                $scope.pageNumber = 0;
                if (index == 0) {
                    parameterObj.startTime = "";
                    parameterObj.endTime = "";
                } else {
                    Services.getServerTime($scope.prolisttit[index].numday, function(data) {
                        console.log(data);
                        var spicdata = data.split("_");
                        parameterObj.startTime = spicdata[0];
                        parameterObj.endTime = spicdata[1];
                        console.log(parameterObj);
                    })
                }
                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index === i) {
                        $scope.prolisttit[i].success = true;
                        $scope.moredata = false;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
            }
            //状态切换
        $scope.borrowstatefun = function(index) {
            $scope.financialData = [];
            vm = [];
            $scope.pageNumber = 0;
            for (var i = 0, len = $scope.borrowstatelists.length; i < len; i++) {
                if (index === i) {
                    parameterObj.tenderStatus = i;
                    $scope.moredata = false;
                    $scope.borrowstatelists[i].success = true;
                } else {
                    $scope.borrowstatelists[i].success = false;
                }
            }
        }
    }])
    //理财记录
    .controller('FinancialCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.prolisttit = [{
            name: "默认",
            numday: 0,
            success: true
        }, {
            name: "近7天",
            numday: 7,
            success: false
        }, {
            name: "近1个月",
            numday: 30,
            success: false
        }, {
            name: "近2个月",
            numday: 60,
            success: false
        }, {
            name: "近6个月",
            numday: 180,
            success: false
        }, {
            name: "近1年",
            numday: 365,
            success: false
        }, ]
        $scope.borrowstatelists = [{
            name: "投标中",
            success: true
        }, {
            name: "还款中",
            success: false
        }, {
            name: "已完结",
            success: false
        }]
        $timeout(function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            });
        }, 500);
        $scope.moredata = false; //控制加载更多
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var vm = [];
        var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                startTime: "",
                endTime: "",
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            //获取数据
        $scope.getMoneyData = function(parameterObj) {
                Services.getData("A020", parameterObj).success(function(data) {
                        console.log(data);
                        if (data.respHead.respCode == "000000") {
                            vm = [];
                            $scope.financialData = data.body.list ? data.body.list : [];
                        }
                        if (data.body.totalPage == 1) {
                            $scope.moredata = true;
                        } else {
                            $scope.moredata = false;
                        }

                        $scope.pageNumber = 0;
                    })
                    .
                finally(function() {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
            //下拉刷新
        $scope.doRefresh = function() {
            parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            for (var i = $scope.borrowstatelists.length - 1; i >= 0; i--) {
                if ($scope.borrowstatelists[i].success) {
                    parameterObj.tenderStatus = i;
                    parameterObj.pageNumber = 1;
                    $scope.getMoneyData(parameterObj);
                }
            }
        };
        //上拉加载
        $scope.loadMore = function() {
            $scope.pageNumber += 1;
            console.log($scope.pageNumber);
            parameterObj.pageNumber = $scope.pageNumber;
            parameterObj.pageSize = $scope.pageSize;
            console.log(parameterObj);
            Services.getData("A020", parameterObj).success(function(data) {
                console.log(data);
                if (data.respHead.respCode == "000000") {
                    vm = vm.concat(data.body.list ? data.body.list : []);
                    $scope.financialData = vm;
                    if ($scope.pageNumber >= data.body.totalPage) {
                        $scope.moredata = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                console.log($scope.financialData);
            }).error(function() {});
        };
        //时间筛选
        $scope.protittopfc = function(index) {
                vm = [];
                $scope.pageNumber = 0;
                if (index == 0) {
                    parameterObj.startTime = "";
                    parameterObj.endTime = "";
                } else {
                    Services.getServerTime($scope.prolisttit[index].numday, function(data) {
                        console.log(data);
                        var spicdata = data.split("_");
                        parameterObj.startTime = spicdata[0];
                        parameterObj.endTime = spicdata[1];
                        console.log(parameterObj);
                        $scope.getMoneyData(parameterObj);
                    })
                }
                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index === i) {
                        $scope.prolisttit[i].success = true;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
            }
            //状态切换
        $scope.borrowstatefun = function(index) {
            vm = [];
            $scope.pageNumber = 0;
            for (var i = 0, len = $scope.borrowstatelists.length; i < len; i++) {
                if (index === i) {
                    parameterObj.tenderStatus = i;
                    $scope.borrowstatelists[i].success = true;
                } else {
                    $scope.borrowstatelists[i].success = false;
                }
            }
            $scope.getMoneyData(parameterObj);
        }
    }])
    //红包加息券
    .controller('MyticketCtrl', ['$scope', '$rootScope', 'MyServices', 'Services', '$ionicPopup', '$ionicLoading', '$state',
        '$stateParams',
        function($scope, $rootScope, MyServices, Services, $ionicPopup, $ionicLoading, $state,
            $stateParams) {
            $scope.prolisttit = [{
                name: "红包",
                success: true
            }, {
                name: "加息券",
                success: false
            }]
            $scope.borrowstatelists = [{
                name: "未使用",
                success: true
            }, {
                name: "已使用",
                success: false
            }, {
                name: "已过期",
                success: false
            }, {
                name: "已冻结",
                success: false
            }]
            $scope.redblists = [];
            $scope.raiselists = [];
            $scope.functionId = "";
            Services.ionicLoading();
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            $scope.getmyredbdata = function(functionId, userId, userNo, redPaperStatus, pageNumber, pageSize) {
                MyServices.getUserredb(functionId, userId, userNo, redPaperStatus, pageNumber, pageSize).success(function(
                    data) {
                    console.log(data);
                    $ionicLoading.hide();
                    if (data.respHead.respCode == "000000") {
                        $scope.redblists = data.body.list ? data.body.list : [];
                    }
                    console.log($scope.redblists);
                });
            }
            $scope.getmyticketdata = function(functionId, userId, userNo, status, pageNumber, pageSize) {
                MyServices.getUserticket(functionId, userId, userNo, status, pageNumber, pageSize).success(function(data) {
                    console.log(data);
                    $ionicLoading.hide();
                    if (data.respHead.respCode == "000000") {
                        $scope.raiselists = data.body.list ? data.body.list : [];
                    }
                    console.log($scope.raiselists);
                });
            }
            $scope.showticketlists = [];
            $scope.protittopfc = function(index) {
                if (index == 0) {
                    $scope.functionId = "A016";
                    $scope.getmyredbdata($scope.functionId, userInfosession.id, userInfosession.userNo, "0", "1", "50")
                } else {
                    $scope.functionId = "A046";
                    $scope.getmyticketdata($scope.functionId, userInfosession.id, userInfosession.userNo, "0", "1", "50")
                }

                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index == i) {
                        $scope.prolisttit[i].success = true;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
                for (var i = 0, len = $scope.borrowstatelists.length; i < len; i++) {
                    if (i == 0) {
                        $scope.borrowstatelists[i].success = true;
                    } else {
                        $scope.borrowstatelists[i].success = false;
                    }
                }
            }
            $scope.borrowstatefun = function(index) {
                for (var i = 0, len = $scope.borrowstatelists.length; i < len; i++) {
                    if (index == i) {
                        $scope.borrowstatelists[i].success = true;
                    } else {
                        $scope.borrowstatelists[i].success = false;
                    }
                }
                if ($scope.functionId == "A016") {
                    if (index == 0) {
                        $scope.getmyredbdata($scope.functionId, userInfosession.id, userInfosession.userNo, "0", "1", "50")
                    } else if (index == 1) {
                        $scope.getmyredbdata($scope.functionId, userInfosession.id, userInfosession.userNo, "2", "1", "50")
                    } else if (index == 2) {
                        $scope.getmyredbdata($scope.functionId, userInfosession.id, userInfosession.userNo, "3", "1", "50")
                    } else {
                        $scope.getmyredbdata($scope.functionId, userInfosession.id, userInfosession.userNo, "4", "1", "50")
                    }
                } else {
                    $scope.getmyticketdata($scope.functionId, userInfosession.id, userInfosession.userNo, index, "1", "50")
                }

            }

            $scope.protittopfc($stateParams.index)
        }
    ])
    //积分签到
    .controller('MypointsCtrl', ['$scope', '$timeout', '$stateParams', 'Services', '$ionicLoading', function($scope,
        $timeout, $stateParams, Services, $ionicLoading) {
        Services.ionicLoading();
        var spanclass = "yqd" //csd dq
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        console.log(userInfosession);
        var qddate = new Date();
        $scope.qddataarr = [];
        $scope.datatextlist = [];
        $scope.day = qddate.getDate();
        $scope.continuousopint = 0;
        $scope.pointstate = {
            name: "签到",
            success: false
        }
        $scope.year = qddate.getFullYear();
        $scope.month = qddate.getMonth() + 1;
        var dqmonth = qddate.getMonth() + 1;
        var dqyear = qddate.getFullYear();
        var pdparameterObj = {
            userId: userInfosession.id,
            year: "",
            month: ""
        }
        var d = new Date();
        var curMonthDays = new Date(d.getFullYear(), (d.getMonth() + 1), 0).getDate();
        var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo
            }
            //获取用户账户信息
        Services.getData("A015", parameterObj).success(function(data) {
            console.log(data);
            $ionicLoading.hide();
            $scope.userUserInfoData = data.body;
        });

        function contains(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) {
                    return true;
                }
            }
            return false;
        }
        //获取当月签到数据
        $scope.getqdlist = function(year, month) {
                qddate = new Date(year, month, 0);
                qddate.setDate(1);
                var Mfirstday = qddate.getDay();
                curMonthDays = new Date(qddate.getFullYear(), (qddate.getMonth() + 1), 0).getDate();
                pdparameterObj.year = year;
                pdparameterObj.month = month;
                Services.getData("A077", pdparameterObj).success(function(data) {
                    console.log(data);
                    if (data.respHead.respCode == "000000") {
                        $scope.datatextlist = [];
                        $scope.continuousopint = data.body.signDays;
                        var qddayarr = data.body.signDayStr.split(",");
                        c = [];
                        for (var h = 0; h < qddayarr.length; h++) {
                            c.push(parseInt(qddayarr[h]));
                        }
                        for (m = 0; m < curMonthDays + Mfirstday; m++) {
                            if (m >= Mfirstday) {
                                var i = m - Mfirstday + 1
                                if ($scope.day == i && dqmonth == month && dqyear == year) {
                                    spanclass = "dq"
                                    if (contains(c, i)) {
                                        $scope.pointstate = {
                                            name: "已签到",
                                            success: true
                                        }
                                    } else {
                                        $scope.pointstate = {
                                            name: "签到",
                                            success: false
                                        }
                                    }
                                } else {
                                    if (i > $scope.day && dqmonth == month && dqyear == year) {
                                        spanclass = ""
                                    } else {
                                        if (contains(c, i)) {
                                            spanclass = "yqd"
                                        } else {
                                            spanclass = "csd"
                                        }
                                    }
                                }
                                $scope.datatextlist.push({
                                    name: "<span class='" + spanclass + "'>" + i + "</span>"
                                });
                            } else {
                                spanclass = ""
                                $scope.datatextlist.push({
                                    name: "<span class='" + spanclass + "'></span>"
                                });
                            }
                        }
                    }
                });
            }
            //左右滑动切换月份
        $scope.switchM = function(switchway) {
                if (switchway == 'left') {
                    var afterM = $scope.month - 1;
                    if (afterM <= 0) {
                        $scope.year = $scope.year - 1;
                        $scope.month = 12;
                        $scope.getqdlist($scope.year, $scope.month);
                    } else {
                        $scope.month = afterM;
                        $scope.getqdlist($scope.year, $scope.month);
                    }
                } else {
                    var afterM = $scope.month + 1;
                    if (afterM <= dqmonth || dqyear > $scope.year) {
                        if (afterM > 12) {
                            $scope.year = $scope.year + 1;
                            $scope.month = 1;
                            $scope.getqdlist($scope.year, $scope.month);
                        } else {
                            $scope.month = afterM;
                            $scope.getqdlist($scope.year, $scope.month);
                        }
                    }
                }
            }
            //点击签到
        $scope.pointbtn = function() {
            Services.ionicLoading();
            var parapoint = {
                userNo: userInfosession.userNo,
                userId: userInfosession.id,
                username: userInfosession.username
            }
            Services.getData("A065", parapoint).success(function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    Services.ionicpopup('温馨提示', "签到成功");
                    $scope.pointstate = {
                        name: "已签到",
                        success: true
                    }
                } else {
                    Services.ionicpopup('温馨提示', data.respHead.respMsg);
                }
            })
        }
        $scope.getqdlist($scope.year, $scope.month);

    }])
    //积分记录
    .controller('PointlistCtrl', ['$scope', '$timeout', '$rootScope', 'Services', '$ionicPopup', '$ionicLoading', '$state',
        '$stateParams',
        function($scope, $timeout, $rootScope, Services, $ionicPopup, $ionicLoading, $state,
            $stateParams) {
            Services.ionicLoading();
            $scope.prolisttit = [{
                name: "默认",
                success: true
            }, {
                name: "近7天",
                success: false
            }, {
                name: "近1个月",
                success: false
            }, {
                name: "近2个月",
                success: false
            }, {
                name: "近6个月",
                success: false
            }, {
                name: "近1年",
                success: false
            }, ]
            $timeout(function() {
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    slidesPerView: 4,
                    paginationClickable: true,
                    spaceBetween: 0,
                    freeMode: true
                });
            }, 500);
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            var parameterObj = {
                    userId: userInfosession.id,
                    userNo: userInfosession.userNo,
                    cdFlag: "",
                    pageNumber: "",
                    pageSize: ""
                }
                //获取用户积分列表
            Services.getData("A017", parameterObj).success(function(data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    $scope.pointlists = data.body.list ? data.body.list : [];
                }
            });
            //列表筛选
            $scope.protittopfc = function(index) {
                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index === i) {
                        $scope.prolisttit[i].success = true;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
            }
        }
    ])
    //设置
    .controller('SettingCtrl', ['$scope', '$timeout', '$stateParams', '$state', 'Services', function($scope, $timeout,
        $stateParams, $state, Services) {
        $scope.settingdata = angular.fromJson(sessionStorage.userInfo);
        console.log($scope.settingdata);
        var parameterObj = {
                userId: $scope.settingdata.id,
                userNo: $scope.settingdata.userNo
            }
            //获取用户数据
        Services.getData("A014", parameterObj).success(function(data) {
            console.log(data);
            if (data.respHead.respCode == "000000") {
                $scope.settingaddressdata = data.body;
            }
        });
        //退出登入
        $scope.exitfun = function() {
            sessionStorage.userInfo = "";
            $state.go('login');
        }
    }])
    //添加地址
    .controller('ManageaddressCtrl', ['$scope', '$timeout', '$rootScope', 'Services', '$ionicPopup', '$ionicLoading',
        '$state', '$stateParams',
        function($scope, $timeout, $rootScope, Services, $ionicPopup, $ionicLoading, $state,
            $stateParams) {
            $scope.data = {};
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            console.log(userInfosession);
            $scope.data.name = userInfosession.realname;
            $scope.data.phone = userInfosession.username;
            $scope.manageaddressfun = function() {
                    Services.ionicLoading();
                    console.log($scope.data);
                    var parameterObj = {
                            userNo: userInfosession.userNo,
                            address: $scope.data.addr + $scope.data.addres
                        }
                        //新增地址
                    Services.getData("A083", parameterObj).success(function(data) {
                        console.log(data);
                        $ionicLoading.hide();
                    });
                }
                //地址三级联动
            $(function() {
                function getAddrsArrayById(id) {
                    var results = [];
                    if (addr_arr[id] != undefined)
                        addr_arr[id].forEach(function(subArr) {
                            results.push({
                                key: subArr[0],
                                val: subArr[1]
                            });
                        });
                    else {
                        return;
                    }
                    return results;
                }

                function getStartIndexByKeyFromStartArr(startArr, key) {
                    var result = 0;
                    if (startArr != undefined)
                        startArr.forEach(function(obj, index) {
                            if (obj.key == key) {
                                result = index;
                                return false;
                            }
                        });
                    return result;
                }
                $("#myAddrs").click(function() {
                    var PROVINCES = [],
                        startCities = [],
                        startDists = [];
                    addr_arr[0].forEach(function(prov) {
                        PROVINCES.push({
                            key: prov[0],
                            val: prov[1]
                        });
                    });
                    var $input = $(this),
                        dataKey = $input.attr("data-key"),
                        provKey = 1, //default province 北京
                        cityKey = 36, //default city 北京
                        distKey = 37, //default district 北京东城区
                        distStartIndex = 0, //default 0
                        cityStartIndex = 0, //default 0
                        provStartIndex = 0; //default 0
                    if (dataKey != "" && dataKey != undefined) {
                        var sArr = dataKey.split("-");
                        if (sArr.length == 3) {
                            provKey = sArr[0];
                            cityKey = sArr[1];
                            distKey = sArr[2];
                        } else if (sArr.length == 2) { //such as 台湾，香港 and the like.
                            provKey = sArr[0];
                            cityKey = sArr[1];
                        }
                        startCities = getAddrsArrayById(provKey);
                        startDists = getAddrsArrayById(cityKey);
                        provStartIndex = getStartIndexByKeyFromStartArr(PROVINCES, provKey);
                        cityStartIndex = getStartIndexByKeyFromStartArr(startCities, cityKey);
                        distStartIndex = getStartIndexByKeyFromStartArr(startDists, distKey);
                    }
                    var navArr = [{ //3 scrollers, and the title and id will be as follows:
                        title: "省",
                        id: "scs_items_prov"
                    }, {
                        title: "市",
                        id: "scs_items_city"
                    }, {
                        title: "区",
                        id: "scs_items_dist"
                    }];
                    SCS.init({
                        navArr: navArr,
                        onOk: function(selectedKey, selectedValue) {
                            $scope.data.addr = selectedValue.replace(/\s+/g, "");
                            $input.val(selectedValue).attr("data-key", selectedKey);
                        }
                    });
                    var distScroller = new SCS.scrollCascadeSelect({
                        el: "#" + navArr[2].id,
                        dataArr: startDists,
                        startIndex: distStartIndex
                    });
                    var cityScroller = new SCS.scrollCascadeSelect({
                        el: "#" + navArr[1].id,
                        dataArr: startCities,
                        startIndex: cityStartIndex,
                        onChange: function(selectedItem, selectedIndex) {
                            distScroller.render(getAddrsArrayById(selectedItem.key), 0); //re-render distScroller when cityScroller change
                        }
                    });
                    var provScroller = new SCS.scrollCascadeSelect({
                        el: "#" + navArr[0].id,
                        dataArr: PROVINCES,
                        startIndex: provStartIndex,
                        onChange: function(selectedItem, selectedIndex) { //re-render both cityScroller and distScroller when provScroller change
                            cityScroller.render(getAddrsArrayById(selectedItem.key), 0);
                            distScroller.render(getAddrsArrayById(cityScroller.getSelectedItem().key), 0);
                        }
                    });
                });
            });
        }
    ])
    //绑定邮箱
    .controller('ModifyemailCtrl', ['$scope', '$timeout', '$rootScope', 'Services', '$ionicPopup', '$ionicHistory',
        '$state', '$stateParams',
        function($scope, $timeout, $rootScope, Services, $ionicPopup, $ionicHistory, $state,
            $stateParams) {
            $scope.data = {};
            var userInfosession = angular.fromJson(sessionStorage.userInfo);
            console.log(userInfosession);
            var parameterObj = {
                    email: "",
                    type: 1
                }
                //发送邮箱验证码
            $scope.getemailCodefun = function() {
                    parameterObj.email = $scope.data.email;
                    Services.getData("A049", parameterObj).success(function(data) {
                        console.log(data);
                        if (data.respHead.respCode == "000000") {
                            Services.ionicpopup('发送成功', "请查看邮箱");
                        } else {
                            Services.ionicpopup('发送失败', data.respHead.respMsg);
                        }
                    });
                }
                //绑定邮箱
            $scope.bindemail = function() {
                var bindparameterObj = {
                    email: $scope.data.email,
                    type: 2,
                    userId: userInfosession.id,
                    userNo: userInfosession.userNo,
                    code: $scope.data.yzm,
                    userType: userInfosession.userType
                }
                console.log('');
                Services.getData("A049", bindparameterObj).success(function(data) {
                    console.log(data);
                    if (data.respHead.respCode == "000000") {
                        $ionicPopup.show({
                            template: "感谢您的绑定！",
                            title: "绑定成功",
                            scope: $scope,
                            buttons: [{
                                text: "确定",
                                type: "button-positive",
                                onTap: function(e) {
                                    $ionicHistory.goBack();
                                }
                            }]
                        })
                    } else {
                        Services.ionicpopup('绑定失败', data.respHead.respMsg);
                    }
                });
            }
        }
    ])
    //债权转让
    .controller('MytransferCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.prolisttit = [{
            name: "默认",
            numday: 0,
            success: true
        }, {
            name: "近7天",
            numday: 7,
            success: false
        }, {
            name: "近1个月",
            numday: 30,
            success: false
        }, {
            name: "近2个月",
            numday: 60,
            success: false
        }, {
            name: "近6个月",
            numday: 180,
            success: false
        }, {
            name: "近1年",
            numday: 365,
            success: false
        }, ]
        $timeout(function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            });
        }, 500);
        $scope.moredata = false; //控制加载更多
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var vm = [];
        var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                startTime: "",
                endTime: "",
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            //获取数据
        $scope.getMoneyData = function(parameterObj) {
                Services.getData("A029", parameterObj).success(function(data) {
                        console.log(data);
                        if (data.respHead.respCode == "000000") {
                            vm = [];
                            $scope.financialData = data.body.list ? data.body.list : [];
                        }
                        if (data.body.totalPage == 1) {
                            $scope.moredata = true;
                        } else {
                            $scope.moredata = false;
                        }
                        $scope.pageNumber = 0;
                    })
                    .
                finally(function() {
                    // 停止广播ion-refresher
                    $scope.$broadcast('scroll.refreshComplete');
                });
            }
            //下拉刷新
        $scope.doRefresh = function() {
            parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
        };
        //上拉加载
        $scope.loadMore = function() {
            $scope.pageNumber += 1;
            console.log($scope.pageNumber);
            parameterObj.pageNumber = $scope.pageNumber;
            parameterObj.pageSize = $scope.pageSize;
            console.log(parameterObj);
            Services.getData("A029", parameterObj).success(function(data) {
                console.log(data);
                if (data.respHead.respCode == "000000") {
                    vm = vm.concat(data.body.list ? data.body.list : []);
                    $scope.financialData = vm;
                    if ($scope.pageNumber >= data.body.totalPage) {
                        $scope.moredata = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                console.log($scope.financialData);
            }).error(function() {});
        };
        //时间筛选
        $scope.protittopfc = function(index) {
            $scope.financialData = [];
            vm = [];
            $scope.pageNumber = 0;
            if (index == 0) {
                parameterObj.startTime = "";
                parameterObj.endTime = "";
            } else {
                Services.getServerTime($scope.prolisttit[index].numday, function(data) {
                    console.log(data);
                    var spicdata = data.split("_");
                    parameterObj.startTime = spicdata[0];
                    parameterObj.endTime = spicdata[1];
                    console.log(parameterObj);
                })
            }
            for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                if (index === i) {
                    $scope.prolisttit[i].success = true;
                    $scope.moredata = false;
                } else {
                    $scope.prolisttit[i].success = false;
                }
            }
        }
    }])
    //债权转让记录
    .controller('MytransferlistCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.prolisttit = [{
            name: "默认",
            numday: 0,
            success: true
        }, {
            name: "近7天",
            numday: 7,
            success: false
        }, {
            name: "近1个月",
            numday: 30,
            success: false
        }, {
            name: "近2个月",
            numday: 60,
            success: false
        }, {
            name: "近6个月",
            numday: 180,
            success: false
        }, {
            name: "近1年",
            numday: 365,
            success: false
        }, ]
        $scope.borrowstatelists = [{
            name: "转让中",
            success: true
        }, {
            name: "已完成",
            success: false
        }, {
            name: "已承接",
            success: false
        }]
        $timeout(function() {
            var swiper = new Swiper('.swiper-container', {
                pagination: '.swiper-pagination',
                slidesPerView: 4,
                paginationClickable: true,
                spaceBetween: 0,
                freeMode: true
            });
        }, 500);
        $scope.moredata = false; //控制加载更多
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 10; //分页一页显示几条
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var vm = [];
        var parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                startTime: "",
                endTime: "",
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            //获取数据
        $scope.getMoneyData = function(parameterObj) {
                Services.getData("A020", parameterObj).success(function(data) {
                        console.log(data);
                        if (data.respHead.respCode == "000000") {
                            vm = [];
                            $scope.financialData = data.body.list ? data.body.list : [];
                        }
                        if (data.body.totalPage == 1) {
                            $scope.moredata = true;
                        } else {
                            $scope.moredata = false;
                        }
                        $scope.pageNumber = 0;
                    })
                    .finally(function() {
                        // 停止广播ion-refresher
                        $scope.$broadcast('scroll.refreshComplete');
                    });
            }
            //下拉刷新
        $scope.doRefresh = function() {
            parameterObj = {
                userId: userInfosession.id,
                userNo: userInfosession.userNo,
                tenderStatus: 0,
                pageNumber: $scope.pageNumber,
                pageSize: $scope.pageSize
            }
            for (var i = $scope.borrowstatelists.length - 1; i >= 0; i--) {
                if ($scope.borrowstatelists[i].success) {
                    parameterObj.tenderStatus = i;
                    parameterObj.pageNumber = 1;
                    $scope.getMoneyData(parameterObj);
                }
            }
        };
        //上拉加载
        $scope.loadMore = function() {
            $scope.pageNumber += 1;
            console.log($scope.pageNumber);
            parameterObj.pageNumber = $scope.pageNumber;
            parameterObj.pageSize = $scope.pageSize;
            console.log(parameterObj);
            Services.getData("A020", parameterObj).success(function(data) {
                console.log(data);
                if (data.respHead.respCode == "000000") {
                    vm = vm.concat(data.body.list ? data.body.list : []);
                    $scope.financialData = vm;
                    if ($scope.pageNumber >= data.body.totalPage) {
                        $scope.moredata = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
                console.log($scope.financialData);
            }).error(function() {});
        };
        //时间筛选
        $scope.protittopfc = function(index) {
                $scope.financialData = [];
                vm = [];
                $scope.pageNumber = 0;
                if (index == 0) {
                    parameterObj.startTime = "";
                    parameterObj.endTime = "";
                } else {
                    Services.getServerTime($scope.prolisttit[index].numday, function(data) {
                        console.log(data);
                        var spicdata = data.split("_");
                        parameterObj.startTime = spicdata[0];
                        parameterObj.endTime = spicdata[1];
                        console.log(parameterObj);
                    })
                }
                for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                    if (index === i) {
                        $scope.prolisttit[i].success = true;
                        $scope.moredata = false;
                    } else {
                        $scope.prolisttit[i].success = false;
                    }
                }
            }
            //状态切换
        $scope.borrowstatefun = function(index) {
            $scope.financialData = [];
            vm = [];
            $scope.pageNumber = 0;
            for (var i = 0, len = $scope.borrowstatelists.length; i < len; i++) {
                if (index === i) {
                    parameterObj.tenderStatus = i;
                    $scope.moredata = false;
                    $scope.borrowstatelists[i].success = true;
                } else {
                    $scope.borrowstatelists[i].success = false;
                }
            }
        }
    }])
    //邀请好友
    .controller('InvitefriendsCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.invitedbtn = function() {
            Services.ionicpopup('复制成功', "您可以使用粘贴操作了！");
        }
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        var parameterObj = {
            userId: userInfosession.id
        }
        var parameterlistObj = {
                userId: userInfosession.id,
                pageId: 1,
                recordNum: 9999
            }
            //获取邀请链接和邀请码
        Services.getData("A086", parameterObj).success(function(data) {
            console.log(data);
            if (data.respHead.respCode == "000000") {
                $scope.invitefriends = data.body;
            }
        });
        //获取邀请记录
        Services.getData("A087", parameterlistObj).success(function(data) {
            console.log(data);
            if (data.respHead.respCode == "000000") {
                $scope.invitefriendlists = data.body;
            }
        });
    }])
    //银行卡管理
    .controller('BankcardCtrl', ['$scope', '$timeout', 'Services', function($scope, $timeout, Services) {
        $scope.data = {};
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        $(function() {
            function getAddrsArrayById(id) {
                var results = [];
                if (addr_arr[id] != undefined)
                    addr_arr[id].forEach(function(subArr) {
                        results.push({
                            key: subArr[0],
                            val: subArr[1]
                        });
                    });
                else {
                    return;
                }
                return results;
            }

            function getStartIndexByKeyFromStartArr(startArr, key) {
                var result = 0;
                if (startArr != undefined)
                    startArr.forEach(function(obj, index) {
                        if (obj.key == key) {
                            result = index;
                            return false;
                        }
                    });
                return result;
            }
            $("#myAddrs").click(function() {
                var PROVINCES = [],
                    startCities = [],
                    startDists = [];
                addr_arr[0].forEach(function(prov) {
                    PROVINCES.push({
                        key: prov[0],
                        val: prov[1]
                    });
                });
                var $input = $(this),
                    dataKey = $input.attr("data-key"),
                    provKey = 1, //default province 北京
                    cityKey = 36, //default city 北京
                    distKey = 37, //default district 北京东城区
                    distStartIndex = 0, //default 0
                    cityStartIndex = 0, //default 0
                    provStartIndex = 0; //default 0
                if (dataKey != "" && dataKey != undefined) {
                    var sArr = dataKey.split("-");
                    if (sArr.length == 3) {
                        provKey = sArr[0];
                        cityKey = sArr[1];
                        distKey = sArr[2];
                    } else if (sArr.length == 2) { //such as 台湾，香港 and the like.
                        provKey = sArr[0];
                        cityKey = sArr[1];
                    }
                    startCities = getAddrsArrayById(provKey);
                    startDists = getAddrsArrayById(cityKey);
                    provStartIndex = getStartIndexByKeyFromStartArr(PROVINCES, provKey);
                    cityStartIndex = getStartIndexByKeyFromStartArr(startCities, cityKey);
                    distStartIndex = getStartIndexByKeyFromStartArr(startDists, distKey);
                }
                var navArr = [{ //3 scrollers, and the title and id will be as follows:
                    title: "省",
                    id: "scs_items_prov"
                }, {
                    title: "市",
                    id: "scs_items_city"
                }, {
                    title: "区",
                    id: "scs_items_dist"
                }];
                SCS.init({
                    navArr: navArr,
                    onOk: function(selectedKey, selectedValue) {
                        $scope.data.addr = selectedValue.replace(/\s+/g, "");
                        $input.val(selectedValue).attr("data-key", selectedKey);
                    }
                });
                var distScroller = new SCS.scrollCascadeSelect({
                    el: "#" + navArr[2].id,
                    dataArr: startDists,
                    startIndex: distStartIndex
                });
                var cityScroller = new SCS.scrollCascadeSelect({
                    el: "#" + navArr[1].id,
                    dataArr: startCities,
                    startIndex: cityStartIndex,
                    onChange: function(selectedItem, selectedIndex) {
                        distScroller.render(getAddrsArrayById(selectedItem.key), 0); //re-render distScroller when cityScroller change
                    }
                });
                var provScroller = new SCS.scrollCascadeSelect({
                    el: "#" + navArr[0].id,
                    dataArr: PROVINCES,
                    startIndex: provStartIndex,
                    onChange: function(selectedItem, selectedIndex) { //re-render both cityScroller and distScroller when provScroller change
                        cityScroller.render(getAddrsArrayById(selectedItem.key), 0);
                        distScroller.render(getAddrsArrayById(cityScroller.getSelectedItem().key), 0);
                    }
                });
            });
        });
    }]);
