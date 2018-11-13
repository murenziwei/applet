// pages/dan/tuaninfo.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/groupleaderindex/token/' + token,
      method: 'get',
      success: function (res) {
        if(res.data.code == 0)
        {
          console.log(res.data.data.three_tuanyuan_count);
          that.setData({
            user_info: res.data.data
          });
        }
      }
    })

  },
  go_wingoods:function(){
    var link = '/pages/dan/tuan_wingoods';
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  gotuanyuan: function (event){
  
    var type = event.currentTarget.dataset.type;
    //tuanyuan
    var link = '/pages/dan/tuan_tuanyuan?type=' + type;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  goqrcode:function(){
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/groupleaderindex/token/' + token,
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          console.log(res.data.data.three_tuanyuan_count);
          that.setData({
            user_info: res.data.data
          });
        }
      }
    })
  },
  goindex:function(){
    var link = '/pages/dan/groupleaderindex';
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})