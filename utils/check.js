//手机号码验证
function isValidPhone(str) {
  //var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
  var myreg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
  if (!myreg.test(str)) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  isValidPhone
}