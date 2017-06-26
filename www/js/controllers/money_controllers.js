angular.module('money.controllers', [])
    .controller('MoneyCtrl', ['$scope', '$state', 'MoneyServices', '$ionicScrollDelegate', 'Services', '$ionicLoading', function (
        $scope, $state, MoneyServices, $ionicScrollDelegate, Services, $ionicLoading) {
        $scope.pageNumber = 0; //分页的第几页
        $scope.pageSize = 30; //分页一页显示几条
        $scope.functionId = "A040"; //初始功能ID
        $scope.moredata = false; //控制加载更多
        $scope.nhsyOrder = ''; //年化收益排序
        $scope.qixianOrder = ''; //投资期限排序
        $scope.moneyOrder = ''; //理财金额排序
        $scope.touzijinduOrder = ''; //投资进度排序
        var vm = [];
        if (!localStorage.guide) {
            $state.go('guide');
        }
        Services.ionicLoading();
        //点击排序
        $scope.sortfun = function (index) {
            if (index == 1) {
                $scope.qixianOrder = '';
                $scope.touzijinduOrder = '';
                $scope.moneyOrder = '';
                if ($scope.nhsyOrder == '' || $scope.nhsyOrder == 1) {
                    $scope.nhsyOrder = 2;
                } else if ($scope.nhsyOrder == 2) {
                    $scope.nhsyOrder = 1;
                }
            } else if (index == 2) {
                $scope.nhsyOrder = '';
                $scope.touzijinduOrder = '';
                $scope.moneyOrder = '';
                if ($scope.qixianOrder == '' || $scope.qixianOrder == 1) {
                    $scope.qixianOrder = 2;
                } else if ($scope.qixianOrder == 2) {
                    $scope.qixianOrder = 1;
                }
            } else if (index == 3) {
                $scope.nhsyOrder = '';
                $scope.qixianOrder = '';
                $scope.moneyOrder = '';
                if ($scope.touzijinduOrder == '' || $scope.touzijinduOrder == 1) {
                    $scope.touzijinduOrder = 2;
                } else if ($scope.touzijinduOrder == 2) {
                    $scope.touzijinduOrder = 1;
                }
            } else {
                $scope.nhsyOrder = '';
                $scope.qixianOrder = '';
                $scope.touzijinduOrder = '';
                if ($scope.moneyOrder == '' || $scope.moneyOrder == 1) {
                    $scope.moneyOrder = 2;
                } else if ($scope.moneyOrder == 2) {
                    $scope.moneyOrder = 1;
                }
            }
            $scope.doRefresh();
            $ionicScrollDelegate.scrollTop()
        }
        //获取数据
        $scope.getMoneyData = function (functionId, pageNumber, pageSize, nhsyOrder, qixianOrder, moneyOrder,
            touzijinduOrder) {
            MoneyServices.getMoney(functionId, pageNumber, pageSize, nhsyOrder, qixianOrder, moneyOrder,
                touzijinduOrder).success(function (data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    $scope.prolists = data.body.list;
                }
            })
            .finally(function () {
                // 停止广播ion-refresher
                $scope.$broadcast('scroll.refreshComplete');
            });
        }
        //下拉刷新
        $scope.doRefresh = function () {
            $scope.getMoneyData($scope.functionId, "1", $scope.pageSize, $scope.nhsyOrder, $scope.qixianOrder, $scope.moneyOrder,
                $scope.touzijinduOrder);
        };
        //上滑加载更多
        $scope.loadMore = function () {
            $scope.pageNumber += 1;
            console.log($scope.nhsyOrder);
            console.log($scope.qixianOrder);
            console.log($scope.touzijinduOrder);
            MoneyServices.getMoney($scope.functionId, $scope.pageNumber, $scope.pageSize, $scope.nhsyOrder, $scope.qixianOrder,
                $scope.moneyOrder, $scope.touzijinduOrder).success(function (data) { // 调用service里面community文件里面的wbindexservice服务
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    vm = vm.concat(data.body.list);
                    $scope.prolists = vm;
                    var wblength = data.body.list.length;
                    if (wblength < $scope.pageSize) {
                        $scope.moredata = true;
                    }
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                }
 
            }).error(function () {});
        };
        //页面tab
        $scope.prolisttit = [{
                "name": "理财",
                "success": true
        }, {
                "name": "转让",
                "success": false
        }];
        //切换tab
        $scope.protittopfc = function (index) {
            Services.ionicLoading();
            $ionicScrollDelegate.scrollTop()
            $scope.nhsyOrder = ''; //年化收益排序
            $scope.qixianOrder = ''; //投资期限排序
            $scope.moneyOrder = ''; //理财金额排序
            $scope.touzijinduOrder = ''; //投资进度排序
            for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                if (index === i) {
                    $scope.prolisttit[i].success = true;
                } else {
                    $scope.prolisttit[i].success = false;
                }
            }
            if (index == 0) {
                $scope.functionId = "A040"
            } else {
                $scope.functionId = "A043"
            }
            $scope.pageNumber = 0;
            vm = [];
            $scope.loadMore();
 
        }
        //跳转产品详细页
        $scope.goprodetail = function (proid, transferRegisterRid) {
            console.log(proid);
            var curside;
            if ($scope.prolisttit[0].success) {
                curside = 1;
            } else {
                curside = 2;
            }
            $state.go('prodetail', {
                proid: proid,
                transferRegisterRid: transferRegisterRid,
                curside: curside
            });
        }
    }])
    .controller('ProdetailCtrl', ['$scope', '$state', '$stateParams', '$ionicModal', 'Services', '$ionicScrollDelegate', function (
        $scope, $state, $stateParams, $ionicModal, Services, $ionicScrollDelegate) {
        //项目tab
        $scope.prolisttit = [{
                "name": "项目概况",
                "success": true
        }, {
                "name": "风险控制",
                "success": false
        }, {
                "name": "还款计划",
                "success": false
        }, {
                "name": "投资记录",
                "success": false
        }];
        //数据请求参数
        var parameterObj = {
            id: $stateParams.proid//获取url参数
        }
        var parameterObj1 = {
            id: $stateParams.proid,//获取url参数
            transferRegisterRid: $stateParams.transferRegisterRid//获取url参数
        }
        //根据产品类型请求不同的接口$stateParams.curside=1是理财2是转让
        if ($stateParams.curside == 1) {
            Services.getData("A041", parameterObj).success(function (data) {
                console.log(data);
                $scope.prodetail = data.body;
                console.log($scope.prodetail);
                $('.progress-bar').width($scope.prodetail.scales * 100 + '%');
                $('.progress-bar').css({
                    animation: "animate-positive 2s"
                });
            });
        } else {
            Services.getData("A044", parameterObj1).success(function (data) {
                console.log(data);
                $scope.prodetail = data.body;
 
                $('.progress-bar').width($scope.prodetail.scales * 100 + '%');
                $('.progress-bar').css({
                    animation: "animate-positive 2s"
                });
            });
        }
        var backparameterObj = {
            borrowId: $stateParams.proid
        }
        //获取标的还款计划
        Services.getData("A081", backparameterObj).success(function (data) {
            console.log(data);
            if (data.respHead.respCode == "000000") {
                $scope.backmoneys = data.body.list ? data.body.list : [];
            }
        });
        var backparameterObj1 = {
            borrowId: $stateParams.proid,
            pageNum: 1,
            pageSize: 9
        }
        //获取标的投资记录
        Services.getData("A042", backparameterObj1).success(function (data) {
            console.log(data);
            if (data.respHead.respCode == "000000") {
                $scope.tzjl = data.body.list ? data.body.list : [];
            }
        });
        //项目tab切换
        $scope.protittopfc = function (index) {
            $ionicScrollDelegate.scrollTop()
            for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                if (index === i) {
                    $scope.prolisttit[i].success = true;
                } else {
                    $scope.prolisttit[i].success = false;
                }
            }
        }
        //跳转支付页面
        $scope.gopropay = function () {
            if (sessionStorage.userInfo) {
                $state.go('propay', {
                    proid: $stateParams.proid,
                    transferRegisterRid: $stateParams.transferRegisterRid,
                    curside: $stateParams.curside
                });
            } else {
                $state.go('login')
            }
        }
        //跳转计算器页面
        $scope.gocalculator = function () {
            $state.go('calculator');
        }
        //上滑模板
        $ionicModal.fromTemplateUrl("my-modal.html", {
            scope: $scope,
            animation: "slide-in-up"
        }).then(function (modal) {
            $scope.modal = modal;
        });
        $scope.openModal = function () {
            $scope.modal.show();
        };
        $scope.closeModal = function () {
            $scope.modal.hide();
        };
        $scope.$on("$destroy", function () {
            $scope.modal.remove();
        });
        $scope.$on("$ionicView.leave", function () {
            $scope.modal.hide();
        });
    }])
    .controller('PropayCtrl', ['$scope', '$state', '$stateParams', '$ionicPopup', 'MyServices', 'Services',
        '$ionicLoading', function ($scope, $state, $stateParams, $ionicPopup, MyServices, Services, $ionicLoading) {
        var userInfosession = angular.fromJson(sessionStorage.userInfo);
        $scope.prodetail = {};
        $('.progress-bar').width($scope.prodetail.yitou);
        $scope.data = {};
        $scope.functionId1 = "A016";
        $scope.functionId2 = "A046";
        var parameterObj = {
            id: $stateParams.proid
        }
        Services.ionicLoading();
        //获取标的详情
        Services.getData("A041", parameterObj).success(function (data) {
            console.log(data);
            $scope.prodetail = data.body;
            $('.progress-bar').width($scope.prodetail.scales * 100 + '%');
            $('.progress-bar').css({
                animation: "animate-positive 2s"
            });
            //获取用户红包
            MyServices.getUserredb($scope.functionId1, userInfosession.id, userInfosession.userNo, "0", "1", "50").success(function (
                data) {
                console.log(data);
                $ionicLoading.hide();
                if (data.respHead.respCode == "000000") {
                    $scope.redblists = data.body.list ? data.body.list : [];
                    var redbdatalist = [];
                    for (var i = 0; i < $scope.redblists.length; i++) {
                        redbdatalist.push({
                            text: $scope.redblists[i].amount,
                            value: $scope.redblists[i].redPaperNo
                        });
                    }
                    if (redbdatalist.length == 0) {
                        raisedatalist.push({
                            text: "暂无红包",
                            value: 0
                        })
                    }
                    var redbEl = document.getElementById('redb');
                    var redb = new Picker({
                        data: [redbdatalist]
                    });
                    redb.on('picker.select', function (selectedVal, selectedIndex) {
                        redbEl.innerText = redbdatalist[selectedIndex[0]].text;
                    });
                    redb.on('picker.change', function (index, selectedIndex) {
                        // console.log(selectedIndex);
                    });
                    redb.on('picker.valuechange', function (selectedVal, selectedIndex) {
                        $scope.choiceredmoney = parseInt($scope.redblists[selectedIndex[0]].amount)
                    });
                    redbEl.addEventListener('click', function () {
                        redb.show();
                    });
                }
                //获取用户加息券
                MyServices.getUserticket($scope.functionId2, userInfosession.id, userInfosession.userNo, "0", "1", "50")
                    .success(function (data) {
                    console.log(data);
                    $ionicLoading.hide();
                    if (data.respHead.respCode == "000000") {
                        $scope.raiselists = data.body.list ? data.body.list : [];
                        var raisedatalist = [];
                        for (var i = 0; i < $scope.raiselists.length; i++) {
                            raisedatalist.push({
                                text: $scope.redblists[i].amount,
                                value: $scope.redblists[i].redPaperNo
                            });
                        }
                        if (raisedatalist.length == 0) {
                            raisedatalist.push({
                                text: "暂无加息券",
                                value: 0
                            })
                        }
                        var select_jxqEl = document.getElementById('select_jxq');
                        var select_jxq = new Picker({
                            data: [raisedatalist]
                        });
                        select_jxq.on('picker.select', function (selectedVal, selectedIndex) {
                            select_jxqEl.innerText = raisedatalist[selectedIndex[0]].text;
                        });
                        select_jxq.on('picker.change', function (index, selectedIndex) {
                            // console.log(selectedIndex);
                        });
                        select_jxq.on('picker.valuechange', function (selectedVal, selectedIndex) {
                            // console.log(selectedVal);
                        });
                        select_jxqEl.addEventListener('click', function () {
                            select_jxq.show();
                        });
                    }
                });
            });
        })
        //点击支付
        $scope.paybtn = function () {
            if ($scope.data.tzmoney) {
                if ($scope.data.tzmoney >= $scope.prodetail.lowestAccount) {
                    $ionicPopup.show({
                        template: "<p><span>理财项目：</span>推荐理财第一期</p><p><span>理财金额：</span>" + $scope.data.tzmoney + "</p>",
                        title: "支付成功",
                        scope: $scope,
                        buttons: [
                            {
                                text: "理财记录"
                            }, {
                                text: "更多理财",
                                // type: "button-positive",
                                onTap: function (e) {}
                                }
                        ]
                    })
                        .then(function (res) {
                        //按钮回调
                    });
                } else {
                    $ionicPopup.show({
                        template: "<p>金额必须大于等于" + $scope.prodetail.lowestAccount + "</p>",
                        title: "支付失败",
                        scope: $scope,
                        buttons: [
                            {
                                text: "关闭"
                            }
                        ]
                    })
                        .then(function (res) {
                        //按钮回调
                    });
                }
            } else {
                $ionicPopup.alert({
                    title: "提示",
                    template: "请输入投资金额"
                })
                    .then(function (res) {
                    //按钮回调
                });
            }
        }
        //跳转计算器页面
        $scope.gocalculator = function () {
            $state.go('calculator');
        }
    }])
    .controller('CalculatorCtrl', ['$scope', '$state', '$stateParams', function ($scope, $state, $stateParams) {
        $scope.data = {};
    }]);