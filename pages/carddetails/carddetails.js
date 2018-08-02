// pages/carddetails/carddetails.js
var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
//获取应用实例
const ctx = wx.createCanvasContext('myCanvas')
var app = getApp()

Page({
  data: {
    showcan: false,
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
  getContent: function (str, l = 30) {
    let len = 0;
    let index = 0;
    let content = [];
    for (let i = 0; i < str.length; i++) {
      // 若未定义则致为 ''
      if (!content[index]) content[index] = '';
      content[index] += str[i]
      // 中文或者数字占两个长度
      if (str.charCodeAt(i) > 127 || (str.charCodeAt(i) >= 48 && str.charCodeAt(i) <= 57)) {
        len += 2;
      } else {
        len++;
      }
      if (len >= l) {
        len = 0;
        index++;
      }
    }
    console.log(content)
    return content
  },
  editCard: function(e) {
    console.log("editcard")
    let that = this;
    var did = this.data.id;
    var dflag = this.data.flag; 
    var editurl = '../editcard/editcard?id=' + did + "&flag=" + dflag;
    console.log(editurl);
    wx.navigateTo({
      url: editurl,
    })

  },
  Drawcard: function (e) {
    console.log("share" + this.data.current)
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })

    this.setData({
      showcan: false
    });
    let show = this.data.showcan;
    let that = this;
    var dname = this.data.name;
    var dtitle = this.data.title;
    var dcomp = this.data.comp;
    var daddress = this.data.address;
    var dphone = this.data.phone;
    var dother = this.data.other;
    console.log(ctx.width);
    var width = 360;
    var headx = 20;
    var heady = 60;
    var line = 23;
    var contentx = 110;
    var contenty = 120;
    var iconsize = 17;
    ctx.setFillStyle('#fff')
    ctx.fillRect(0, 0, 360, 600)
    ctx.drawImage('../../images/infobackground2.png', 0, 0, width, width * 0.12);
    ctx.setFillStyle('#212121') //文字颜色：默认黑色
    ctx.setFontSize(20) //设置字体大小，默认10
    ctx.fillText(dname, headx, heady) //绘制文本
    ctx.setFillStyle('#757575') //文字颜色：默认黑色
    ctx.setFontSize(14) //设置字体大小，默认10
    heady += 0.8 * line;
    ctx.fillText(dcomp, headx, heady) //绘制文本
    heady += 0.8 * line;
    ctx.fillText(dtitle, headx, heady) //绘制文本
    var c = [];
    if (dphone != "") {
      ctx.drawImage('../../images/call.png', contentx, contenty, iconsize, iconsize);
      contentx = contentx + iconsize + 5;
      contenty = contenty + iconsize - 3;
      ctx.fillText(dphone, contentx, contenty) //绘制文本
      contentx = contentx - iconsize - 5;
      contenty = contenty + line - iconsize - 3;
    }
    if (daddress != "") {
      c = this.getContent(daddress);
      if (c.length <= 1) {
        ctx.drawImage('../../images/position.png', contentx, contenty, iconsize, iconsize);
        contentx = contentx + iconsize + 5;
        contenty = contenty + iconsize - 3;
        ctx.fillText(daddress, contentx, contenty) //绘制文本
        contentx = contentx - iconsize - 5;
        contenty = contenty + line - iconsize - 3;
      } else {
        ctx.drawImage('../../images/position.png', contentx, contenty, iconsize, iconsize);
        contentx = contentx + iconsize + 5;
        contenty = contenty + iconsize - 3;
        ctx.fillText(c[0], contentx, contenty) //绘制文本
        contenty = contenty + line - iconsize;
        for (var i = 1; i < c.length; i++) {
          contenty = contenty + line / 2;
          ctx.fillText(c[i], contentx, contenty) //绘制文本
        }
        contentx = contentx - iconsize - 5;
        contenty = contenty + line - iconsize - 3;
      }
    }
    if (dother != "") {
      c = this.getContent(dother);
      if (c.length <= 1) {
        ctx.drawImage('../../images/information.png', contentx, contenty, iconsize, iconsize);
        contentx = contentx + iconsize + 5;
        contenty = contenty + iconsize - 3;
        ctx.fillText(dother, contentx, contenty) //绘制文本
        contentx = contentx - iconsize - 5;
        contenty = contenty + line - iconsize - 3;
      } else {
        ctx.drawImage('../../images/information.png', contentx, contenty, iconsize, iconsize);
        contentx = contentx + iconsize + 5;
        contenty = contenty + iconsize - 3;
        ctx.fillText(c[0], contentx, contenty) //绘制文本
        contenty = contenty + line - iconsize;
        for (var i = 1; i < c.length; i++) {
          contenty = contenty + line / 2;
          ctx.fillText(c[i], contentx, contenty) //绘制文本
        }
        contentx = contentx - iconsize - 5;
        contenty = contenty + line - iconsize - 3;
      }
    }
    ctx.draw();
    setTimeout(function () {
      console.log("save")
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 360,
        height: contenty + 20,
        canvasId: 'myCanvas',
        success: function (res) {
          console.log(res);
          that.setData({
            shareImage: res.tempFilePath,
            showSharePic: true,
            showcan: false
          })
          wx.hideLoading();
          wx.previewImage({
            urls: [res.tempFilePath],
          })
        },
        fail: function (res) {
          console.log(res)
          that.setData({
            showcan: false
          });
          wx.hideLoading();
        }
      })
    }, 2000);
  },
  Sharecard: function (e) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '生成名片图，长按可保存至手机相册或分享至微信聊天',
      success: function (res) {
        if (res.confirm) {
          that.Drawcard();
        }
      }
    })
  },
  deleteCard: function(e) {
    let that = this;
    var did = this.data.id;
    var dflag = this.data.flag;
    console.log("delete");
    console.log(did);
    console.log(dflag);
    wx.showModal({
      title: '',
      content: '确定要删除名片？',
      success: function(res) {
        if (res.confirm) {
          console.log("user confirm")
          if (dflag == 0) {
            console.log("0 start post");
            console.log(api.MyCardDelete);
            console.log(did);
            util.request(api.MyCardDelete, {
              id: did
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1]; //当前页面
                var prevPage = pages[pages.length - 2]; //上一个页面
                var cur = prevPage.data.current;
                var len = prevPage.data.len;
                console.log("prevPage.data.current")
                console.log(prevPage.data.current)
                console.log("prevPage.data.len")
                console.log(prevPage.data.len)
                prevPage.setData({
                  current: 0,
                });
                wx.showModal({
                  title: '删除成功',
                  content: '将跳转至我的名片',
                  success:function(res){
                    console.log(res);
                    wx.switchTab({
                      url: '/pages/mycard/mycard',
                    })
                  }
                })

              }
            });
          } else {
            util.request(api.CardDelete, {
              id: did
            }, 'POST').then(function(res) {
              if (res.errno === 0) {
                wx.showModal({
                  title: '删除成功',
                  content: '将跳转至名片夹',
                })
                wx.switchTab({
                  url: '/pages/cardcase/cardcase',
                })
              }
            });
          }
        }
      }
    })
    return false;
  },



  //打开地图
  openAddress: function(e) {
    wx.getLocation({
      //返回可以用于wx.openLocation的经纬度
      success: function(res) {
        var latitude = parseFloat(e.target.dataset.loglat.split(",")[0])
        var longitude = parseFloat(e.target.dataset.loglat.split(",")[1])
        wx.openLocation({
          latitude: latitude,
          longitude: longitude,
          name: e.target.dataset.name,
          address: e.target.dataset.name,
          scale: 28,
          complete: function(res) {}
        })
      }
    })
  },
  onShareAppMessage: function() {
    var that = this
    return {
      title: '您好,这是我的名片,请惠存。',
      path: 'pages/carddetails/carddetails?id=' + that.data.cardDetails.data.id + '&share=1',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },
  countdown: function(that) {
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
    timer = setTimeout(function() {
      that.setData({
        econds: second - 1,
        isviewImage: false
      });
      that.countdown(that);
    }, 1000)
  },
  //获取二维码地址
  getCode: function(e) {
    var that = this
    that.setData({
      'GetCardQRCode.data.id': e.currentTarget.dataset.id
    })
    app.postData(that.data.GetCardQRCode, function(res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(),
        urls: [res.data + '?' + Math.random()],
        success: function() {
          that.countdown(that);
        }
      })
    })
  },
  //删除单张名片
  removeCard: function(e) {
    var data = {
      'url': api.MyCardDelete,
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    })
  },






  //设置单张默认名片
  setCardDefault: function(e) {
    var that = this
    var data = {
      'url': 'Card/SetCardDefault',
      'data': {
        'id': e.target.dataset.id
      }
    }
    app.postData(data, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          app.postData(that.data.cardDetails, function(res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //打开我的名片
  openMycard: function() {
    wx.switchTab({
      url: '../mycard/mycard'
    })
  },
  //移除收藏的名片
  undockCard: function(e) {
    var that = this
    that.setData({
      'removeCollCard.data.id': e.target.dataset.id
    })
    app.postData(that.data.removeCollCard, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          app.postData(that.data.othersCardDetails, function(res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹
  addCard: function(e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          // wx.switchTab({
          //   url: '../mycard/mycard'
          // })
          app.postData(that.data.othersCardDetails, function(res) {
            that.setData({
              cardDetailsData: res.data
            })
          })
        }
      })
    })
  },
  //收藏他人名片夹 并且打开名片小程序
  addCardOpen: function(e) {
    var that = this
    that.setData({
      'collCardData.data.id': e.target.dataset.id
    })
    app.postData(that.data.collCardData, function(res) {
      wx.showToast({
        title: res.msg,
        icon: 'success',
        duration: 2000,
        complete: function() {
          wx.switchTab({
            url: '../cardcase/cardcase'
          })
        }
      })
    })
  },
  openShare: function(e) {
    var that = this
    that.setData({
      'CardShareData.data.id': e.target.dataset.id
    })
    app.postData(that.data.CardShareData, function(res) {
      wx.previewImage({
        current: res.data + '?' + Math.random(), // 当前显示图片的http链接
        urls: [res.data + '?' + Math.random()] // 需要预览的图片http链接列表
      })
      that.setData({
        isviewImage: true
      })
    })
  },
  onLoad: function(options) {
    console.log(options);
    this.setData({
      id: options.id
    });
    this.setData({
      flag: options.flag
    });
    let that = this;
    if (options.flag == 0) {
      console.log("this.data.flag=0");
      util.request(api.MyCardDetail, {
        id: options.id
      }).then(function(res) {

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
      }).then(function(res) {
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
        } else(console.log(res.errmsg))
      });

    }
    console.log("onload complete");
    console.log(that.data.comp);
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {},
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})