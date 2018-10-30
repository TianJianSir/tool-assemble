// base64转成blob
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

// 得到对象的类型
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

// 清除空格
function removeBlank(value) {
    return value.replace(/\s+/g, "")
}

/**
 * 从arrary 中删除一个数据
 * @param array
 * @param value
 * @returns {*}
 */
function delete_e_from_array(array, value) {
    const index = array.indexOf(value);
    if (index > -1) {
        return array.splice(index, 1)
    }
    return array
}

/**
 * 从Obj 中删除空数据
 * @param obj
 * @returns {*}
 */
function remove_empty_from_obj(obj) {
    Object.keys(obj).forEach((key) => (obj[key] === null || obj[key] === '' || obj[key] === undefined) && delete obj[key]);
    return obj;
}

/**
 * 对字符串排序并且进行反转
 * @param a
 * @returns {string}
 */
function sortChars(a) {
    return a.split('').sort().reverse().join('');
}

/**
 * 格式化日期参数
 * @param date
 * @returns {string}
 * @constructor
 */
function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

/**
 * 深度拷贝 防止相同绑定数据同时需改
 * @param oldObj
 * @returns {any}
 */

function deepCopy(oldObj) {
    let newObj = oldObj;
    if (oldObj && typeof oldObj === 'object') {
        newObj = Object.prototype.toString.call(oldObj) === '[object Array]' ? [] : {};
        for (const i in oldObj) {
            if (oldObj.hasOwnProperty(i)) {
                newObj[i] = this.deepCopy(oldObj[i]);
            }
        }
    }
    return newObj;
}

// 转成千分位的财务数字格式
function comdify(n){
    let re=/\d{1,3}(?=(\d{3})+$)/g;
    let n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
    return n1;
}

// 取数组的并集
function mergeArr(arr) {
    let result = []
    for (const item of arr) {
        result = result.concat(item)
    }

    return Array.from(new Set(result))
}

// 得到浏览器的类型
function getBrowserType() {
    const userAgent = navigator.userAgent
    const isOpera = userAgent.indexOf('Opera') > -1
    if (isOpera) {
        return 'Opera'
    }
    if (userAgent.indexOf('Firefox') > -1) {
        return 'FF'
    }
    if (userAgent.indexOf('Chrome') > -1) {
        return 'Chrome'
    }
    if (userAgent.indexOf('Safari') > -1) {
        return 'Safari'
    }
    if ((userAgent.indexOf('compatible') > -1 && userAgent.indexOf('MSIE') > -1 && !isOpera) || userAgent.indexOf('Trident') > -1) {
        return 'IE'
    }
}

/* 下载文件,
*  修复了downloadjs中 文件名有中文时下载错误的问题
*  大部分情况下面的downloadFile方法都可以解决，若是解决不了尝试使用这个方法
*  IE10以上可以兼容，祝你好运
* */

function download(data, strFileName, strMimeType) {
    var self = window, // this script is only for browsers anyway...
        defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
        mimeType = strMimeType || defaultMime,
        payload = data,
        url = !strFileName && !strMimeType && payload,
        anchor = document.createElement("a"),
        toString = function(a){return String(a);},
        myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
        fileName = strFileName || "download",
        blob,
        reader;
    myBlob= myBlob.call ? myBlob.bind(self) : Blob ;

    if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
        payload=[payload, mimeType];
        mimeType=payload[0];
        payload=payload[1];
    }


    if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
        fileName = url.split("/").pop().split("?")[0];
        anchor.href = url; // assign href prop to temp anchor
        // 若是有中文的时候则不会进来，所以会报错
        if(decodeURIComponent(anchor.href).indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
            var ajax=new XMLHttpRequest();
            ajax.open( "GET", url, true);
            ajax.responseType = 'blob';
            ajax.onload= function(e){
                download(e.target.response, fileName, defaultMime);
            };
            setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
            return ajax;
        } // end if valid url?
    } // end if url?


    //go ahead and download dataURLs right away
    if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)){

        if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
            payload=dataUrlToBlob(payload);
            mimeType=payload.type || defaultMime;
        }else{
            return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
                navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
                saver(payload) ; // everyone else can save dataURLs un-processed
        }

    }else{//not data url, is it a string with special needs?
        if(/([\x80-\xff])/.test(payload)){
            var i=0, tempUiArr= new Uint8Array(payload.length), mx=tempUiArr.length;
            for(i;i<mx;++i) tempUiArr[i]= payload.charCodeAt(i);
            payload=new myBlob([tempUiArr], {type: mimeType});
        }
    }
    blob = payload instanceof myBlob ?
        payload :
        new myBlob([payload], {type: mimeType}) ;

    // 将database格式转成Bolb
    function dataUrlToBlob(strUrl) {
        var parts= strUrl.split(/[:;,]/),
            type= parts[1],
            decoder= parts[2] == "base64" ? atob : decodeURIComponent,
            binData= decoder( parts.pop() ),
            mx= binData.length,
            i= 0,
            uiArr= new Uint8Array(mx);

        for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

        return new myBlob([uiArr], {type: type});
    }

    // 保存方法
    function saver(url, winMode){
        if ('download' in anchor) { //html5 A[download]
            anchor.href = url;
            anchor.setAttribute("download", fileName);
            anchor.className = "download-js-link";
            anchor.innerHTML = "downloading...";
            anchor.style.display = "none";
            document.body.appendChild(anchor);
            setTimeout(function() {
                anchor.click();
                document.body.removeChild(anchor);
                if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
            }, 66);
            return true;
        }

        // handle non-a[download] safari as best we can:
        if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
            if(/^data:/.test(url))	url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
            if(!window.open(url)){ // popup blocked, offer direct download:
                if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
            }
            return true;
        }

        //do iframe dataURL download (old ch+FF):
        var f = document.createElement("iframe");
        document.body.appendChild(f);

        if(!winMode && /^data:/.test(url)){ // force a mime that will download:
            url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
        }
        f.src=url;
        setTimeout(function(){ document.body.removeChild(f); }, 333);

    }//end saver

    if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
        return navigator.msSaveBlob(blob, fileName);
    }

    if(self.URL){ // simple fast and modern way using Blob and URL:
        saver(self.URL.createObjectURL(blob), true);
    }else{
        // handle non-Blob()+non-URL browsers:
        if(typeof blob === "string" || blob.constructor===toString ){
            try{
                return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
            }catch(y){
                return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
            }
        }

        // Blob but not URL support:
        reader=new FileReader();
        reader.onload=function(e){
            saver(this.result);
        };
        reader.readAsDataURL(blob);
    }
    return true;
};

