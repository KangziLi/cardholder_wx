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
      tempid: 0,
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
    let that = this;
    let card = this.data.card;
    let sflag = this.data.flag;
    let sid = this.data.id;
    if (sid == 0) {
      //本地数据
      console.log("sid=0")
      if(sflag==0){
        //我的名片编辑
        console.log("sflag=0")
        var myCard_temp=wx.getStorageSync("myCard_temp");
        for(var i=0;i<myCard_temp.length;i++){
          console.log("myCard_temp[i].tempid" + myCard_temp[i].tempid)
          console.log("card.tempid" + card.tempid)
          if(myCard_temp[i].tempid==card.tempid)
          {
            myCard_temp[i].name=card.name;
            myCard_temp[i].title = card.title;
            myCard_temp[i].address = card.address;
            myCard_temp[i].phone = card.phone;
            myCard_temp[i].comp = card.comp;
            myCard_temp[i].other = card.other;
            break;
          }
        }
        console.log(myCard_temp);
        wx.setStorage({
          key: "myCard_temp",
          data: myCard_temp,
        })
        wx.showToast({
          title: '添加成功',
        })
        wx.switchTab({
          url: '/pages/mycard/mycard',
        })
      }else{
        console.log("sflag=1")
        var Card_temp = wx.getStorageSync("Card_temp");
        for (var i = 0; i < Card_temp.length; i++) {
          console.log("Card_temp[i].tempid" + Card_temp[i].tempid)
          console.log("card.tempid" + card.tempid)
          if (Card_temp[i].tempid == card.tempid) {
            Card_temp[i].name = card.name;
            Card_temp[i].title = card.title;
            Card_temp[i].address = card.address;
            Card_temp[i].phone = card.phone;
            Card_temp[i].comp = card.comp;
            Card_temp[i].other = card.other;
            break;
          }
        }
        wx.setStorage({
          key: "Card_temp",
          data: Card_temp,
        })
        wx.showToast({
          title: '添加成功',
        })
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        })
      }
    } else {
      if (sflag == 0) {
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
              title: '保存成功',
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
      }
    }
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: options.id,
      flag: options.flag,
    });
    let that = this;
    let card = this.data.card;
    card.tempid = options.tempid;
    card.name = options.name;
    card.comp = options.comp;
    card.phone = options.phone;
    card.title = options.title;
    card.address = options.address;
    card.other = options.other;
    that.setData({
      card: card
    });
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

})