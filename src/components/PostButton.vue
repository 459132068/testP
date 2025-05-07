<template>
  <div>
    <textarea v-model='detail'></textarea>
    <label>api:</label><input v-model='api'/>
    <label>op:</label><input v-model='op'/>
    <!-- <label>body:</label><input v-model='body'/> -->
    <button @click='sendRequest'>发送请求</button>
    <p>响应状态：{{ responseStatus }}</p>
    <pre>{{ responseData }}</pre>
  </div>
</template>

<script>
import CryptoJS from 'crypto-js';

const getSecretCode = function({id, key}) {
    // const {id, mcode: key} = this.config;
    const token = Date.now();
    // id = restId, key = machineCode, token = random
    // let code = crypto.createHash('md5').update(`${id} ${key} ${token}`, 'utf8').digest('hex');
    // code = crypto.createHash('sha1').update(code, 'utf8').digest('hex');
    let code = CryptoJS.MD5(`${id} ${key} ${token}`).toString(CryptoJS.enc.hex);
    code = CryptoJS.SHA1(code).toString(CryptoJS.enc.hex);
    return `id.${id}, key.${key}, token.${token}, code.${code}, human.${key}`;
}

const getShortId = (() => {
    let i = 1;
    return function (str = 'dwnszrv', vlen = 5) {
        let date = new Date();
        let dt = {
            y: date.getFullYear(),
            m: date.getMonth() + 1,
            d: date.getDate(),
            w: date.getDay(),
            h: date.getHours(),
            n: date.getMinutes(),
            s: date.getSeconds(),
            z: date.getMilliseconds(),
            r: (i++, vlen ? Math.random() + '' + i : i),
            v: s => {
                let n = 0;
                for (let m = 0; m < s.length; m++) {
                    n = n * 13 % 0xfffffffff0 + s.charCodeAt(m);
                }
                return n % 11 % 10;
            },
        };
        let v, s = str.replace(/([ymdwhnszrv])\1*/g, function (_,c) {
            if (c === 'r' && vlen) return String(dt[c]).slice(-(i%(vlen-1)+2));
            if (c === 'v') return v = true, '';
            return vlen ? dt[c] : String(1e9 + dt[c]).slice(-_.length);
        });
        if (v) s += dt.v(s);
        return s;
    }
})();

export default {
  data() {
    return {
      responseStatus: '未发送',
      responseData: null,
      detail: undefined,
      api: 'qr',
      storeDetail: undefined,
      op: 'getOrSetKv',
      body: ''
    }
  },
  watch: {
    detail(_n) {
        if(_n) {
            try {
                this.storeDetail = JSON.parse(_n)
            } catch (error) {
                alert('detail格式错误')
            }
        }
    }
  },
  methods: {
    async sendRequest() {
        if(!this.detail || !this.api) return
      try {
        const myHeaders = new Headers();
        const restId = this.storeDetail.uuid;;
        const authorization = this.getAuth()
        myHeaders.append('authorization', authorization);
        myHeaders.append('origin', 'http://10.0.1.156:8080');
        myHeaders.append('referer', 'http://10.0.1.156:8080/');
        myHeaders.append('Sec-Fetch-Dest', 'empty');
        myHeaders.append('Sec-Fetch-Site', 'cross-site');
        myHeaders.append('Sec-Fetch-Mode', 'cors');
        myHeaders.append('Content-Type', 'application/json');

        const params = {
            'op': this.op,
            'v': '1650A15B131R784C1288',
            'mac': 'ssNuWwdsw',
            time: Date.now()
        }

        const body = this.body || {
            'op': 'getOrSetKv',
            'method': 'kv-del',
            'key': '_id',
            'value': {
                'value': 'testLog_'
            },
            'isRegExp': true,
            'MachineCode': 'ssNuWwdsw',
            'restId': restId
        };

        const raw = JSON.stringify(body);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
        };
        fetch(`http://${this.api}.supermenus.cn/pad/order/GetData?op=${params.op}&v=${params.v}&mac=${params.mac}&time=${params.time}`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
            this.responseStatus = `成功：${result}`
            this.responseData = result.data
        })
        .catch((error) => {
            console.error(error)
            this.responseStatus = `失败：${error.response?.status || '网络错误'}`
            this.responseData = error.message
        });
        
      } catch (error) {
        this.responseStatus = `失败：${error.response?.status || '网络错误'}`;
        this.responseData = error.message;
      }
    },
    getAuth() {
        // 添加平板的码
        const detail = this.storeDetail;
        const uuid = detail.uuid;
        const api = location.hostname.indexOf('open') > -1 ? 'qr' : 'qt';
        let code = detail.code;
        if(code.length === 8) code = getShortId() + code.slice(-4).toLowerCase();
        const id = `test:${this.api}-${uuid.substr(0, 6)}-${code}`;
        const codes = id.split('-');
        const secretKey = codes[2];

        const res = getSecretCode({id: uuid, key: secretKey});
        return res
    },
  }
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  background: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

pre {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
}
</style>