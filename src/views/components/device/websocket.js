import { Message } from 'element-ui'
import { getToken } from "@/utils/auth";

let websock = null
let messageCallback = null
let errorCallback = null
let wsUrl = ''

// 接收ws后端返回的数据
function webSocketOnMessage(e) {
    messageCallback(JSON.parse(e.data))
}

/**
 * 发起webSocket连接
 * @param {Object} agentData 需要向后台传递的参数数据
 */
function webSocketSend(agentData) {
    // 加延迟是为了尽量让ws连接状态变为OPEN   
    setTimeout(() => {
        // 添加状态判断，当为OPEN时，发送消息
        if (websock.readyState === websock.OPEN) { // websock.OPEN = 1 
            // 发给后端的数据需要字符串化
            websock.send(JSON.stringify(agentData))
        }
        if (websock.readyState === websock.CLOSED) { // websock.CLOSED = 3 
            console.log('websock.readyState = 3')
            Message.error('webSocketSend ws连接异常，请稍候重试')
            errorCallback()
        }
    }, 2000)
}

// 关闭ws连接
function webSocketClose(e) {
    // e.code === 1000  表示正常关闭。 无论为何目的而创建, 该链接都已成功完成任务。
    // e.code !== 1000  表示非正常关闭。
    if (e && e.code !== 1000) {
        Message.error('webSocketClose ws连接异常，请稍候重试')
        errorCallback()
    }
}

// 建立ws连接
function webSocketOpen(e) {
    console.log('ws连接成功')
}

// 初始化weosocket
function webSocketInit() {
    if (typeof (WebSocket) === 'undefined') {
        Message.error('您的浏览器不支持WebSocket，无法获取数据')
        return false
    }

    const token = getToken();
    //console.log("token", token);
    // ws请求完整地址
    const requstWsUrl = wsUrl + '/' + token;
    //const requstWsUrl = "ws://49.235.235.167:8080/websocket/eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6ImY4YmQ3ZTY1LWJmYjYtNGM5OS04OTk3LTBkOWEyY2YxMzI0MCJ9.4J14Z_Vc6IZEuRAZyseWwTjHe-CWG3C8VtMrmE23_W41-i0FzyuzYbIy44e1WCyWeX6z297U8eav-EX87WUJ-A"
    websock = new WebSocket(requstWsUrl);

    websock.onmessage = function (e) {
        webSocketOnMessage(e)
    }
    websock.onopen = function () {
        webSocketOpen()
    }
    websock.onerror = function () {
        Message.error('initWebSocket ws连接异常，请稍候重试')
        errorCallback()
    }
    websock.onclose = function (e) {
        webSocketClose(e)
    }
}

/**
 * 发起webSocket请求函数
 * @param {string} url ws连接地址
 * @param {Object} agentData 传给后台的参数
 * @param {function} successCallback 接收到ws数据，对数据进行处理的回调函数
 * @param {function} errCallback ws连接错误的回调函数
 */
export function initWebSocket(url, agentData, successCallback, errCallback) {
    wsUrl = url
    webSocketInit()
    messageCallback = successCallback
    errorCallback = errCallback
    webSocketSend(agentData)
}

/**
 * 发送webSocket数据
 * @param {Object} agentData 传给后台的参数
 */
export function sendWebSocket(agentData) {
    // 添加状态判断，当为OPEN时，发送消息
    if (websock.readyState === websock.OPEN) { // websock.OPEN = 1 
        // 发给后端的数据需要字符串化
        websock.send(JSON.stringify(agentData))
    }
    if (websock.readyState === websock.CLOSED) { // websock.CLOSED = 3 
        console.log('websock.readyState = 3')
        Message.error('webSocketSend ws连接异常，请稍候重试')
        errorCallback()
    }
}

/**
 * 关闭websocket函数
 */
export function closeWebSocket() {
    if (websock) {
        websock.close() // 关闭websocket
        websock.onclose() // 关闭websocket
    }
}

