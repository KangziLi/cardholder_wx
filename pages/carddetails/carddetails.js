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
    id: 0,
    tempid: 0,
    name: '',
    comp: '',
    phone: '',
    title: '',
    address: '',
    other: '',
    avatarUrl: '../../images/man2.png',
  },
  addcontact: function () {
    let that = this;
    wx.addPhoneContact({
      firstName: that.data.name,
      mobilePhoneNumber: that.data.phone,
      title: that.data.title,
      organization: that.data.comp,
      workAddressStreet: that.data.address,
      remark: that.data.other,
      success: function () {
        wx.showToast({
          title: '添加成功',
        })
        wx.switchTab({
          url: '/pages/cardcase/cardcase',
        });
      }
    })
  },
  //分割长字符串，用于绘制名片图片
  getContent: function(str, l = 30) {
    console.log("carddetails.js getcontent")
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

  //设置二维码信息串
  infoToQrcode: function() {
    console.log("carddetails.js infoToQrcode")
    var str = "MECARD:TEL:" + this.data.phone + ";N:" + this.data.name + ";ORG:" + this.data.comp + ";TIL:" + this.data.title + ";ADR:" + this.data.address + ";NOTE:" + this.data.other;
    this.setData({
      qrcode: str
    })
  },

  //跳转至编辑页面
  editCard: function(e) {
    console.log("carddetails.js editcard")
    let that = this;
    var did = this.data.id;
    var dtempid = this.data.tempid;
    var dflag = this.data.flag;
    var dname = this.data.name;
    var dtitle = this.data.title;
    var dcomp = this.data.comp;
    var daddress = this.data.address;
    var dphone = this.data.phone;
    var dother = this.data.other;
    var editurl = '/pages/editcard/editcard?id=' + did + "&tempid=" + dtempid + "&flag=" + dflag + "&name=" + dname + '&title=' + dtitle + '&comp=' + dcomp + '&address=' + daddress + '&phone=' + dphone + '&other=' + dother;
    console.log(editurl);
    wx.navigateTo({
      url: editurl,
    });
  },

  //绘制名片
  Drawcard: function(e) {
    console.log("carddetails.js Drawcard")
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    });
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
    setTimeout(function() {
      console.log("save")
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 360,
        height: contenty + 20,
        canvasId: 'myCanvas',
        success: function(res) {
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
        fail: function(res) {
          console.log(res)
          that.setData({
            showcan: false
          });
          wx.hideLoading();
        }
      })
    }, 2000);
  },

  //生成名片图
  Sharecard: function(e) {
    console.log("carddetails.js Sharecard")
    let that = this;
    wx.showModal({
      title: '提示',
      content: '生成名片图，长按可保存至手机相册或分享至微信聊天',
      success: function(res) {
        if (res.confirm) {
          that.Drawcard();
        }
      }
    })
  },

  //删除名片
  deleteCard: function(e) {
    let that = this;
    var did = this.data.id;
    var dtempid=this.data.tempid;
    var dflag = this.data.flag;
    console.log("delete");
    console.log(did);
    console.log(dflag);
    wx.showModal({
      title: '',
      content: '确定要删除名片？',
      success: function(res) {
        if (res.confirm) {
          if (did == 0) {
            //删除名片为本地名片
            if (dflag == 0) {
              //删除名片为个人名片
              console.log("dflag=0")
              var myCard_temp = wx.getStorageSync("myCard_temp");
              for (var i = 0; i < myCard_temp.length; i++) {
                console.log("myCard_temp[i].tempid" + myCard_temp[i].tempid)
                if (myCard_temp[i].tempid == dtempid) {
                  myCard_temp.splice(i,1);
                  break;
                }
              }
              console.log(myCard_temp);
              wx.setStorage({
                key: "myCard_temp",
                data: myCard_temp,
              })
              wx.showToast({
                title: '删除成功',
              })
              wx.switchTab({
                url: '/pages/mycard/mycard',
              })
            } else {
               //删除名片为名片夹名片
              var Card_temp = wx.getStorageSync("Card_temp");
              for (var i = 0; i < Card_temp.length; i++) {
                if (Card_temp[i].tempid == dtempid) {
                  Card_temp.splice(i, 1);
                  break;
                }
              }
              wx.setStorage({
                key: "Card_temp",
                data: Card_temp,
              })
              wx.showToast({
                title: '删除成功',
              })
              wx.switchTab({
                url: '/pages/cardcase/cardcase',
              })
            }

          } else {
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
                    success: function(res) {
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

  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id //仅为示例，并非真实的电话号码
    })
  },

  //获取临时缓存照片路径，存入data中
  canvasToTempImage: function() {
    var that = this;
    var tempFilePath = '';
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function(res) {
        tempFilePath = res.tempFilePath;
        that.setData({
          imagePath: tempFilePath,
        });
        wx.previewImage({
          urls: [res.tempFilePath],
        })
      },
      fail: function(res) {
        console.log(res);
      }
    });
  },

  //适配不同屏幕大小的canvas
  setCanvasSize: function() {
    var size = {};
    try {
      var res = wx.getSystemInfoSync();
      var scale = 750 / 686; //不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width; //canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
      console.log("获取设备信息失败" + e);
    }
    return size;
  },

  //点击图片进行预览，长按保存分享图片
  previewImg: function(e) {
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  //生成qr图
  qrcode: function() {
    this.infoToQrcode()
    this.setData({
      canvasHidden: false
    })
    var size = this.setCanvasSize(); //动态设置画布大小
    QR.api.draw(this.data.qrcode, "mycanvas", size.w, size.h);
    this.canvasToTempImage();
    this.setData({
      canvasHidden: true
    })
  },

  //分享名片
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
    if (this.data.flag == 0) {
      var title = '您好，我是' + dname + '，这是我的名片，请惠存';
    } else {
      var title = '我向您转发了关于' + dname + '的名片信息';
    }
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
      tempid: options.tempid,
      flag: options.flag,
      name: options.name,
      comp: options.comp,
      phone: options.phone,
      title: options.title,
      address: options.address,
      other: options.other,
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
  onShow: function() {},
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})