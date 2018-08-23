var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var app = getApp();
const ctx = wx.createCanvasContext('myCanvas')

Page({
  data: {
    myCardData: [],
    userInfo: {
      nickName: '登录同步云端数据',
      avatarUrl: '../../images/backup.png'
    },
    did: 0,
    dtempid: 0,
    dname: "",
    dtitle: "",
    dcomp: "",
    daddress: "",
    dphone: "",
    dother: "",
    showcan: false,
    current: 0,
    len: 0
  },

  //获取我的名片数据
  getmyCardData: function() {
    console.log("mycard.js getmyCardData 获取我的名片数据");
    var that = this;
    util.request(api.MyCardList).then(function(res) {
      console.log("我的名片数据");
      console.log(res);
      if (res.errno === 0) {
        that.setData({
          myCardData: res.data,
          len: res.data.length,
        })
        wx.setStorage({
          key: 'myCard',
          data: res.data,
        })
      };
    })
  },

  //微信登录
  wxLogin: function (e) {
    let that=this;
    if (e.detail.userInfo == undefined) {
      app.globalData.hasLogin = false;
      util.showErrorToast('微信登录失败');
      return;
    }
    user.checkLogin().catch(() => {
      user.loginByWeixin(e.detail.userInfo).then(res => {
        app.globalData.hasLogin = true;
        that.onShow();
      }).catch((err) => {
        app.globalData.hasLogin = false;
        util.showErrorToast('微信登录失败');
        that.onShow();
      });

    });
    
  },

  //跳转至个人名片创建
  openCreatecard: function() {
    console.log("mycard.js openCreatecard 跳转至个人名片创建");
    wx.navigateTo({
      url: '../createmycard/createmycard'
    })
  },

  //生成分享信息
  onShareAppMessage: function() {
    if (this.data.myCardData.length==0){
      wx.showModal({
        title: '提示',
        content: '您还未创建个人名片，请先填写您的名片信息',
        success:function(res){
          if(res.confirm){
            wx.navigateTo({
              url: '../createmycard/createmycard'
            })
          }
        }
      })
    }
    console.log("mycard.js  onShareAppMessage 生成分享信息");
    let that = this;
    var cur = this.data.current;
    var did = this.data.myCardData[cur].id;
    var dtempid = this.data.myCardData[cur].tempid;
    var dname = this.data.myCardData[cur].name;
    var dtitle = this.data.myCardData[cur].title;
    var dcomp = this.data.myCardData[cur].comp;
    var daddress = this.data.myCardData[cur].address;
    var dphone = this.data.myCardData[cur].phone;
    var dother = this.data.myCardData[cur].other;
    var path = '/pages/sharecard/sharecard?id=' + did + "&flag=0&name=" + dname + '&title=' + dtitle + '&comp=' + dcomp + '&address=' + daddress + '&phone=' + dphone + '&other=' + dother;
    var title = '您好，我是' + dname + '，这是我的名片，请惠存';
    console.log(path)
    return {
      title: title,
      path: path,
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  },

  //监听名片切换事件
  bindChange: function(e) {
    console.log("current" + e.detail.current)
    this.setData({
      current: e.detail.current
    });
  },

  //进入登录页面 目前没有使用
  goLogin() {
    console.log("mycard.js goLogin 进入登录页面");
    console.log("app.globalData.hasLogin=" + app.globalData.hasLogin);
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } else {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
      wx.showToast({
        title: '登录成功',
      })
    }
  },

  onLoad: function(options) {
    //检测是否登陆
    user.checkLogin().then(res => {
      console.log("this.globalData.hasLogin = true")
      app.globalData.hasLogin = true;
    }).catch(() => {
      console.log("this.globalData.hasLogin = false")
      app.globalData.hasLogin = false;
    });
    // 页面初始化 options为页面跳转所带来的参数
    console.log("user.js onload")
    console.log("app.globalData.hasLogin=" + app.globalData.hasLogin);
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
    }
    
  },

  onReady: function() {
    console.log("user.js onready")
    console.log(app.globalData.hasLogin)
    // 页面渲染完成
  },

  onShow: function() {
    console.log("user.js onshow")
    //页面显示
    //获取用户的登录信息
    this.setData({
      current: 0
    })
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
      //上传本地缓存
      wx.getStorage({
        key: 'myCard_temp',
        success: function(res) {
          let temp = res.data;
          for (var i = 0; i < temp.length; i++) {
            util.request(api.MyCardSave, temp[i], 'POST').then(function(res) {
              console.log(res);
            });
          }
          wx.setStorage({
            key: 'myCard_temp',
            data: [],
          })
        }
      });
      this.getmyCardData();
    } else {
      //未登录获取本地数据
      let temp = wx.getStorageSync('myCard_temp');
      this.setData({
        myCardData: temp
      })
    }
    var length = this.data.myCardData.length;
    this.setData({
      len: length
    })
  },

  onHide: function() {
    // 页面隐藏
  },

  onUnload: function() {
    // 页面关闭
  }
})