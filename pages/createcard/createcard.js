// pages/createcard/createcard.js
//获取应用实例
var app = getApp()

Page({
  data: {
    iseng: false,
    ischinese: true,
    isen: false,
    cardData: {
      "url": "",
      'data': {
        'id': '',
        'name': '',
        'title': '',
        'mobile': '',
        'companyName': '',
        'more': '',
        'avatarUrl': '', //头像地址
        'isDefault': false,
        'address': '',
        'loglat': '',
        'language': ''
      }
    },
  },
  //数据设置
  cardDataName: function(e) {
    this.setData({
      'cardData.data.name': e.detail.value
    })
  },
  cardDataTitle: function(e) {
    this.setData({
      'cardData.data.title': e.detail.value
    })
  },
  cardDataMobile: function(e) {
    this.setData({
      'cardData.data.mobile': e.detail.value
    })
  },
  cardDataCompanyName: function(e) {
    this.setData({
      'cardData.data.companyName': e.detail.value
    })
  },
  cardDataMore: function(e) {
    this.setData({
      'cardData.data.more': e.detail.value
    })
  },
  cardDataEmail: function(e) {
    this.setData({
      'cardData.data.email': e.detail.value
    })
  },

  //选择图像进行识别
  bindChooseImg(e) {
    let scanner = this.cardScanner
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        //未写接口
        scanner.onImageChanged && scanner.onImageChanged(res.tempFilePaths[0])
        scanner.setImage(res.tempFilePaths[0])
      },
      fail(e) {
        console.error(e)
      }
    })
  },


  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
    if (options.id === "0") {
      that.setData({
        iseng: true,
        'cardData.data.id': '',
        'cardData.data.mobile': wx.getStorageSync('loginSuccessData').mobile,
        'cardData.data.avatarUrl': wx.getStorageSync('userInfo').avatarUrl,
        'cardData.data.name': wx.getStorageSync('userInfo').nickName,
      })
      wx.setNavigationBarTitle({
        title: '创建名片'
      })
    } else {
      that.setData({
        'cardData.data.id': options.id,
        'cardData.data.mobile': wx.getStorageSync('loginSuccessData').mobile,
        'cardData.data.avatarUrl': wx.getStorageSync('userInfo').avatarUrl,
        'cardData.data.name': wx.getStorageSync('userInfo').nickName,
      })
      wx.setNavigationBarTitle({
        title: '编辑名片'
      })

      //设置编辑卡片编号
      var editDataCard = {
        'url': 'Card/GetCard',
        'data': {
          'id': options.id
        }
      }

      //提交编辑请求
      app.postData(editDataCard, function(res) {
        that.setData({
          'cardData.data': res.data,
        })
        return
      })
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

  openAddress: function() {
    var that = this
    wx.chooseLocation({
      success: function(res) {
        that.setData({
          'cardData.data.address': res.address,
          'cardData.data.loglat': res.latitude + ',' + res.longitude
        })
        that.setData({
          'enCardData.data.address': res.address,
          'enCardData.data.loglat': res.latitude + ',' + res.longitude
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },

  formSubmit: function(e) {
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

      app.postData(data, function(res) {
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

  formReset: function() {
    console.log('form发生了reset事件')
  }
})