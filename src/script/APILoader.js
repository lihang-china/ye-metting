const DEFAULT_CONFIG = {
    version: "latest-release",
    protocol: "https:",
    hostAndPath: "static.bimface.com/api/BimfaceSDKLoader",
}

export default class APILoader {
    constructor(version) {
        this.config = {...DEFAULT_CONFIG};

        if (version)
            this.config.version = version;
    }

    load() {
        if (typeof window === 'undefined') {
            return null;
        }
        let mainPromise = this.getPromise();
        return new Promise(resolve => {
            mainPromise.then(() => {
                resolve();
            })
        })
    }

    getScriptSrc(cfg) {
        return `${cfg.protocol}//${cfg.hostAndPath}/BimfaceSDKLoader@${cfg.version}.js`;
    }

    buildScriptTag(src) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.defer = true;
        script.src = src;
        return script;
    }

    getPromise() {
        if (window.Glodon) {
            return Promise.resolve();
        }
        const script = this.buildScriptTag(this.getScriptSrc(this.config));
        const p = new Promise(resolve => {
            script.onload = ()=>{
                resolve();
            };
        })
        document.body.appendChild(script);
        return p;
    }
}