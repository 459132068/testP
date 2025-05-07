import axios from 'axios';
import { AJAX } from '../const';
import Error from '../utils/error';

axios.defaults.withCredentials = true;

const instance = axios.create({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
    timeout,
});

instance.interceptors.request.use(function(config){
    // config.method = 'post';
    return config;
}, function(error){
    return Promise.reject(error);
});

instance.interceptors.response.use(function(res){
    if(__DEV__){
        // console.info('response url', res.config.url, res);
    }
    const { CHECK = true } = res.config;
    const data = res.data;
    if(res.status >= 200 && res.status < 400){
        let error;
        if (!CHECK || (data && data.ResultType === 1)) {
            return data;
        } else if (data && data.ResultType === 0) {
            error = Error({
                message: `${data.ResultMsg || '未知错误'}`,
                type: AJAX.BUSINESS,
                data: data,
            });
            return Promise.reject(error)
        } else if(data && data.ResultType === 608) {
            error = Error({
                message: `[${data.ResultMsg}]`,
                type: AJAX.SERVER,
                data: data,
                key: '服务端错误',
            });
            return Promise.reject(error)
        } else {
            error = Error({
                message: '参数错误',
                type: AJAX.REQUEST,
                data: data,
            })
            return Promise.reject(error)
        }
    }else{
        const error = Error({
            message: `[code:${res.status}]`,
            type: AJAX.SERVER,
            key: '服务端错误',
        });
        return Promise.reject(error);
    }
}, function(error){
    console.error('AJAX ERROR :: ', error);
    let err;
    const message = error.message.toLowerCase();
    if (message.includes('timeout')) {
        err = Error({
            message: '请求超时,请检查网络或者端口 ①',
            text: message,
            type: AJAX.TIMEOUT,
            key: '请求超时',
        });
        return Promise.reject(err)
    }
    if (message.includes('network')) {
        err = Error({
            message: '网络异常,请检查网络或者端口 ②',
            text: message,
            type: AJAX.NETWORK,
            key: '网络异常',
        });
        return Promise.reject(err)
    }
    if (error.response.status) {
        err = Error({
            message: `[${error.response.status}]`,
            type: AJAX.SERVER,
            key: '服务端错误',
        });
        return Promise.reject(err)
    }
    return Promise.reject(error);
})


instance.create = function({ path, api, body, method = 'post' } = {}){
    const data = {
        paramJsonStr: JSON.stringify(body)
    }
    /*unregexp-0*/
    const url = `${path}/${api}`;
    /*unregexp-1*/
    const methods = ['post', 'get'];
    if(methods.indexOf(method) === -1){
        method = methods[0];
    }
    console.log(url, data);
    return instance[method](url, data);
}

instance.send = function({ url, method = 'get', data = {}, CHECK = false } = {}){
    return instance[method](url, { params: data, CHECK });
}

export default instance;