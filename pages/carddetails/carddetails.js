// pages/carddetails/carddetails.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
//获取应用实例
var app = getApp()

Page({
  data: {
    flag: 0,
    id: 0,
    name: '',
    comp: '',
    phone: '',
    title: '',
    address: '',
    other: '',
    avatarUrl: 'http://yanxuan.nosdn.127.net/8945ae63d940cc42406c3f67019c5cb6.png',
  },

  deleteCard:function(e){
    let that = this;
    var did = this.data.id;
    var dflag = this.data.flag;
    console.log("delete");
    console.log(did);
    console.log(dflag);
    wx.showModal({
      title: '',
      content: '确定要删除名片？',
      success: function (res) {
        if (res.confirm) {
          console.log("user confirm")
          if (dflag == 0) {
            console.log("0 start post");
            console.log(api.MyCardDelete);
            console.log(did);
            util.request(api.MyCardDelete, { id: did }, 'POST').then(function (res) {
              console.log(res);
              if (res.errno === 0) {
                console.log(res.errno)
                that.setData({
                  name: '',
                  comp: '',
                  phone: '',
                  title: '',
                  address: '',
                  other: '',
                });
                wx.navigateTo({
                  url: '../../mycard/mycard',
                })
              }
            });
          } else {
            util.request(api.CardDelete, { id: this.data.id }, 'POST').then(function (res) {
              if (res.errno === 0) {
                wx.navigateTo({
                  url: 'pages/cardcase/cardcase',
                })
              }
            });
          }
          console.log('用户点击确定')
        }
      }
    })
    return false;
  },



  //打开地图
  openAddress: function (e) {
    wx.getLocation({
      //返回可以用于wx.openLocation的经纬度
      success: function (res) {
        var latitude = parseFloat(e.target.dataset.loglat.split(",")[0])
        var longitude = parseFloat(e.target.dataset.loglat.split(",")[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: e.target.dataset.name,
          address: e.target.dataset.name,
          scale: 28,
          complete: function (res) {
          }
        })
      }
    })
  },
  onShareAppMessage: function () {
    var that = this
    return {
      title: '您好,这是我的名片,请惠存。',
      path: 'pages/carddetails/carddetails?id=' + that.data.cardDetails.data.id + '&share=1',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  //拨打电话
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  countdown: function (that) {
    var second = that.data.econds
    var timer
    if (second == 0) {
      clearTimeout(timer);
      that.setData({
        econds: 3,
        isviewImage: true
      });
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        econds: second - 1,
        isviewImage: false
      });
      that.countdown(that);
    }, 1000)
  },
  //获取二维码地址
  getCode: function (e) {
    var that = this
    that.setData({
      'GetCardQRCode.data.id': e.currentTarget.dataset.id
    })
    app.postData(that.data.GetCardQRCode, function (res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(),
        urls: [res.data + '?' + Math.random()],
        success: function () {
          that.countdown(that);
        }
      })
    })
  },
  //删除单张名片
  removeCard: function (e) {
    var data = {
      'url': api.MyCardDelete,
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },
  //编辑单张名片
  editCard: function (e) {
    wx.navigateTo({
      url: '../createmycard/createmycard?id=' + e.target.dataset.id
    })
  },
  //设置单张默认名片
  setCardDefault: function (e) {
    var that = this
    var data = {
      'url': 'Card/SetCardDefault',
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          app.postData(that.data.cardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //打开我的名片
  openMycard: function () {
    wx.switchTab({
      url: '../mycard/mycard'
    })
  },
  //移除收藏的名片
  undockCard: function (e) {
    var that = this
    that.setData({
      'removeCollCard.data.id': e.target.dataset.id
    })
    app.postData(that.data.removeCollCard, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          app.postData(that.data.othersCardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹
  addCard: function (e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          // wx.switchTab({
          //   url: '../mycard/mycard'
          // })
          app.postData(that.data.othersCardDetails, function (res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹 并且打开名片小程序
  addCardOpen: function (e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function (res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function () {
          wx.switchTab({
            url: '../cardcase/cardcase'
          })
        }
      })
    })
  },
  openShare: function (e) {
    var that = this
    that.setData({
      'CardShareData.data.id': e.target.dataset.id
    })
    app.postData(that.data.CardShareData, function (res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(), // 当前显示图片的http链接
        urls: [res.data + '?' + Math.random()] // 需要预览的图片http链接列表
      })
      that.setData({
        isviewImage: true
      })
    })
  },
  onLoad: function (options) {
    console.log(options);
    this.setData({ id: options.id });
    this.setData({ flag: options.flag });
    console.log(this.data.id);
    console.log(this.data.flag);
    let that = this;
    if (options.flag == 0) {
      console.log("this.data.flag=0");
      util.request(api.MyCardDetail, { id: options.id }).then(function (res) {

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
        }
      });
    } else {
      util.request(api.CardDetail, { id: option.id }).then(function (res) {
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
    console.log("onload complete");
    console.log(that.data.comp);
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})