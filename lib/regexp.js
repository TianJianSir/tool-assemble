const EmailRegex = /^(\w)[\w\-]+(\.\w+)*@([A-Za-zd0-9]+[-.])+[A-Za-zd]{2,4}$/
const PhoneRegex = /(^1(3[5-9]|47|5[012789]|78|73|8[23478])\d{8}$|134[0-8]\d{7}$)|(^1(8[019]|77)\d{8}$|1349\d{7}$)|(^1(3[0-2]|45|5[56]|76|8[56])\d{8}$)|(^1[35]3\d{8}$)|(^17[059]\d{8}$)/
const TelephoneRegex = /^(0[0-9]{2,3}\-)?([2-9][0-9]{6,7})+(\-[0-9]{1,4})?$/
const URLRegex = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]':+!]*([^<>""])*$/
const HasNumberRegex = /^.*\d+.*$/
const IDCardRegex = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/
const PassWordRegex = /^(?![^a-zA-Z]+$)(?!\D+$).{6,12}$/
const NumberType = /^[0-9]+([.]{1}[0-9]+){0,1}$/
const ChineseRegex = /.*[\u4e00-\u9fa5]+.*$/

// 是否为空
function isNull(value) {
    if (value === '') {
        return true
    }

    if (value.length === 0) {
        return true
    }

    return false
}

// 对象是否为空
function isEmpty(obj) {
    for (const i in obj) {
        if (obj.hasOwnProperty(i)) {
            return false
        }
    }

    return true
}

// 比较两个数字是否相等，因为0.1+0.2 !== 0.3,所以简单的===比较，在极少的情况下是不正确的
function numbersCloasEnoughToEqual(n1,n2){
    if(!Number.EPSILON){
        Number.EPSILON = Math.pow(2,-52)
    }
    return Math.abs(n1-n2)<Number.EPSILON
}

// 身份证号验证
function isIDCard(value) {
    return IDCardRegex.test(value)
}

// 是否包含数字
function isHasNumber(value) {
    return HasNumberRegex.test(value)
}

// 是否为整数或小数
function isNumberType(value) {
    return NumberType.test(value)
}

// 输入的是否是中文
function isChinese(value) {
    return ChineseRegex.test(value)
}

// 是否是邮箱
function isEmail(value,type) {
    return EmailRegex.test(value)
}

// 是否是电话号码
function isTelephoneRegex(value) {
    return TelephoneRegex.test(value)
}

// 是否是手机号码
function isPhone(value) {
    return PhoneRegex.test(value)
}

// 是否是一个链接
function isURLRegex(value) {
    return URLRegex.test(value)
}

module.exports = {
  isNull,
  isEmpty,
  numbersCloasEnoughToEqual,
  isIDCard,
  isHasNumber,
  isNumberType,
  isChinese,
  isEmail,
  isTelephoneRegex,
  isPhone,
  isURLRegex
}
