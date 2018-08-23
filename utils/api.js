// 服务器API地址
// 本机开发时使用
//var WxApiRoot = 'http://localhost:8080/';
//局域网地址
//var WxApiRoot = 'http://172.16.242.24:8080/';
//云服务器地址
//var WxApiRoot = 'http://119.23.57.120:443/';
//服务器域名地址
var WxApiRoot = 'https://likangzi.cn/';

module.exports = {

  //授权接口
  AuthLoginByWeixin: WxApiRoot + 'auth/login_by_weixin', //微信登录
  AuthLoginByAccount: WxApiRoot + 'auth/login', //账号登录
  AuthRegister: WxApiRoot + 'auth/register', //账号注册
  AuthReset: WxApiRoot + 'auth/reset', //账号密码重置

  //个人名片接口
  MyCardList: WxApiRoot + 'mycard/list',  //获取自己名片列表
  MyCardSave: WxApiRoot + 'mycard/save',  //增加编辑自己名片
  MyCardDelete: WxApiRoot + 'mycard/delete',//删除自己名片
  MyCardDetail: WxApiRoot + 'mycard/detail',//名片信息
  
  //他人名片接口
  CardList: WxApiRoot + 'card/list',  //获取名片列表
  CardSave: WxApiRoot + 'card/save',  //增加名片
  CardDelete: WxApiRoot + 'card/delete',//删除名片
  CardDetail: WxApiRoot + 'card/detail',//名片信息
  CardSearch: WxApiRoot + 'card/search',//名片搜索
  
  //其他
  CardTest: WxApiRoot + 'card/test',//测试
};