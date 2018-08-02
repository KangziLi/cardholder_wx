var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var app = getApp();
const ctx = wx.createCanvasContext('myCanvas')
//本页面接口函数
//getmyCardData() 向服务器查询获取名片数据
//openCreatecard() 跳转至个人名片创建
//exitLogin() 退出登录
//goLogin() 进入登录页面

Page({
  data: {
    myCardData: [],
    userInfo: {
      nickName: '授权登录',
      avatarUrl: '../../images/manwhite.png'
    },
    dname: "",
    dtitle: "",
    dcomp: "",
    daddress: "",
    dphone: "",
    dother: "",
    showcan:false,
    current:0,
    len:0
  },

  //获取我的名片数据
  getmyCardData: function() {
    var that = this;
    var len = 0;
    console.log("getmyCardData");
    util.request(api.MyCardList).then(function(res) {
      console.log(res);
      if (res.errno === 0) {
        that.setData({
          myCardData: res.data,
          len:res.data.length,
        }, () => {
          console.log('赋值成功')
          console.log(that.data.myCardData);
        })
      };
    })
  },

  //跳转至个人名片创建
  openCreatecard: function() {
    var that = this
    wx.navigateTo({
      url: '../createmycard/createmycard'
    })
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

  Drawcard: function(e) {
    console.log("share" + this.data.current)
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })

    this.setData({
      showcan: false
    });
    let show=this.data.showcan;
    let that = this;
    var cur = this.data.current;
    var dname = this.data.myCardData[cur].name;
    var dtitle = this.data.myCardData[cur].title;
    var dcomp = this.data.myCardData[cur].comp;
    var daddress = this.data.myCardData[cur].address;
    var dphone = this.data.myCardData[cur].phone;
    var dother = this.data.myCardData[cur].other;
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

  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    });
    console.log(this.data.current)
  },

  Sharecard: function (e) {
    let that =this;
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
  //退出登陆
  exitLogin: function() {
    let that = this;
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          app.globalData.hasLogin = false;
          wx.navigateTo({
            url: '/pages/auth/login/login',
          });
        }
      }
    })
  },

  //进入登录页面
  goLogin() {
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } else {
      wx.showModal({
        title: '',
        content: '用户已登录',
      })
    }
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    let userInfo = wx.getStorageSync('userInfo');
    this.setData({
      userInfo: userInfo,
    });
  console.log("onload")
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    //获取用户的登录信息
    this.setData({
      current:0
    })
    this.getmyCardData();
    var length = this.data.myCardData.length;
    this.setData({
      len:length
    })
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
    }

  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})