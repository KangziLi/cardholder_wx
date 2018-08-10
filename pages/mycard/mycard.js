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
      nickName: '登录同步云端数据',
      avatarUrl: '../../images/backup.png'
    },
    did: 0,
    dtempid: 0,
    dname: "",
    dtitle: "",
    dcomp: "",
    daddress: "",
    dphone: "",
    dother: "",
    showcan: false,
    current: 0,
    len: 0
  },

  //获取我的名片数据
  getmyCardData: function() {
    console.log("mycard.js getmyCardData 获取我的名片数据");
    var that = this;
    util.request(api.MyCardList).then(function(res) {
      console.log("我的名片数据");
      console.log(res);
      if (res.errno === 0) {
        that.setData({
          myCardData: res.data,
          len: res.data.length,
        })
        wx.setStorage({
          key: 'myCard',
          data: res.data,
        })
      };
    })
  },

  //跳转至个人名片创建
  openCreatecard: function() {
    console.log("mycard.js openCreatecard 跳转至个人名片创建");
    wx.navigateTo({
      url: '../createmycard/createmycard'
    })
  },

  //长字符分割
  getContent: function(str, l = 30) {
    console.log("mycard.js getContent 长字符分割");
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

  //绘制名片图片
  Drawcard: function(e) {
    console.log("mycard.js Drawcard 绘制名片图片");
    wx.showLoading({
      title: '正在生成图片',
      mask: true,
    })
    this.setData({
      showcan: false
    });
    let show = this.data.showcan;
    let that = this;
    var cur = this.data.current;
    var dname = this.data.myCardData[cur].name;
    var dtitle = this.data.myCardData[cur].title;
    var dcomp = this.data.myCardData[cur].comp;
    var daddress = this.data.myCardData[cur].address;
    var dphone = this.data.myCardData[cur].phone;
    var dother = this.data.myCardData[cur].other;
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

  //生成分享信息
  onShareAppMessage: function() {
    if (this.data.myCardData.length==0){
      wx.showModal({
        title: '提示',
        content: '您还未创建个人名片，请先填写您的名片信息',
        success:function(res){
            wx.navigateTo({
              url: '../createmycard/createmycard'
            })
        }
      })
    }
    console.log("mycard.js  onShareAppMessage 生成分享信息");
    let that = this;
    var cur = this.data.current;
    var did = this.data.myCardData[cur].id;
    var dtempid = this.data.myCardData[cur].tempid;
    var dname = this.data.myCardData[cur].name;
    var dtitle = this.data.myCardData[cur].title;
    var dcomp = this.data.myCardData[cur].comp;
    var daddress = this.data.myCardData[cur].address;
    var dphone = this.data.myCardData[cur].phone;
    var dother = this.data.myCardData[cur].other;
    var path = '/pages/sharecard/sharecard?id=' + did + "&flag=0&name=" + dname + '&title=' + dtitle + '&comp=' + dcomp + '&address=' + daddress + '&phone=' + dphone + '&other=' + dother;
    var title = '您好，我是' + dname + '，这是我的名片，请惠存';
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

  //监听名片切换事件
  bindChange: function(e) {
    this.setData({
      current: e.detail.current
    });
  },

  //生成名片图片
  Sharecard: function(e) {
    console.log("mycard.js Sharecard 生成名片图片");
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

  //退出登陆
  exitLogin: function() {
    console.log("mycard.js exitLogin 退出登录");
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
        }
      }
    })
  },

  //进入登录页面
  goLogin() {
    console.log("mycard.js goLogin 进入登录页面");
    console.log("app.globalData.hasLogin=" + app.globalData.hasLogin);
    if (!app.globalData.hasLogin) {
      wx.navigateTo({
        url: "/pages/auth/login/login"
      });
    } else {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
      wx.showModal({
        title: '',
        content: '用户已登录',
      })
    }
  },

  onLoad: function(options) {
    //检测是否登陆
    user.checkLogin().then(res => {
      console.log("this.globalData.hasLogin = true")
      app.globalData.hasLogin = true;
    }).catch(() => {
      console.log("this.globalData.hasLogin = false")
      app.globalData.hasLogin = false;
    });
    // 页面初始化 options为页面跳转所带来的参数
    console.log("user.js onload")
    console.log("app.globalData.hasLogin=" + app.globalData.hasLogin);
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
    }
  },
  onReady: function() {
    console.log("user.js onready")
    console.log(app.globalData.hasLogin)
    // 页面渲染完成
  },
  onShow: function() {
    console.log("user.js onshow")
    //页面显示
    //获取用户的登录信息
    this.setData({
      current: 0
    })
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
      //上传本地缓存
      wx.getStorage({
        key: 'myCard_temp',
        success: function(res) {
          let temp = res.data;
          for (var i = 0; i < temp.length; i++) {
            util.request(api.MyCardSave, temp[i], 'POST').then(function(res) {
              console.log(res);
            });
          }
          wx.setStorage({
            key: 'myCard_temp',
            data: [],
          })
        }
      });
      this.getmyCardData();
    } else {
      //未登录获取本地数据
      let temp = wx.getStorageSync('myCard_temp');
      this.setData({
        myCardData: temp
      })
    }
    var length = this.data.myCardData.length;
    this.setData({
      len: length
    })
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})