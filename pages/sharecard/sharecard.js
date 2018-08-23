// pages/carddetails/carddetails.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var QR = require('../../utils/qrcode.js');
//获取应用实例
const ctx = wx.createCanvasContext('myCanvas')
var app = getApp()

Page({
  data: {
    canvasHidden: true,
    maskHidden: true,
    imagePath: '',
    qrcode: 'MECARD:TEL:shouji;TEL:dianhua;URL:http://wangzhi;EMAIL:dianziyouxiang;NOTE:qq;N:xingming;ORG:danwei;TIL:zhiwei;ADR:dizhi;',
    showcan: false,
    flag: 0,
    tempid:0,
    id: 0,
    name: '',
    comp: '',
    phone: '',
    title: '',
    address: '',
    other: '',
    avatarUrl: '../../images/man2.png',
    oldother:'',
  },

  //获取备注信息
  bindinputOther(e) {
    this.setData({
      other: e.detail.value
    });
  },

  //添加至通讯录
  addcontact: function() {
    let that = this;
    wx.addPhoneContact({
      firstName: that.data.name,
      mobilePhoneNumber: that.data.phone,
      title: that.data.title,
      organization: that.data.comp,
      workAddressStreet: that.data.address,
      remark: that.data.other,
      success: function() {
        wx.showToast({
          title: '添加成功',
        })
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        });
      }
    })
  },

  //添加至名片夹
  addCard: function() {
    var that = this;
    console.log(app.globalData.hasLogin)
    if (app.globalData.hasLogin) {
      console.log("api.CardSave")
      util.request(api.CardSave, {
        id: 0,
        name: that.data.name,
        phone: that.data.phone,
        comp: that.data.comp,
        title: that.data.title,
        address: that.data.address,
        other: that.data.other
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          wx.showToast({
            title: '收藏成功',
          })
        }
      });
    } else {
      console.log("localCardSave")
      //未登录 本地存储
      var card = {
        id: 0,
        tempid:0,
        name: that.data.name,
        phone: that.data.phone,
        comp: that.data.comp,
        title: that.data.title,
        address: that.data.address,
        other: that.data.other
      }
      var temp = [];
      temp.push(card);
      wx.getStorage({
        key: 'Card_temp',
        success: function(res) {
          //已存在本地缓存
          var temp2 = res.data;
          var len = res.data.length - 1;
          if (res.data.length != 0) {
            temp[0].tempid = temp2[len].tempid + 1;
          } else {
            temp[0].tempid = 1;
          }
          wx.setStorage({
            key: 'Card_temp',
            data: temp2.concat(temp),
          })
          wx.showToast({
            title: '收藏成功',
          })
        },
        fail: function(res) {
          //本地无缓存数据
          wx.setStorage({
            key: 'Card_temp',
            data: temp,
          })
          wx.showToast({
            title: '收藏成功',
          })
        },
      })
    }
  },

  //进入我的名片主页
  cardcase:function(){
    wx.switchTab({
      url: '/pages/mycard/mycard',
    });
  },

  //生成分享信息
  onShareAppMessage: function() {
    let that = this;
    var did = this.data.id;
    var dname = this.data.name;
    var dtitle = this.data.title;
    var dcomp = this.data.comp;
    var daddress = this.data.address;
    var dphone = this.data.phone;
    var dother = this.data.other;
    var path = '/pages/sharecard/sharecard?id=' + did + "&flag=1&name=" + dname + '&title=' + dtitle + '&comp=' + dcomp + '&address=' + daddress + '&phone=' + dphone + '&other=' + dother;
    var title = '我向您转发了关于' + dname + '的名片信息';
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

  onLoad: function(options) {
    console.log(options);
    this.setData({
      id: options.id,
      flag: options.flag,
      name: options.name,
      comp: options.comp,
      phone: options.phone,
      title: options.title,
      address: options.address,
      other: options.other,
      oldother: options.other,
    });
    /*
    let that = this;
    if (options.flag == 0) {
      console.log("this.data.flag=0");
      util.request(api.MyCardDetail, {
        id: options.id
      }).then(function (res) {

        if (res.errno === 0) {

          that.setData({
            name: res.data.name,
            comp: res.data.comp,
            phone: res.data.phone,
            title: res.data.title,
            address: res.data.address,
            other: res.data.other,
          });
        }
      });
    } else {
      console.log("this.data.flag=1");
      util.request(api.CardDetail, {
        id: options.id
      }).then(function (res) {
        if (res.errno === 0) {
          console.log("get detail success")
          that.setData({
            name: res.data.name,
            comp: res.data.comp,
            phone: res.data.phone,
            title: res.data.title,
            address: res.data.address,
            other: res.data.other,
          });
        } else (console.log(res.errmsg))
      });

    }
    */

  },

  onReady: function() {
    // 页面渲染完成
  },

  onShow: function() {
    // 页面显示
  },

  onHide: function() {
    // 页面隐藏
  },

  onUnload: function() {
    // 页面关闭
  }
})