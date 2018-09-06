
/*
* base64转成blob
*/
function dataURItoBlob(base64Data) {
    let byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]);
    } else {
        byteString = decodeURI(base64Data.split(',')[1]);
    }

    let mimeString = base64Data
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
    let ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
}

/*
*
* 得到对象的类型
*/
function getType(obj) {
    let toString = Object.prototype.toString;
    let map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
}

// 压缩图片
function compressImg(file) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        let img = new Image();

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');

        img.onload = function() {
            // 图片原始尺寸
            let originWidth = this.width;
            let originHeight = this.height;

            // 目标尺寸
            let targetWidth = originWidth,
                targetHeight = originHeight;

            canvas.width = targetWidth;
            canvas.height = targetHeight;
            // 清除画布
            context.clearRect(0, 0, targetWidth, targetHeight);
            // 图片压缩
            context.drawImage(img, 0, 0, targetWidth, targetHeight);
            // canvas转为blob并上传

            if (canvas.toBlob) {
                canvas.toBlob(
                    function(blob) {
                        resolve({ blob, targetWidth, targetHeight });
                    },
                    file.type || 'image/png',
                    0.5,
                );
            } else {
                let dataURL = canvas.toDataURL(file.type, 0.5);
                let blob = dataURItoBlob(dataURL);
                resolve({ blob, targetWidth, targetHeight });
            }
        };

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}

// 模版替换
function tempEngine(template, json) {
    let pattern = /\{(\w*[:]*[=]*\w+)\}(?!})/g;
    return template.replace(pattern, function(match, key, value) {
        return json[key] || '';
    });
}

module.exports = {
    dataURItoBlob,
    getType,
    compressImg,
    tempEngine
}