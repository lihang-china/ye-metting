class BaseRequest {
}

class BaseResponse {
}

class HeartbeatRequestData {
}

class HeartbeatResponseData {
}

class LoginRequestData {
}

class LoginResponseData {
}

class GetDeviceRequestData {
}

class GetDeviceResponseData {
}

class RegDeviceRequestData {
}

class RegDeviceResponseData {
}

class SetDeviceDataRequestData {
}

class DeviceHistoryRequestData {
}

class DeviceHistoryResponseData {
}

class HeartbeatRequest extends BaseRequest {
    constructor() {
        super();
        this.action = "Heartbeat";
        this.data = new HeartbeatResponseData();
        this.data.echo = "ping";
    }
}

class HeartbeatResponse extends BaseResponse {
    constructor() {
        super();
    }
}

class LoginRequest extends BaseRequest {
    constructor(name, token, cltName = "Web For SCTech", cltAddr = "Web", cltDesc = "") {
        super();
        this.action = "Login";
        this.data = new LoginRequestData();
        this.data.authName = name;
        this.data.authToken = token;
        this.data.clientName = cltName;
        this.data.clientAddr = cltAddr;
        this.data.clientDesc = cltDesc;
    }
}

class LoginResponse extends BaseResponse {
    constructor() {
        super();
    }
}

class GetDeviceRequest extends BaseRequest {
    constructor(index, count) {
        super();
        this.action = "GetDevice";
        this.data = new GetDeviceRequestData();
        this.data.index = index;
        this.data.count = count;
    }
}

class GetDeviceResponse extends BaseResponse {
    constructor() {
        super();
    }
}

class RegDeviceRequest extends BaseRequest {
    constructor(names, count) {
        super();
        this.action = "RegDeviceData";
        this.data = new RegDeviceRequestData();
        this.data.names = names;
        this.data.count = count;
    }
}

class RegDeviceResponse extends BaseResponse {
    constructor() {
        super();
    }
}

class SetDeviceDataRequest extends BaseRequest {
    constructor(values) {
        super();
        this.action = "SetDeviceData";
        this.data = new SetDeviceDataRequestData();
        this.data.values = values;
    }
}

class DeviceHistoryRequest extends BaseRequest {
    constructor(name, start, stop) {
        super();
        this.action = "GetHisDeviceData";
        this.data = new DeviceHistoryRequestData();
        this.data.DeviceName = name;
        this.data.Start = start;
        this.data.Stop = stop;
    }
}

class DeviceHistoryResponse extends BaseResponse {
    constructor() {
        super();
    }
}

var EventTypes;
(function (EventTypes) {
    EventTypes[EventTypes["Open"] = 0] = "Open";
    EventTypes[EventTypes["Close"] = 1] = "Close";
    EventTypes[EventTypes["Login"] = 2] = "Login";
    EventTypes[EventTypes["GetDevice"] = 3] = "GetDevice";
    EventTypes[EventTypes["RegDevice"] = 4] = "RegDevice";
    EventTypes[EventTypes["DeviceDataChange"] = 5] = "DeviceDataChange";
})(EventTypes || (EventTypes = {}));

class Device {
}

class DeviceItem {
}

var StatusFlag;
(function (StatusFlag) {
    StatusFlag[StatusFlag["NotUsed"] = 0] = "NotUsed";
    StatusFlag[StatusFlag["Good"] = 1] = "Good";
    StatusFlag[StatusFlag["Bad"] = 2] = "Bad";
    StatusFlag[StatusFlag["OneFault"] = 3] = "OneFault";
    StatusFlag[StatusFlag["MultiFault"] = 4] = "MultiFault";
    StatusFlag[StatusFlag["Stop"] = 5] = "Stop";
    StatusFlag[StatusFlag["Simulate"] = 6] = "Simulate";
    StatusFlag[StatusFlag["Unknown"] = 65535] = "Unknown";
})(StatusFlag || (StatusFlag = {}));

