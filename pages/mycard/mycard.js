var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var app = getApp();

Page({
  data: {
    myCardData: [],
    userInfo: {
      nickName: '点击登录',
      avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png'
    },
  },
  getmyCardData: function () {
    //获取我的名片数据
    let that = this;
    util.request(api.MyCardList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          myCardData: res.data
        });
      }
    })
    console.log(res.data)
  },

  openCreatecard: function () {
    //跳转
    var that = this
    wx.navigateTo({
      url: '../createmycard/createmycard'
    })
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
        };
        let unlogin = this.data.userInfo;
        unlogin.nickName = '点击登录';
        unlogin.avatarUrl = 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png';
        this.setData({
          userInfo: unlogin
        })
      }
    })    
    this.globalData.hasLogin = false
  },
  goLogin() {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({ url: "/pages/auth/login/login" });
    }
    else {
      this.exitLogin();
    }
  },





  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示

    //获取用户的登录信息
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
    }
    this.getmyCardData();

  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})