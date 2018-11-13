// pages/dan/groupleaderindex.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/tuanbonus_index/token/' + token,
      method: 'get',
      success: function (res) {
        if(res.data.code == 0)
        {
          that.setData({
            list: res.data.data,
          });
        }
        
      }
    })
  },
  golistorder:function(event){
	  
    let state = event.currentTarget.dataset.state;
    var link = '/pages/dan/tuan_listorder?state='+state;
    
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
  gotixian:function(){

  //check is setting message check_tixian
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/check_tixian/token/' + token,
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          var link = '/pages/dan/tuan_tixian';
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
        }else{
          var link = '/pages/dan/tuan_tixian_link';
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
        }

      }
    })

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