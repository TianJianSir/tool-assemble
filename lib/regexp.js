const EmailReg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;


function isEmail(str){
    return EmailReg.test(str)
}

module.exports = {
    isEmail
}