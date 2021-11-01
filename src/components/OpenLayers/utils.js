export function getPath(x, y, z) {
    var shift = z / 2;
    var half = 2 << shift;
    //var half = 2^shift;
    var digits = 1;
    if (half > 10) {
        digits = parseInt(Math.log10(half)) + 1;
    }
    y = Math.pow(2, z) - y - 1

    var halfx = x / half;
    var halfy = y / half;
    var strx = zeroPadder(halfx, digits, '');
    var stry = zeroPadder(halfy, digits, '')
    var ex = zeroPadder(x, 2 * digits, '');
    var ey = zeroPadder(y, 2 * digits, '');
    return {
        file: strx + '_' + stry,
        row: ex,
        col: ey
    }
}

export function zeroPadder(number, order, padding) {
    var numberOrder = 1;
    number = parseInt(number);
    if (number > 9) {
        if (number > 11) {
            numberOrder = parseInt(Math.ceil(Math.log10(number) - 0.001));
        } else {
            numberOrder = 2;
        }
    }
    var diffOrder = order - numberOrder;
    if (diffOrder > 0) {
        while (diffOrder > 0) {
            padding += '0';
            diffOrder--;
        }
        padding += number; // toString() + Long.toString(number);
    } else {
        padding += number;
    }
    return padding;
}

//将字符串转换为dom对象
export function parseDom(arg) {
    var objE = document.createElement("div");
    objE.innerHTML = arg;
    return objE.childNodes;
}

//矢量图标转为图片
export function getCurrentIcon(iconFont, fontSize, fillColor, strokeColor) {
    var canvas = document.createElement('canvas');
    canvas.width = fontSize;
    canvas.height = fontSize;
    //  获取画布
    var context = canvas.getContext('2d');
    context.font = fontSize + 'px iconfont';
    context.textAlign = "left";
    context.textBaseline = "top";
    var content = iconFont;
    if (fillColor && fillColor !== "") {
        context.fillStyle = fillColor;
        context.fillText(content, 0, 0);
    }
    if (strokeColor && strokeColor !== "") {
        context.strokeStyle = strokeColor;
        context.strokeText(content, 0, 0);
    }
    return canvas.toDataURL('image/png');
}

//判断是不是图片
export function isPicture(icon) {
    return ['.jpeg', '.gif', '.jpg', '.png', '.bmp', '.pic', '.svg'].includes(icon.substring(icon.indexOf(".")))
}