// 模板引擎实现，关键正则要写好，以及New Function
// 虽然在react中没什么用，还是作为工具集写上
// 1,分离出静态的代码
// 2,分离出动态的代码，然后处理下变量输出
// 3,将动态代码和静态代码还原到一起,对于直接输出的内容处理，js语法不动，也就是动态的不动，处理静态输出
// 4，将代码传递进去，生成一个function，然后传参执行这个function
// 返回结果
function render(template, data){
    const static_code = template.split(spliter)
    const dynamic_code = template.match(spliter).map(str => str.startsWith(`<%=`) ? `engies(${str.slice(3, -2).trim()})` : str.slice(2, -2).trim())
    const full_code = static_code.map((txt, i) => i in dynamic_code ? `engies(${JSON.stringify(txt)})\n${dynamic_code[i]}\n` : `engies(${JSON.stringify(txt)})\n`).join('')
    const output = []
    new Function(...Object.keys(data), "engies", full_code)(...Object.values(data), t => output.push(t))
    return output.join('')
}

// 预览图片
function perviewImage(file, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    if (file) {
        reader.readAsDataURL(file)
    }
}

// 比较两个对象的值是否相同
function isObjectValueEqual(a, b) {
    const aProps = Object.getOwnPropertyNames(a)
    const bProps = Object.getOwnPropertyNames(b)

    if (aProps.length !== bProps.length) {
        return false
    }

    for (let i = 0; i < aProps.length; i++) {
        const propName = aProps[i]
        if (Object.prototype.toString(a[propName]) === '[Object Object]' || Object.prototype.toString(b[propName]) === '[Object Object]') {
            this.isObjectValueEqual(a[propName], b[propName])
        }
        if (a[propName] !== b[propName]) {
            console.log(a[propName],b[propName])
            return false
        }
    }

    return true
}

// 写cookies
function setCookie(name, value) {
    const days = 30
    const exp = new Date()
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000)
    let encode_result = encodeURIComponent(String(value))
        .replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

    document.cookie = `${name}=${encode_result};path=/;`
}

// 读取cookies
function getCookies(name) {
    let arr, reg = new RegExp(`(^|)${name}=([^;]*)(;|$)`)
    if (arr = document.cookie.match(reg)) {
        return decodeURIComponent(arr[2])
    } else {
        return null
    }
}

// 删除cookies
function delCookies(name) {
    const exp = new Date()
    exp.setTime(exp.getTime() - 1)
    const cval = this.getCookies(name)
    if (cval) {
        document.cookie = `${name}=${cval};expires=${exp.toUTCString()}`
    }
}

// 导出excel
function exportFileExcel(output) {
    const parser = new DOMParser()
    const htmldoc = parser.parseFromString(output, 'text/html')
    const body_str = htmldoc.documentElement.getElementsByTagName('body')[0].innerHTML
    const head_str = htmldoc.documentElement.getElementsByTagName('head')[0].innerHTML
    const myiframe = document.createElement('iframe')
    document.body.appendChild(myiframe)
    myiframe.contentWindow.document.body.innerHTML = body_str
    myiframe.contentWindow.document.head.innerHTML = head_str
    const table = myiframe.contentWindow.document.getElementById('testTable')

    const uri = 'data:application/vnd.ms-excel;base64,'
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    const base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    const format = function (s, c) { return s.replace(/{(\w+)}/g, (m, p) => c[p]) }

    const ctx = { worksheet: 'Worksheet', table: table.innerHTML }
    const url = uri + base64(format(template, ctx))
    window.open(url, '_blank')
}

// 得到元素距离顶部的距离
function getObjOffsetTop(obj){
    let top = obj.offsetTop
    let current = obj.offsetParent
    if(current){
        top+=current.offsetTop
        current = current.offsetParent
    }

    return top
}

// 返回对象的属性(keys)数组,Object.keys()
function objectKeys(obj) {
    const arr = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push(key)
        }
    }
    return arr
}

// 返回对象的属性值(values)数组,Object.values()
function objectValues(obj) {
    const arr = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push(obj[key])
        }
    }
    return arr
}

// 返回对象的键值对数组([key, value]),Object.entries()
function objectEntries(obj) {
    const arr = []
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            arr.push([key, obj[key]])
        }
    }
    return arr
}

module.exports = {
    dataURItoBlob,
    getType,
    compressImg,
    tempEngine,
    removeBlank,
    delete_e_from_array,
    remove_empty_from_obj,
    sortChars,
    formatDate,
    deepCopy,
    comdify,
    mergeArr,
    getBrowserType,
    download,
    render,
    perviewImage,
    isObjectValueEqual,
    setCookie,
    getCookies,
    delCookies,
    exportFileExcel,
    getObjOffsetTop,
    objectKeys,
    objectValues,
    objectEntries
}
