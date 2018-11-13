// pages/goods/bargain_me.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login:false,
    pageNum: 1,
    hasRefesh: false,
    LoadingComplete: true,
    list: [],
    hidetip: true,
    share_title: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //assist_free_coupon_me
    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }
    })
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/index_share',
      success: function (res) {
        that.setData({
          share_title: res.data.title,
        })
      }
    })
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/assist_free_coupon_me/token/' + token,
      success: function (res) {

        if (res.data.code == 0) {
          that.setData({
            list: res.data.data
          })
        } else {
          
        }

      }
    })
  },
  go_bargain_kan:function(e){
    var id = e.currentTarget.dataset.order_id;

    var url = "/pages/goods/bargain_detail?id=" + id;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: url
      })
    } else {
      wx.navigateTo({
        url: url
      })
    }
  },
  loadMore: function () {
    var token = wx.getStorageSync('token');

    let that = this;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/assist_free_coupon_me/token/' + token,
        data: {
          "page": that.data.pageNum + 1
        },
        success: function (res) {
          if (res.data.code == 0) {
            let list = that.data.list.concat(res.data.data);
            that.setData({
              list: list,
              pageNum: that.data.pageNum + 1,
              hasRefesh: false,
              hidetip: true
            });
          } else {
            that.setData({
              LoadingComplete: false,
              hasRefesh: true,
              hidetip: true
            });

            /**
           
             */
          }
        }
      })
    } else {

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
    console.log(23);
    this.loadMore();
  },
  go_bargain_index:function(){
    wx.redirectTo({
      url: '/pages/goods/bargain'
    })
  },
  go_bargain_me: function () {
    wx.redirectTo({
      url: '/pages/goods/bargain_me'
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var share_title = this.data.share_title;
    return {
      title: share_title,
      path: 'pages/goods/bargain',
      success: function (res) {
        // 转发成功



      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})