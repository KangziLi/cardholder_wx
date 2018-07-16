// 服务器API地址
// 本机开发时使用
var WxApiRoot = 'http://localhost:8080/';

module.exports = {
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置

  MyCardList: WxApiRoot + 'mycard/list',  //获取自己名片列表
  MyCardSave: WxApiRoot + 'mycard/save',  //增加编辑自己名片
  MyCardDelete: WxApiRoot + 'mycard/delete',//删除自己名片
  MyCardDetail: WxApiRoot + 'mycard/detail',//名片信息

  CardList: WxApiRoot + 'card/list',  //获取名片列表
  CardSave: WxApiRoot + 'card/save',  //增加名片
  CardDelete: WxApiRoot + 'card/delete',//删除名片
  CardDetail: WxApiRoot + 'card/detail',//名片信息

  CardTest: WxApiRoot + 'card/test',//测试
  OCR: WxApiRoot + 'card/ocr',//测试
};