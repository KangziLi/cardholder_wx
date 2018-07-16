// pages/createcard/createcard.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    mycard: {
      id: 0,
      avatarUrl: '',
      name: '',
      comp: '',
      phone: '',
      title: '',
      address: '',
      other: '',
    },
    mycardId: 0,
    imageSrc: "",
  },
  bindinputName(e) {
    let mycard = this.data.mycard;
    mycard.name = e.detail.value;
    this.setData({ mycard: mycard });
  },
  bindinputTitle(e) {
    let mycard = this.data.mycard;
    mycard.title = e.detail.value;
    this.setData({ mycard: mycard });
  },
  bindinputMobile(e) {
    let mycard = this.data.mycard;
    mycard.phone = e.detail.value;
    this.setData({ mycard: mycard });
  },
  bindinputCompany(e) {
    let mycard = this.data.mycard;
    mycard.comp = e.detail.value;
    this.setData({ mycard: mycard });
  },
  bindinputOther(e) {
    let mycard = this.data.mycard;
    mycard.other = e.detail.value;
    this.setData({ mycard: mycard });
  },
  bindinputAddress(e) {
    let mycard = this.data.mycard;
    mycard.address = e.detail.value;
    this.setData({ mycard: mycard });
  },
  //选择图像进行识别
  bindChooseImg(e) {
    wx.navigateTo({
      url: '../cardscanner/cardscanner',
    })
  },
  saveMycard() {
    console.log(this.data.mycard)
    let mycard = this.data.mycard;

    if (mycard.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    let that = this;
    console.log(api.MyCardSave)
    util.request(api.MyCardSave,{ 
        id: mycard.id,
        name: mycard.name,
        phone: mycard.phone,
        comp: mycard.comp,
        title: mycard.title,
        address: mycard.address,
        other: mycard.other
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        wx.navigateBack();
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    let mycard = this.data.mycard;
    mycard.name = wx.getStorageSync('userInfo').nickName;
    mycard.avatarUrl = wx.getStorageSync('userInfo').avatarUrl;
    this.setData({ mycard: mycard });
  },

  onReady: function () {
    // 页面渲染完成    
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  openAddress: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          'cardData.data.address': res.address,
          'cardData.data.loglat': res.latitude + ',' + res.longitude
        })
        that.setData({
          'enCardData.data.address': res.address,
          'enCardData.data.loglat': res.latitude + ',' + res.longitude
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },

  formSubmit: function (e) {
    var that = this
    if (e.detail.value.name === '' || e.detail.value.mobile === '') {
      if (e.detail.value.name === '') {
        wx.showToast({
          title: '姓名必填',
          image: '../../images/error.png',
          duration: 2000
        })
      }
      if (e.detail.value.mobile === '') {
        wx.showToast({
          title: '手机必填',
          image: '../../images/error.png',
          duration: 2000
        })
      }
    } else {

      var data = {
        'url': '',
        'data': {
          'id': that.data.cardData.data.id,
          'name': e.detail.value.name,
          'title': e.detail.value.title,
          'mobile': e.detail.value.mobile,
          'companyName': e.detail.value.companyName,
          'more': e.detail.value.more,
          'avatarUrl': that.data.cardData.data.avatarUrl,
          'isDefaurl': false,
          'email': e.detail.value.email,
          'address': e.detail.value.address,
          'loglat': that.data.cardData.data.loglat,
          'language': 0
        }
      }

      app.postData(data, function (res) {
        if (res.code === 200) {
          var loginSuccessData = {
            'token': wx.getStorageSync('loginSuccessData').token,
            'mobile': e.detail.value.mobile,
            'mobVerify': wx.getStorageSync('loginSuccessData').mobVerify
          }
          wx.setStorageSync('loginSuccessData', loginSuccessData)
          wx.navigateBack({
            delta: 1
          })

        }
      })
    }


  },

  formReset: function () {
    console.log('form发生了reset事件')
  }
})