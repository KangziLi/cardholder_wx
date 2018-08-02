
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var check = require('../../utils/check.js');
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
    flag: 0,
    id: 0,
    imageSrc: "",
  },
  bindinputName(e) {
    let card = this.data.card;
    card.name = e.detail.value;
    this.setData({
      card: card
    });
  },
  bindinputTitle(e) {
    let card = this.data.card;
    card.title = e.detail.value;
    this.setData({
      card: card
    });
  },
  bindinputMobile(e) {
    let card = this.data.card;
    card.phone = e.detail.value;
    this.setData({
      card: card
    });
  },
  bindinputCompany(e) {
    let card = this.data.card;
    card.comp = e.detail.value;
    this.setData({
      card: card
    });
  },
  bindinputOther(e) {
    let card = this.data.card;
    card.other = e.detail.value;
    this.setData({
      card: card
    });
  },
  bindinputAddress(e) {
    let card = this.data.card;
    card.address = e.detail.value;
    this.setData({ card: card });
  },
  //选择图像进行识别
  bindChooseImg(e) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['compressed'],
      success: function (res) {
        console.log(res.tempFilePaths[0])
        wx.navigateTo({
          url: '../cardscanner/cardscanner?path=' + res.tempFilePaths[0] + "&flag=1",
        })
      },
    })
  },
  bindCamera(e) {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['camera'],
      success: function (res) {
        console.log(res.tempFilePaths[0])
        wx.navigateTo({
          url: '../cardscanner/cardscanner?path=' + res.tempFilePaths[0] + "&flag=1",
        })
      },
    })
  },

  savecardcheck() {
    let that = this;
    let card = this.data.card;
    if (card.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }

    if (!check.isValidPhone(card.phone) && card.phone != "") {
      wx.showModal({
        title: '提示',
        content: '输入无效手机号,请进行检查，若为特殊号码，请点击忽略',
        cancelText: "忽略",
        success: function (res) {
          console.log(res)
          if (!res.confirm) {
            that.savecard();
          }
        }
      })
    } else {
      that.savecard();
    }
  },

  savecard() {
    let card = this.data.card;
    let that = this;
    let sflag = this.data.flag;
    let sid = this.data.id;
    if (sflag==0) {
      console.log("sflag=0save");
      util.request(api.MyCardSave, {
        id: sid,
        name: card.name,
        phone: card.phone,
        comp: card.comp,
        title: card.title,
        address: card.address,
        other: card.other
      }, 'POST').then(function(res) {
        console.log(res);
        if (res.errno === 0) {
          wx.showModal({
            title: '添加成功',
            content: '将跳转至我的名片',
          })
          wx.switchTab({
            url: '/pages/mycard/mycard',
          })
        }
      });
    } else {
      util.request(api.CardSave, {
        id: sid,
        name: card.name,
        phone: card.phone,
        comp: card.comp,
        title: card.title,
        address: card.address,
        other: card.other
      }, 'POST').then(function(res) {
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
    }
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id
    });
    this.setData({
      flag: options.flag
    });
    console.log("id=");
    console.log(this.data.id);
    console.log("flag=");
    console.log(this.data.flag);
    let that = this;
    let card = this.data.card;
    if (options.flag == 0) {
      util.request(api.MyCardDetail, {
        id: options.id
      }).then(function(res) {
        console.log(res);
        if (res.errno === 0) {
          card.name = res.data.name;
          card.comp = res.data.comp;
          card.phone = res.data.phone;
          card.title = res.data.title;
          card.address = res.data.address;
          card.other = res.data.other;
          that.setData({
            card: card
          });
        }
      });
    } else {
      util.request(api.CardDetail, {
        id: options.id
      }).then(function(res) {
        console.log(res);
        if (res.errno === 0) {
          card.name = res.data.name;
          card.comp = res.data.comp;
          card.phone = res.data.phone;
          card.title = res.data.title;
          card.address = res.data.address;
          card.other = res.data.other;
          that.setData({
            card: card
          });
        } else(console.log(res.errmsg))
      });
    }
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
  },

  openAddress: function () {
    var that = this
    let card = that.data.card;
    wx.chooseLocation({
      success: function (res) {
        card.address = res.address;
        that.setData({
          card: card
        });
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