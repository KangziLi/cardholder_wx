//app.js
var util = require('./utils/util.js');
var api = require('./utils/api.js');
var user = require('./utils/user.js');

App({
  onLaunch: function () {
    //测试连通性
    wx.request({
      url: api.CardTest,
      data: {},
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("CardTest success")
        console.log(res)
      }
    });
  },
  onShow: function (options) {
    user.checkLogin().then(res => {
      this.globalData.hasLogin = true;
    }).catch(() => {
      this.globalData.hasLogin = false;
    });
  },
  globalData: {
    hasLogin: false
  }
})