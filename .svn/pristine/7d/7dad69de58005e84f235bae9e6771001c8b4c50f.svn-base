angular.module('CacheService', [])
    .factory('cacheService', ['$rootScope', '$http', "$q", function($rootScope, $http, $q) {
        //存储缓存对象信息，缓存对象应包括Key,创建日期,失效日期,以及对象  
        return {
            console:function(data)
            {
                if($rootScope.debug)
                {
                    console.log(data);
                    if($rootScope.debugtrace)
                        console.trace();
                }
            },
            getCache: function() {
                var cachestr = sessionStorage.getItem("__tempCache");
                var cache;
                if (!cachestr) {
                    cache = {};
                    sessionStorage.setItem("__tempCache", JSON.stringify(cache));
                } else {
                    try {
                        cache = JSON.parse(cachestr);
                    } catch (e) {
                        cache = {};
                    }
                }
                return cache;
            },
            setCache: function(key, data) {
                var cache = this.getCache();
                cache[key] = data;
                sessionStorage.setItem("__tempCache", JSON.stringify(cache));
            },
            removeCache:function(key)
            {
                var cache = this.getCache();
                if(cache[key])
                 {
                    delete cache[key];
                    sessionStorage.setItem("__tempCache", JSON.stringify(cache));
                 }
            },
            //缓存对象 period 有效期 单位 秒 servicefun 服务方法  url 访问服务端URL  args 服务方法参数
            cacheObject: function(key, period, servicefun, thisobj, args) {
                var me = this;
                var d = $q.defer();
                var promise = d.promise;
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                };
                var data = this.getCacheObject(key);

                if (data) {
                    d.resolve(data);
                } else {
                    var that=this;
                    servicefun.apply(thisobj, args).success(function(data) {
                        if (data.code=="1111" || data.code=="1111" || data.code=="1111") {
                            me.putCache(key, period, data);
                        }
                        d.resolve(data);
                    }).error(function(error) {
                        d.reject(error);
                    });
                }
                return d.promise;
            },
            getCacheObject: function(key) {
                var data;
                var cache = this.getCache();
                if (cache[key]) {
                    var obj = cache[key];
                    if (obj.period > 0) {
                        if (this.getTimestamp(new Date()) - obj.createTime <= obj.period) {
                            data = obj.data;
                        }
                    } else {
                        data = obj.data;
                    }
                }
                return data;
            },
            putCache: function(key, period, data) {
                var obj = {
                    key: key,
                    createTime: this.getTimestamp(new Date()),
                    period: period,
                    data: data
                };
                this.setCache(key, obj);
            },
            getTimestamp: function(date) {
                return Math.round(date.getTime() / 1000);
            }
        };
    }]);
