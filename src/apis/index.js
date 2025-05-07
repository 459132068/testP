import http from './http';

const ajaxTransfer = function(data){
    
    return http.create({
        path,
        api: 'GetData',
        body: {
            op: operation,
            ...params,
            MachineCode: machineCode,
        },
        method,
    });
}


const APIS = {
    ['shot'](data){
        return ajaxTransfer(data);
    }
}

export default APIS;
