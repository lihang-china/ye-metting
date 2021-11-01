const DEFAULT_CONFIG =
    {
        viewTokenUrl: "https://api.bimface.com/view/token",
        accessTokenUrl: 'https://api.bimface.com/oauth2/token',
        proxyUrl: "http://47.93.45.105:8000/",
    };

export default class Token {
    constructor(appKey, appSecret) {
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.token = null;
        this.expireTime = null;
        this.config = {...DEFAULT_CONFIG};
    }

    //获取访问口令
    getAccessToken() {
        let fire = true;
        if (this.token) {

            let expire = Date.parse(this.expireTime);
            let now = new Date().getTime();

            //这里判断一下token有没有过期，但其实应该用不到
            if (expire > now) {
                fire = false;
            }
        }

        return new Promise((resolve) => {
            if (fire) {
                fetch(this.config.proxyUrl + this.config.accessTokenUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Basic ' + btoa(this.appKey + ':' + this.appSecret)
                    }
                }).then((response) => {
                    response.json().then((json)=>{
                        this.token = json.data.token;
                        this.expireTime = json.data.expireTime;
                        resolve({token: this.token, expireTime: this.expireTime});
                    });
                });
            } else {
                resolve({token: this.token, expireTime: this.expireTime});
            }
        })
    }

    getViewToken(fileId) {
        return new Promise((resolve)=>{
            this.getAccessToken().then((data)=>{
                fetch(this.config.proxyUrl + this.config.viewTokenUrl + '?' +
                    new URLSearchParams({
                        fileId: fileId
                    }).toString(),
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'bearer ' + data.token
                        },
                    }).then(function (response) {
                    response.json().then((json)=>{
                        resolve(json.data);
                    });
                });
            });
        });
    }
}