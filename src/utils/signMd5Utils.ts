
export default class signMd5Utils{

    /**
     * json参数升序
     * @param jsonObj 发送参数
     */

    /*static sortAsc(jsonObj) {
        let arr = new Array();
        let num = 0;
        for (let i in jsonObj) {
            arr[num] = i;
            num++;
        }
        let sortArr = arr.sort();
        let sortObj = {};
        for (let i in sortArr) {
            sortObj[sortArr[i]] = jsonObj[sortArr[i]];
        }
        return sortObj;
    }
    static getSign(url: string, requestParams: Object) {
        let urlParams = this.parseQueryString(url);
        let jsonObj = this.mergeObject(urlParams, requestParams);
        //console.log("sign jsonObj: ",jsonObj)
        let requestBody = this.sortAsc(jsonObj);
        console.log("sign requestBody: ",requestBody)
        return md5(JSON.stringify(requestBody) + signatureSecret).toUpperCase();
    }
    static parseQueryString(url) {
        let urlReg = /^[^\?]+\?([\w\W]+)$/,
            paramReg = /([^&=]+)=([\w\W]*?)(&|$|#)/g,
            urlArray = urlReg.exec(url),
            result = {};

        // 获取URL上最后带逗号的参数变量 sys/dict/getDictItems/sys_user,realname,username
        //【这边条件没有encode】带条件参数例子：/sys/dict/getDictItems/sys_user,realname,id,username!='admin'%20order%20by%20create_time
        let lastpathVariable = url.substring(url.lastIndexOf('/') + 1);
        if(lastpathVariable.includes(",")){
            if(lastpathVariable.includes("?")){
                lastpathVariable = lastpathVariable.substring(0, lastpathVariable.indexOf("?"));
            }
            //解决Sign 签名校验失败 #2728
            result["x-path-variable"] = decodeURI(lastpathVariable);
        }
        if (urlArray && urlArray[1]) {
            let paramString = urlArray[1], paramResult;
            while ((paramResult = paramReg.exec(paramString)) != null) {
                //数字值转为string类型，前后端加密规则保持一致
                if(this.myIsNaN(paramResult[2])){
                    paramResult[2] = paramResult[2].toString()
                }
                result[paramResult[1]] = paramResult[2];
            }
        }
        return result;
    }
    static mergeObject(objectOne, objectTwo) {
        if (objectTwo && Object.keys(objectTwo).length > 0) {
            for (let key in objectTwo) {
                if (objectTwo.hasOwnProperty(key) === true) {
                    //数字值转为string类型，前后端加密规则保持一致
                    if(this.myIsNaN(objectTwo[key])){
                        objectTwo[key] = objectTwo[key].toString()
                    }
                    objectOne[key] = objectTwo[key];
                }
            }
        }
        return objectOne;
    }*/
}
