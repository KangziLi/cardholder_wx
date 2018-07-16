// pages/createcard/createcard.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    card: {
      id: 0,
      name: '',
      comp: '',
      phone: '',
      title: '',
      address: '',
      other: '',
    },
    cardId: 0,
  },
  bindinputName(e) {
    let card = this.data.card;
    card.name = e.detail.value;
    this.setData({ card: card });
  },
  bindinputTitle(e) {
    let card = this.data.card;
    card.title = e.detail.value;
    this.setData({ card: card });
  },
  bindinputMobile(e) {
    let card = this.data.card;
    card.phone = e.detail.value;
    this.setData({ card: card });
  },
  bindinputCompany(e) {
    let card = this.data.card;
    card.comp = e.detail.value;
    this.setData({ card: card });
  },
  bindinputOther(e) {
    let card = this.data.card;
    card.other = e.detail.value;
    this.setData({ card: card });
  },
  bindinputAddress(e) {
    let card = this.data.card;
    card.address = e.detail.value;
    this.setData({ card: card });
  },
  //选择图像进行识别
  bindChooseImg(e) {
    let scanner = this.cardScanner
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function (res) {
        //未写接口
        scanner.onImageChanged && scanner.onImageChanged(res.tempFilePaths[0])
        scanner.setImage(res.tempFilePaths[0])
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  savecard() {
    console.log(this.data.card)
    let card = this.data.card;

    if (card.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    let that = this;
    console.log(api.CardSave)
    util.request(api.CardSave,{ 
        id: card.id,
        name: card.name,
        phone: card.phone,
        comp: card.comp,
        title: card.title,
        address: card.address,
        other: card.other
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        wx.showModal({
          title: '添加成功',
          content: '将跳转至名片夹',
        })
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        })
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
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
          address: res.address,
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

})