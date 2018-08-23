var api = require('../../utils/api.js');
var util = require('../../utils/util.js');
var user = require('../../utils/user.js');
var wxSortPickerView = require('../wxSortPickerView/wxSortPickerView.js');
var app = getApp();

Page({
  data: {
    focus: false,
    CardData: [],
    keyword: "",
  },

  //获取我的名片数据
  getCardData: function() {
    //获取我的名片数据
    let that = this;
    util.request(api.CardList).then(function(res) {
      if (res.errno === 0) {
        that.setData({
          CardData: res.data,
        });
        wx.setStorage({
          key: 'Card',
          data: res.data,
        })
        wxSortPickerView.init(that.data.CardData, that)
      };
    })
  },

  //获取搜索数据
  getSearchData: function(e) {
    let k = e.detail.value;
    this.setData({
      keyword: k
    });
    console.log(this.data.keyword);
  },

  //清空搜索框
  clearKeyword: function(e) {
    this.setData({
      keyword: ""
    });
    this.getCardData();
  },

  //获取搜索结果
  getSearch: function(e) {
    let that = this;
    if (this.data.keyword != "") {
      util.request(api.CardSearch, {
        keyword: this.data.keyword
      }).then(function(res) {
        if (res.errno === 0) {
          that.setData({
            CardData: res.data,
          });
          wxSortPickerView.init(that.data.CardData, that)
        };
      })
    } else {
      this.getCardData()
    }

  },

  //拨打电话
  phoneCall: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.id
    })
  },

  onLoad: function() {
    this.onShow();
  },
  onShow: function() {
    if (app.globalData.hasLogin) {
      let userInfo = wx.getStorageSync('userInfo');
      this.setData({
        userInfo: userInfo,
      });
      //上传本地缓存
      wx.getStorage({
        key: 'Card_temp',
        success: function(res) {
          let temp = res.data;
          for (var i = 0; i < temp.length; i++) {
            util.request(api.CardSave, temp[i], 'POST').then(function(res) {
              console.log(res);
            });
          }
          wx.setStorage({
            key: 'Card_temp',
            data: [],
          })
        }
      });

      this.getCardData();
    } else {
      //未登录获取本地数据
      let temp = wx.getStorageSync('Card_temp');
      this.setData({
        CardData: temp
      })
      wxSortPickerView.init(this.data.CardData, this)
    }
  },
  canvasIdErrorCallback: function(e) {
    console.error(e.detail.errMsg)
  },
})