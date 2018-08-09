//app.js

var util = require('./utils/util.js');
var api = require('./utils/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function () {
    console.log("app.js onLaunch")
    //测试后端连通性
    wx.request({
      url: api.CardTest,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("--------------!!!Server connection success!!!--------------")
      }
    });
  },
  onShow: function (options) {
    console.log("app.js onShow")
    //检测是否登陆
    user.checkLogin().then(res => {
      console.log("this.globalData.hasLogin = true")
      this.globalData.hasLogin = true;
    }).catch(() => {
      console.log("this.globalData.hasLogin = false")
      this.globalData.hasLogin = false;
    });
    console.log("this.globalData.hasLogin=" + this.globalData.hasLogin)
  },
  globalData: {
    hasLogin: false,
    deleteid:-1
  }

})