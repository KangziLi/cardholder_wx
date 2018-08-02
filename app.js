//app.js

var util = require('./utils/util.js');
var api = require('./utils/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function () {

    //测试后端连通性
    wx.request({
      url: api.CardTest,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("--------------!!!Connection success!!!--------------")
        console.log(res)
      }
    });
  },
  onShow: function (options) {
    //检测是否登陆
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
  },
  globalData: {
    hasLogin: false,
    deleteid:-1
  }

})