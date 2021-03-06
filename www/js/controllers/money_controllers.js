angular.module('money.controllers', [])
    .controller('MoneyCtrl', ['$scope', '$state', '$ionicModal', '$ionicScrollDelegate', 'Services', '$ionicLoading', '$timeout', function (
        $scope, $state, $ionicModal, $ionicScrollDelegate, Services, $ionicLoading, $timeout) {
        $scope.postdata = {
            interestRange:"",
            type:"",
            dueTime:"",
            status:"",
            name:"",
            orderBy:"",
            direction:"",
            page:0,
            size:10
        }
        $scope.moredata = false; //控制加载更多
        var vm = [];
        var protitleurl = "noauth/getInvestmentListPc";
        if (!localStorage.guide) {
            $state.go('guide');
        }
        $scope.BorrowTypes = angular.fromJson(sessionStorage.BorrowTypes);
            $timeout(function(){
                var swiper = new Swiper('.swiper-container', {
                    slidesPerView: 3.5,
                    paginationClickable: true,
                    spaceBetween: 0,
                    freeMode: true
                });
            },200)
        //标类型切换
        $scope.borrowstatefun = function(index,BorrowTypeid){
            for (var j = 0; j < $scope.BorrowTypes.length; j++) {
                if (j==index) {
                    $scope.BorrowTypes[j].success = true;
                }else{
                    $scope.BorrowTypes[j].success = false;
                }
            }
            $scope.postdata.orderBy = "";
            $scope.postdata.direction == "";
            $scope.postdata.type = BorrowTypeid;
            $scope.postdata.page = 0;
            vm = [];
            $scope.loadMore()
            $ionicScrollDelegate.scrollTop()
        }
        //绘画投资进度
        $scope.bcircleChartfun = function(index,circlenum){
            if (circlenum == 0) {
                circlenum = null;
            }
            $(".bcircleChart").eq(index).circleChart({
                size: 52,
                value: circlenum,
                text: 0,
                textSize:14,
                color: "#ff304a",
                onDraw: function(el, circle) {
                    circle.text(Math.round(circle.value) + "%");
                }
            });
        }
        //绘画投资进度
        $scope.searchbcircleChartfun = function(index,circlenum){
            if (circlenum == 0) {
                circlenum = null;
            }
            $(".searchbcircleChart").eq(index).circleChart({
                size: 52,
                value: circlenum,
                text: 0,
                textSize:14,
                color: "#ff304a",
                onDraw: function(el, circle) {
                    circle.text(Math.round(circle.value) + "%");
                }
            });
        }
        //点击排序
        $scope.sortfun = function (orderBy) {
            if (orderBy!="percentage") {
                if ($scope.postdata.direction == "" || $scope.postdata.direction == "asc") {
                    $scope.postdata.direction = "desc"
                }else{
                    $scope.postdata.direction = "asc"
                }
            }else{
                if ($scope.postdata.direction == "" || $scope.postdata.direction == "desc") {
                    $scope.postdata.direction = "asc"
                }else{
                    $scope.postdata.direction = "desc"
                }
            }
            

            if (orderBy != $scope.postdata.orderBy) {
                $scope.postdata.orderBy = orderBy;
                $scope.postdata.direction == "";
            }
            ////console.log($scope.postdata.direction);
            $scope.postdata.page = 0;
            vm = [];
            $scope.loadMore()
            $ionicScrollDelegate.scrollTop()
        }
        //下拉刷新
        $scope.doRefresh = function () {
            $scope.postdata.page = 0;
            vm = [];
            $scope.loadMore()
        };
        //上滑加载更多
        $scope.loadMore = function () {
            Services.ionicLoading();
            $scope.postdata.page += 1;
            Services.getReturnData(protitleurl, $scope.postdata).then(
            function successCallback(response) {
                $ionicLoading.hide();
                if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                    vm = vm.concat(response.data.data.investmentList.content);
                    $scope.borrowlists = vm;
                    var wblength = response.data.data.investmentList.content.length;
                    if (wblength < $scope.postdata.size) {
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
                $ionicLoading.hide();
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
                    Services.ionicpopup("", "错误500<br>" + response.data.message)
                }
            });
        };
        //页面tab
        $scope.prolisttit = [
            {
                "name": "理财",
                "success": true,
                "url":"noauth/getInvestmentListPc"
            }
        ];
        //切换tab
        $scope.protittopfc = function (index) {
            $ionicScrollDelegate.scrollTop()
            $scope.postdata = {
                interestRange:"",
                type:"",
                dueTime:"",
                status:"",
                name:"",
                orderBy:"",
                direction:"",
                page:0,
                size:10
            }
            protitleurl = $scope.prolisttit[index].url;
            for (var i = 0, len = $scope.prolisttit.length; i < len; i++) {
                if (index === i) {
                    $scope.prolisttit[i].success = true;
                } else {
                    $scope.prolisttit[i].success = false;
                }
            }
            $scope.postdata.page = 0;
            vm = [];
            $scope.loadMore();
 
        }
        //跳转产品详细页
        $scope.goprodetail = function(proid) {
            //console.log(proid);
            $state.go('prodetail', { proid: proid, curside: "1" });
        }
        $scope.protittopfc(0);
        $scope.searchpostdata = {
            interestRange:"",
            type:"",
            dueTime:"",
            status:"",
            name:"",
            orderBy:"",
            direction:"",
            page:1,
            size:9999
        }
        $scope.searchmoredata = false; //控制加载更多
    }])
    .controller('ProdetailCtrl', ['$scope', '$state', '$stateParams', '$ionicModal', 'Services', '$ionicScrollDelegate', '$timeout', function (
        $scope, $state, $stateParams, $ionicModal, Services, $ionicScrollDelegate, $timeout) {
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
        //根据产品类型请求不同的接口$stateParams.curside=1是理财2是转让
        Services.getServerTime(function(data){
            $scope.nowtime = data;
            $scope.isFinancing = true;
            if ($stateParams.proid) {
                var moneydetaildata = {
                    borrowId:$stateParams.proid
                };
                Services.getData("noauth/showOneBorrow", 1, moneydetaildata, function(data){
                    Services.console(data);
                    $scope.prodetail = data.data.borrowInfo;
                });
                $scope.buyfinancialfun = function(){
                   $state.go('buyfinancial', {id: $stateParams.proid,curside:$stateParams.curside});
                };
            }
            Services.getData("noauth/purchaseRecord", 1, {borrowId:$stateParams.proid,pageNumber:1,pageSize:99999}, function(data){
                Services.console(data);
                $scope.tzjl = data.data.articles;
                
            });
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
            if (index==2) {
                Services.getData("noauth/repayRecord", 1, {borrowId:$stateParams.proid,pageNumber:1,pageSize:99999}, function(data){
                    Services.console(data);
                    $scope.backmoneys = data.data.list;
                    
                });
            }
        }
        //跳转支付页面
        $scope.gopropay = function () {
            if (sessionStorage.userinfo) {
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
            $state.go('calculator',{proid:$stateParams.proid});
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
        '$ionicLoading', '$ionicPopover', function ($scope, $state, $stateParams, $ionicPopup, MyServices, Services, $ionicLoading, $ionicPopover) {
        Services.ionicLoading();
        var userInfosession = angular.fromJson(sessionStorage.userinfo);
        $scope.prodetail = {};
        $scope.returndata = {};
        $scope.debxdata = 0;
        $('.progress-bar').width($scope.prodetail.yitou);
        $scope.data = {};
        if ($stateParams.proid) {
            var moneydetaildata = {
                borrowId:$stateParams.proid
            }
            Services.getData("noauth/showOneBorrow", 1, moneydetaildata, function(data){
                $ionicLoading.hide()
                Services.console(data);
                $scope.data = data.data.borrowInfo;
                $('.progress-bar').width($scope.data.planRat * 100 + '%');
                $('.progress-bar').css({
                    animation: "animate-positive 1s"
                });
                $scope.popover = $ionicPopover.fromTemplateUrl('my-popover.html', {
                    scope: $scope
                });
                // .fromTemplateUrl() 方法
                $ionicPopover.fromTemplateUrl('my-popover.html', {
                  scope: $scope
                }).then(function(popover) {
                    $scope.popover = popover;
                });
                $scope.myFunc = function(){
                    var a = $scope.data.apr/100/12
                    $scope.debxdata = ($scope.returndata.money*a*[Math.pow(1+a,$scope.data.timeLimit)]/([Math.pow(1+a,$scope.data.timeLimit)]-1))*$scope.data.timeLimit-$scope.returndata.money;
                }
                $scope.openPopover = function($event) {
                    if ($scope.returndata.money) {
                        if ($scope.returndata.money >= $scope.data.lowestAccount) {
                            $scope.popover.show($event);
                        }else{
                            Services.ionicLoading(2000, "投资金额必须大于等于" + $scope.data.lowestAccount);
                        }
                    }else{
                        Services.ionicLoading(2000, "请输入投资金额");
                    }
                };
                $scope.closePopover = function() {
                  $scope.popover.hide();
                };
                // 清除浮动框
                $scope.$on('$destroy', function() {
                  $scope.popover.remove();
                });
                // 在隐藏浮动框后执行
                $scope.$on('popover.hidden', function() {
                // 执行代码
                });
                // 移除浮动框后执行
                $scope.$on('popover.removed', function() {
                  // 执行代码
                });
                var pointobj = {
                    status: 0,
                    pageSize: 99999,
                    pageNumber: 1
                };
                Services.getReturnData("my_red_coupon", pointobj).then(
                function successCallback(response) {
                    $ionicLoading.hide();
                    Services.console(response);
                    if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                        // //console.log(response.data.data.redCouponList);
                        $scope.redblists = response.data.data.redCouponList?response.data.data.redCouponList:[];
                        var redbdatalist = [];
                        for (var i = 0; i < $scope.redblists.length; i++) {
                            redbdatalist.push({
                                text: $scope.redblists[i].money+"元",
                                value: $scope.redblists[i].id
                            });
                        }
                        var redbEl = document.getElementById('redb');
                        var redb = new Picker({
                            data: [redbdatalist]
                        });
                        redb.on('picker.select', function (selectedVal, selectedIndex) {
                            redbEl.innerText = redbdatalist[selectedIndex[0]].text;
                        });
                        redb.on('picker.change', function (index, selectedIndex) {
                            // //console.log(selectedIndex);
                        });
                        redb.on('picker.valuechange', function (selectedVal, selectedIndex) {
                            $scope.choiceredmoney = parseInt($scope.redblists[selectedIndex[0]].money);
                            $scope.returndata.hongbaoId = selectedVal[0];
                        });
                        redb.on('picker.cancel', function () {
                            $scope.choiceredmoney = 0;
                            $scope.returndata.hongbaoId = "";
                            redbEl.innerText = "点击选择";
                        });
                        redbEl.addEventListener('click', function () {
                            redb.show();
                        });

                    }else{
                        Services.ionicpopup("",response.msg)
                    }
                }, 
                function errorCallback(response) {
                    $ionicLoading.hide();
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
                        Services.ionicpopup("","错误500<br>" + response.data.message)
                    }
                });
                Services.getReturnData("my_coupon", pointobj).then(
                function successCallback(response) {
                    Services.console(response);
                    if (response.data.code=="0000" || response.data.code=="1010" || response.data.code=="1000") {
                        // //console.log(response.data.data.couponList);
                        $scope.raiselists = response.data.data.couponList?response.data.data.couponList:[];
                        var raisedatalist = [];
                        //console.log($scope.redblists);
                        for (var i = 0; i < $scope.raiselists.length; i++) {
                            raisedatalist.push({
                                text: $scope.raiselists[i].money+"%",
                                value: $scope.raiselists[i].id
                            });
                        }
                        var select_jxqEl = document.getElementById('select_jxq');
                        var select_jxq = new Picker({
                            data: [raisedatalist]
                        });
                        select_jxq.on('picker.select', function (selectedVal, selectedIndex) {
                            select_jxqEl.innerText = raisedatalist[selectedIndex[0]].text;

                        });
                        select_jxq.on('picker.change', function (index, selectedIndex) {
                            // //console.log(selectedIndex);
                        });
                        select_jxq.on('picker.valuechange', function (selectedVal, selectedIndex) {
                            $scope.returndata.couponId = selectedVal[0];
                        });
                        select_jxq.on('picker.cancel', function () {
                            $scope.returndata.couponId = "";
                            select_jxqEl.innerText = "点击选择";
                        });
                        select_jxqEl.addEventListener('click', function () {
                            select_jxq.show();
                        });

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
                        Services.ionicpopup("","错误500<br>" + response.data.message)
                    }
                });
            })
            $scope.surepay = function(){
                Services.ionicLoading();
                $scope.returndata.borrowId = $stateParams.proid;
                Services.getData("borrow/tender", 1, $scope.returndata, function(data){
                    Services.console(data);
                    $ionicLoading.hide();
                    if (data.code == "0000") {
                        $scope.closePopover();
                        $scope.optionsPopup = $ionicPopup.show({
                            template: "<img width='70' src='img/icon_register.png' />" + "<h4>投资成功</h4>" + "<p>坐等收钱吧！</p>",
                            title: "温馨提示",
                            scope: $scope,
                            buttons: [{
                                text: "继续投资",
                                type: "calm",
                                onTap: function(e) {
                                    $state.go("tab.money");
                                }
                            },
                            {
                                text: "查看订单",
                                type: "calm",
                                onTap: function(e) {
                                    $state.go("financial");
                                }
                            }]
                        });
                    }else{
                        $ionicLoading.hide();
                        Services.ionicpopup("", data.data.fymsg)
                    }
                })
            }
        }
        //跳转计算器页面
        $scope.gocalculator = function () {
            $state.go('calculator',{proid:$stateParams.proid});
        }
    }])
    .controller('CalculatorCtrl', ['$scope', '$state', '$stateParams', 'Services', function ($scope, $state, $stateParams, Services) {
        $scope.prodetail = {};
        $scope.arrqs = [];
        $scope.data = {};
        $scope.lixis = [];
        $scope.debxdata = 0;
        if ($stateParams.proid) {
            var moneydetaildata = {
                borrowId:$stateParams.proid
            };
            Services.getData("noauth/showOneBorrow", 1, moneydetaildata, function(data){
                Services.console(data);
                $scope.prodetail = data.data.borrowInfo;
                if ($scope.prodetail.isDay == 0) {
                    for (var i = 0; i < $scope.prodetail.timeLimit; i++) {
                        $scope.arrqs.push(i)
                    }
                }
                $scope.myFunc = function(){
                     function power( x, y ){
                        var t = x;
                        while( y-- > 1 ){
                            t *= x;
                        }
                        return t;
                    }
                    var M = $scope.data.jsqtzmoney,//投资金额
                    R = $scope.prodetail.apr /100 /12;//月利率
                    var C =0, B=0, D=0, I = 0, A = 0, N = $scope.prodetail.timeLimit, totalInt = 0, totalAmt = 0;
                    C = M * R * power( 1 + R, N ) / ( power( 1+R, N ) -1 );
                    totalAmt = C * N;
                    $scope.lixis = [];
                    for (var i=0; i< N ; i++) {
                        // I = 剩余本金 × 月利率
                        D = i == 0 ? M : $scope.lixis[ i-1 ][3]; //剩余本金
                        I = D * R;
                        totalInt += I;
                        $scope.lixis.push( [ I, C-I, C, D-( C-I )] );   
                    }
                    $scope.debxdata = (M*R*[Math.pow(1+R,$scope.prodetail.timeLimit)]/([Math.pow(1+R,$scope.prodetail.timeLimit)]-1))*$scope.prodetail.timeLimit-M;
                    // console.log($scope.debxdata)
                }
            });
        }

    }]);