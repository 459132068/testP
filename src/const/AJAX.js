import constant from '../utils/constant';
import NAJAX from './namespace/ns.AJAX';

const [
    NS_AJAX,
    NETWORK,
    TIMEOUT,
    SERVER,
    BUSINESS,
    REQUEST,
] = NAJAX

const AJAX = constant(NS_AJAX);
AJAX.of(NETWORK);
AJAX.of(TIMEOUT);
AJAX.of(SERVER);
AJAX.of(BUSINESS);
AJAX.of(REQUEST);

export default AJAX;
