interface RequestConfig{
    url:string;
    type:string;
    data?:any;
    async?:boolean;
    timeout?:number;
    responseType?:string;
    success?:any;
    error?:any;
}

interface RequestPromiseConfig{
    url:string;
    type:string;
    data?:any;
    async?:boolean;
    timeout?:number;
}

class $Request{
    //实例一个原生请求对象
    private static xhr:any = new XMLHttpRequest();
    /*
        @ajax对像初始化
    */
    private static init(config:RequestConfig):void{
        //url初始化
        //参数初始化
        switch (config.type.toLowerCase()) {
            case 'get':
                config.url += $Request.getParamsConcat(config.data);
                config.data = null;
                break;
            case 'post':
                config.data?config.data = $Request.postParamsConcat(config.data):config.data = null;
                break;
        }
        //responseType初始化   配置不传的时候默认返回text格式
        !config.responseType?config.responseType = 'text':config.responseType;
        //async初始化   配置不传的时候默认异步请求
        !config.async?config.async = true:false;
        //timeout初始化   配置不传的时候默认无超时限制
        !config.timeout?config.timeout = 0:config.timeout;
        $Request.xhr.timeout = config.timeout;
    }
    /*
        @原生ajax封装
        @config:RequestConfig
     */
    static ajax(config:RequestConfig):any{
        $Request.init(config);
        $Request.xhr.open(config.type,config.url,config.async);
        config.type.toLowerCase() == 'post' && $Request.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        $Request.xhr.send(config.data);
        $Request.xhr.ontimeout = ():void => {
            console.log('Request TimeOut!');
        }
        $Request.xhr.onreadystatechange = ():void => {
            if($Request.xhr.readyState == 4){
                if($Request.xhr.status == 200){
                    switch ((config.responseType as string).toLowerCase()){
                        case 'json':config.success(JSON.parse($Request.xhr.responseText));
                            break;
                        case 'text':config.success($Request.xhr.responseText);
                            break;
                    }
                }else{
                    config.error && config.error($Request.xhr.error);
                }
            }
        }
    }
    /*
        @原生ajax+Promise封装
        @config:RequestConfig
     */
    static ajaxPromise(config:RequestPromiseConfig):any{
        return new Promise((resolve, reject) => {
            $Request.init(config);
            $Request.xhr.open(config.type,config.url,config.async);
            config.type.toLowerCase() == 'post' && $Request.xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            $Request.xhr.send(config.data);
            $Request.xhr.ontimeout = ():any => {
                reject('Request TimeOut!');
            }
            $Request.xhr.onreadystatechange = ():any => {
                if($Request.xhr.readyState == 4){
                    if($Request.xhr.status == 200){
                        resolve($Request.xhr.responseText);
                    }else{
                        reject($Request.xhr.error);
                    }
                }
            }
        });
    }
    /*
        @get请求拼接字符串
        @data:请求配置中的data:Object
    */
    static getParamsConcat(data:any):string{
        let result:string = '?';
        for(let key in data){
            result += key+'='+data[key] + '&';
        }
        result = result.substring(0,result.length-1);
        return result;
    }
    /*
         @post请求拼接字符串
         @data:请求配置中的data:Object
    */
    static postParamsConcat(data:any):string{
        let result:string = '';
        for(let key in data){
            result += key+'='+data[key] + '&';
        }
        result = result.substring(0,result.length-1);
        return result;
    }
}
// Test
$Request.ajaxPromise({
    // url:'http://a.itying.com/api/productlist',
    url:'http://www.srq.ink:8081/HelloWord/showBooksByTId',
    type:'get',
    data:{
        // 'name':'zhangsan'
          'typeId':1
    },
    // timeout:1000
}).then((result:any) => console.log(result))
.catch((error:any) => console.log(error));