class ECWebSocket {
    constructor(uri) {
        this.func = null;
        this.queue = new Queue(2000);
        this.switch = false;
        this.id = 0;
        this.uri = null;
        this.ws = null;
        this.hb = null;
        this.uri = uri;
    }
    onOpen(e) {
        if (this.func) {
            this.func(EventTypes.Open, null);
        }
        this.SendHeartbeat();
    }
    onClose(e) {
        //关闭心跳包
        if (this.hb) {
            clearInterval(this.hb);
            this.hb = null;
        }
        console.log(e.reason);
    }
    onMessage(e) {
        //解析数据
        if (typeof e.data === "string") {
            let res = JSON.parse(e.data);
            if (res.action != "Heartbeat") {
                console.log(e.data);
            }
            if (res.msgId === 0) {
                if (this.func)
                    this.func(EventTypes.DeviceDataChange, JSON.parse(e.data));
            }
            else {
                let node = null;
                node = this.queue.Get(res.msgId);
                if (node && !node.handle) {
                    if (node.func)
                        node.func(e.data);
                }
            }
        }
    }
    onError(e) {
        console.log(e.message);
    }
    open() {
        if (!this.ws || this.ws.readyState !== this.ws.OPEN) {
            this.ws = new WebSocket(this.uri);
            this.ws.addEventListener("open", this.onOpen.bind(this));
            this.ws.addEventListener("close", this.onClose.bind(this));
            this.ws.addEventListener("message", this.onMessage.bind(this));
            this.ws.addEventListener("error", this.onError.bind(this));
            return true;
        }
        else {
            return false;
        }
    }
    close() {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            this.ws.close();
            this.id = 0;
            this.queue.Clear();
            return true;
        }
        else {
            return false;
        }
    }
    send(req, func) {
        if (this.ws && this.ws.readyState === this.ws.OPEN) {
            req.msgId = this.GetMsgID();
            this.queue.Push(req.msgId, func);
            let data = JSON.stringify(req) + "\r\n";
            this.ws.send(data);
            return true;
        }
        else {
            return false;
        }
    }
    SendHeartbeat() {
        this.hb = setTimeout(() => {
            if (this.switch) {
                this.send(new HeartbeatRequest(), (res) => {
                    if (res) {
                        let h = JSON.parse(res);
                        if (h.data.echo === "pong") {
                            this.SendHeartbeat();
                        }
                        else {
                            console.log("HeartbeatResponse");
                        }
                    }
                });
            }
        }, 1000);
    }
    Open() {
        if (!this.switch) {
            this.switch = true;
        }
        return this.open();
    }
    Close() {
        if (this.switch) {
            this.switch = false;
        }
        return this.close();
    }
    Login(name, token) {
        this.send(new LoginRequest(name, token), (res) => {
            if (res) {
                let l = JSON.parse(res);
                if (l.success) {
                    if (this.func)
                        this.func(EventTypes.Login, l);
                }
            }
        });
    }
    GetDevice(index, count = -1) {
        this.send(new GetDeviceRequest(index, count), (res) => {
            if (res) {
                let g = JSON.parse(res);
                if (g.success) {
                    if (this.func)
                        this.func(EventTypes.GetDevice, g);
                }
            }
        });
    }
    RegDevice(names, count) {
        this.send(new RegDeviceRequest(names, count), (res) => {
            if (res) {
                let r = JSON.parse(res);
                if (r.success) {
                    if (this.func)
                        this.func(EventTypes.RegDevice, r);
                }
            }
        });
    }
    SetDevice(values) {
        this.send(new SetDeviceDataRequest(values), (res) => {
        });
    }
    GetDeviceHistory(name, start, stop) {
        this.send(new DeviceHistoryRequest(name, start, stop), (res) => {
            if (res) {
                let r = JSON.parse(res);
                if (r.success) {
                    if (this.func) {
                        this.func(EventTypes.GetDevice, r);
                    }
                }
            }
        });
    }
    GetMsgID() {
        for (; ;) {
            if (this.id === 10) {
                this.id = 0;
            }
            this.id++;
            let node = null;
            node = this.queue.Get(this.id);
            if (!node || node.over) {
                return this.id;
            }
        }
    }
    SetEventHandle(func) {
        this.func = func;
    }
}

class Queue {
    constructor(timeout) {
        this.array = new Array();
        this.timeout = timeout;
    }
    Push(id, func) {
        let node = new QueueNode(id, func, new Date(new Date().getTime() + this.timeout));
        this.array[id] = node;
        //设置超时后自动执行超时方法。
        setTimeout(() => {
            if (!node.handle) {
                if (node.func)
                    node.func(null);
            }
        }, this.timeout);
    }
    First() {
        if (this.Length > 0) {
            return this.array[0];
        }
        else {
            return null;
        }
    }
    Get(id) {
        return this.array[id];
    }
    Shift() {
        return this.array.shift();
    }
    Clear() {
        let node = null;
        while (node = this.Shift()) {
            if (node.func)
                node.func(null);
        }
    }
    get Length() {
        return this.array.length;
    }
}

class QueueNode {
    constructor(id, func, time) {
        this.handle = false;
        this.id = id;
        this.time = time;
        this.func = (res) => {
            func(res);
            this.handle = true;
        };
    }
    get over() {
        return new Date() > this.time || this.handle;
    }
}

export { ECWebSocket, EventTypes };
