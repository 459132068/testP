import { uniqueId } from 'lodash';
import Nconstant from './namespace/ns.constant';
import md5 from './md5';

const [
    of,
    toUpperCase,
    namespace,
] = Nconstant;

class Constants{
    constructor(_namespace){
        this[uniqueId] = uniqueId();
        this[namespace] = _namespace;
    }
    [of](key, value){
        if(typeof key !== 'string'){
            throw new Error(`Expect key of constants to be string, but accpet type ${typeof key} and value 'of'`);
        }
        key = key[toUpperCase]();
        if(typeof this[key] !== 'undefined'){
            return this[key];
        }
        this[key] = value !== undefined ? value : __DEV__ ? `${this[namespace]}.${key}` : md5(`${this[namespace]}.${key}`)[toUpperCase]();

        return this[key];
    }
}


/**
 * usage:
 * const TEST = constant('TEST');
 * TEST.of('ON') => TEST.ON
 */

export default (function(){
    const store = {};
    if(__DEV__){
        window.__Store = store;
    }
    let uniqueIndex = 0;
    return namespace => {
        if (!namespace) {
            namespace = `CONST_${uniqueIndex}`;
        }
        if(typeof namespace !== 'string'){
            throw new Error(`Expect namespace to be string, but accpet type ${typeof namespace}`);
        }
        namespace = namespace[toUpperCase]();
        if(!store[namespace]){
            store[namespace] = new Constants(namespace);
            uniqueIndex ++;
        }
        return store[namespace];
    }
})()
