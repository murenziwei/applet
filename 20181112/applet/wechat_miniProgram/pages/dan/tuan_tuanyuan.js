var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LoadingComplete: true,
    type:0,
    hasRefesh: false,
    list: [],
    state: -1,
    pageNum: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var type = options.type;
    var token = wx.getStorageSync('token');
    this.setData({
      type: type
    })
    this.loaddata();
  },
  loaddata: function () {
    let that = this;
    var token = wx.getStorageSync('token');
    var type = this.data.type;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiuser/tuanyuan/token/' + token + '/type/' + type,
        data: {
          "page": that.data.pageNum + 1,
          is_index_show: 2
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
              tip_html: '^_^没有更多了',
              hidetip: true
            });

          }
        }
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
    this.loaddata();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})