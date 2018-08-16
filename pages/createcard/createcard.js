// pages/createcard/createcard.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var check = require('../../utils/check.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    card: {
      tempid: 0,
      id: 0,
      name: '',
      comp: '',
      phone: '',
      title: '',
      address: '',
      other: '',
    },
    cardId: 0,
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
    this.setData({
      card: card
    });
  },
  //选择图像进行识别
  bindChooseImg(e) {
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['compressed'],
      success: function(res) {
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
      success: function(res) {
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
        success: function(res) {
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

  savecontact() {
    let that = this;
    var card = this.data.card;
    console.log(card)
    wx.addPhoneContact({
      firstName: that.data.card.name,
      mobilePhoneNumber: that.data.card.phone,
      title: that.data.card.title,
      organization: that.data.card.comp,
      workAddressStreet: that.data.card.address,
      remark: that.data.card.other,
      success: function() {
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        });
      },
      fail:function(){
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        });
      }
    })
  },

  //清除页面信息
  cleandata() {
    let that = this;
    var card = this.data.card;
    card.id = 0;
    card.name = '';
    card.comp = '';
    card.phone = '';
    card.title = '';
    card.address = '';
    card.other = '';
    that.setData({
      card: card
    });
  },

  //保存名片信息
  savecard() {
    var that = this;
    var card = this.data.card;
    console.log(app.globalData.hasLogin)
    if (app.globalData.haslogin) {
      util.request(api.CardSave, {
        id: card.id,
        name: card.name,
        phone: card.phone,
        comp: card.comp,
        title: card.title,
        address: card.address,
        other: card.other
      }, 'POST').then(function(res) {
        if (res.errno === 0) {
          wx.showModal({
            title: '添加成功',
            content: '是否加入手机通讯录',
            success: function(res) {
              if (res.confirm) {
                that.savecontact()
                that.cleandata()
              } else {
                that.cleandata()
                wx.switchTab({
                  url: '/pages/cardcase/cardcase',
                });
              }
            }
          })
        }
      });
    } else {
      //未登录 本地存储
      var temp = [];
      temp.push(card);
      wx.getStorage({
        key: 'Card_temp',
        success: function (res) {
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
          wx.showModal({
            title: '添加成功',
            content: '是否加入手机通讯录',
            success: function (res) {
              if (res.confirm) {
                that.savecontact()
                that.cleandata()
              } else {
                that.cleandata()
                wx.switchTab({
                  url: '/pages/cardcase/cardcase',
                });
              }
            }
          })
        },
        fail: function (res) {
          //本地无缓存数据
          wx.setStorage({
            key: 'Card_temp',
            data: temp,
          })
          wx.showModal({
            title: '添加成功',
            content: '是否加入手机通讯录',
            success: function (res) {
              if (res.confirm) {
                that.savecontact()
                that.cleandata()
              } else {
                that.cleandata();
                wx.switchTab({
                  url: '/pages/cardcase/cardcase',
                });
              }
            }
          })
        },
      })
    }
  },

  //打开地图进行选择
  openAddress: function() {
    var that = this
    let card = that.data.card;
    wx.chooseLocation({
      success: function(res) {
        card.address = res.address;
        that.setData({
          card: card
        });
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
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

})