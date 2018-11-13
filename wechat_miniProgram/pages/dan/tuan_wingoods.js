var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    LoadingComplete: true,
    menuindex:-1,
    type: 0,
    gid: 0,
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
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/get_index_category',
      success: function (res) {
        that.setData({
          nav: res.data.data,
        })
      }
    })
    this.loaddata();
  },

  choiceMenu: function (event) {//分类
    let that = this;
    let vid = event.currentTarget.dataset.id;
    let gid = event.currentTarget.dataset.navid;

    this.setData({
      menuindex: vid,
      pageNum:0,
      gid: gid,
      list:[],
      hidetip: true,
      hasRefesh: false
    })
    this.loaddata();
  },
  loaddata: function () {
    let that = this;
    var token = wx.getStorageSync('token');
    
    if (!that.data.hasRefesh) {

      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiuser/yongjing/token/' + token,
        data: {
          "page": that.data.pageNum + 1,
          gid:that.data.gid,
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
  goLink: function (event) {
    
    var link = event.currentTarget.dataset.link;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})