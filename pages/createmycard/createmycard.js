// pages/createcard/createcard.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var check = require('../../utils/check.js');

//获取应用实例
var app = getApp()

Page({
  data: {
    mycard: {
      id: 0,
      tempid: 0,
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

  openAddress: function() {
    var that = this
    let mycard = that.data.mycard;
    wx.chooseLocation({
      success: function(res) {
        console.log(mycard);
        console.log(res.address);
        mycard.address = res.address;
        that.setData({
          mycard: mycard
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

  bindinputName(e) {
    let mycard = this.data.mycard;
    mycard.name = e.detail.value;
    this.setData({
      mycard: mycard
    });
  },
  bindinputTitle(e) {
    let mycard = this.data.mycard;
    mycard.title = e.detail.value;
    this.setData({
      mycard: mycard
    });
  },
  bindinputMobile(e) {
    let mycard = this.data.mycard;
    mycard.phone = e.detail.value;
    this.setData({
      mycard: mycard
    });
  },
  bindinputCompany(e) {
    let mycard = this.data.mycard;
    mycard.comp = e.detail.value;
    this.setData({
      mycard: mycard
    });
  },
  bindinputOther(e) {
    let mycard = this.data.mycard;
    mycard.other = e.detail.value;
    this.setData({
      mycard: mycard
    });
  },
  bindinputAddress(e) {
    let mycard = this.data.mycard;
    mycard.address = e.detail.value;
    this.setData({
      mycard: mycard
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
          url: '../cardscanner/cardscanner?path=' + res.tempFilePaths[0] + "&flag=0",
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
          url: '../cardscanner/cardscanner?path=' + res.tempFilePaths[0] + "&flag=0",
        })
      },
    })
  },

  savecardcheck() {
    let that = this;
    let mycard = this.data.mycard;
    if (mycard.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    if (!check.isValidPhone(mycard.phone) && mycard.phone != "") {
      wx.showModal({
        title: '提示',
        content: '输入无效手机号,请进行检查，若为特殊号码，请点击忽略',
        cancelText: "忽略",
        success: function(res) {
          console.log(res)
          if (!res.confirm) {
            that.saveMycard();
          }
        }
      })
    } else {
      that.saveMycard();
    }
  },
  saveMycard() {
    let mycard = this.data.mycard;
    let that = this;
    console.log(api.MyCardSave)
    if (app.globalData.hasLogin) {
      //已登录 上传至服务器存储
      util.request(api.MyCardSave, {
        id: mycard.id,
        name: mycard.name,
        phone: mycard.phone,
        comp: mycard.comp,
        title: mycard.title,
        address: mycard.address,
        other: mycard.other
      }, 'POST').then(function(res) {
        console.log(res);
        if (res.errno === 0) {
          wx.showToast({
            title: '添加成功',
          });
          wx.switchTab({
            url: '/pages/mycard/mycard',
          })
        }
      });
    } else {
      //未登录 本地存储
      var temp = [];
      temp.push(mycard);
      wx.getStorage({
        key: 'myCard_temp',
        success: function(res) {
          //已存在本地缓存
          var temp2 = res.data;
          var len = res.data.length-1;
          if (res.data.length!=0){
            temp[0].tempid = temp2[len].tempid + 1;
          }else{
            temp[0].tempid =1;
          }
          wx.setStorage({
            key: 'myCard_temp',
            data: temp2.concat(temp),
          })
          wx.showToast({
            title: '添加成功',
          });
          wx.switchTab({
            url: '/pages/mycard/mycard',
          })
        },
        fail: function(res) {
          //本地无缓存数据
          wx.setStorage({
            key: 'myCard_temp',
            data: temp,
          })
          wx.showToast({
            title: '添加成功',
          });
          wx.switchTab({
            url: '/pages/mycard/mycard',
          })
        },
      })
    }
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    var mycard = this.data.mycard;
    var that=this;
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        mycard.name = res.data.nickName;
        mycard.avatarUrl = res.data.avatarUrl;
        that.setData({
          mycard: mycard
        });
      },
    })
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