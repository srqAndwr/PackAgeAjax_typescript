"use strict";
class $Request {
    /*
        @ajax对像初始化
    */
    static init(config) {
        //url初始化
        //参数初始化
        switch (config.type.toLowerCase()) {
            case 'get':
                config.url += $Request.getParamsConcat(config.data);
                config.data = null;
                break;
            case 'post':
                config.data ? config.data = $Request.postParamsConcat(config.data) : config.data = null;
                break;
        }
        //responseType初始化   配置不传的时候默认返回text格式
        !config.responseType ? config.responseType = 'text' : config.responseType;
        //async初始化   配置不传的时候默认异步请求
        !config.async ? config.async = true : false;
        //timeout初始化   配置不传的时候默认无超时限制
        !config.timeout ? config.timeout = 0 : config.timeout;
        $Request.xhr.timeout = config.timeout;
    }
    /*
        @原生ajax封装
        @config:RequestConfig
     */
    static ajax(config) {
        $Request.init(config);
        $Request.xhr.open(config.type, config.url, config.async);
        config.type.toLowerCase() == 'post' && $Request.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        $Request.xhr.send(config.data);
        $Request.xhr.ontimeout = () => {
            console.log('Request TimeOut!');
        };
        $Request.xhr.onreadystatechange = () => {
            var _a;
            if ($Request.xhr.readyState == 4) {
                if ($Request.xhr.status == 200) {
                    switch ((_a = config.responseType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) {
                        case 'json':
                            config.success(JSON.parse($Request.xhr.responseText));
                            break;
                        case 'text':
                            config.success($Request.xhr.responseText);
                            break;
                    }
                }
                else {
                    config.error && config.error($Request.xhr.error);
                }
            }
        };
    }
    /*
        @原生ajax+Promise封装
        @config:RequestConfig
     */
    static ajaxPromise(config) {
        return new Promise((resolve, reject) => {
            $Request.init(config);
            $Request.xhr.open(config.type, config.url, config.async);
            config.type.toLowerCase() == 'post' && $Request.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            $Request.xhr.send(config.data);
            $Request.xhr.ontimeout = () => {
                reject('Request TimeOut!');
            };
            $Request.xhr.onreadystatechange = () => {
                if ($Request.xhr.readyState == 4) {
                    if ($Request.xhr.status == 200) {
                        resolve($Request.xhr.responseText);
                    }
                    else {
                        reject($Request.xhr.error);
                    }
                }
            };
        });
    }
    /*
        @get请求拼接字符串
        @data:请求配置中的data:Object
    */
    static getParamsConcat(data) {
        let result = '?';
        for (let key in data) {
            result += key + '=' + data[key] + '&';
        }
        result = result.substring(0, result.length - 1);
        return result;
    }
    /*
         @post请求拼接字符串
         @data:请求配置中的data:Object
    */
    static postParamsConcat(data) {
        let result = '';
        for (let key in data) {
            result += key + '=' + data[key] + '&';
        }
        result = result.substring(0, result.length - 1);
        return result;
    }
}
//实例一个原生请求对象
$Request.xhr = new XMLHttpRequest();
//Test
// $Request.ajax({
//     url:'http://a.itying.com/api/productlist',
//     // url:'http://www.srq.ink:8081/HelloWord/showBooksByTId',
//     type:'get',
//     data:{
//       'name':'zhangsan'
//       //   'typeId':1
//     },
//     timeout:1000,
//     responseType:'json',
//     success(result:any){
//         console.log(result);
//     }
// });
$Request.ajaxPromise({
    // url:'http://a.itying.com/api/productlist',
    url: 'http://www.srq.ink:8081/HelloWord/showBooksByTId',
    type: 'get',
    data: {
        // 'name':'zhangsan'
        'typeId': 1
    },
    // timeout:1000
}).then((result) => console.log(result))
    .catch((error) => console.log(error));
