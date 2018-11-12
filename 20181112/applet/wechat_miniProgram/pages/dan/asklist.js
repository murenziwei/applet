// pages/dan/asklist.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_order: 0,
    list: [],
    page: 1,
    isHideLoadMore: true,
    showTpo: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.page = 1;
    this.getData();
  },
  go_ask_page:function(e){
    var id = e.currentTarget.dataset.id;
    var page_url = "/pages/dan/askdetail?id="+id;
    wx.navigateTo({
      url: page_url,
    })
  },
  getData: function () {
    this.setData({
      isHideLoadMore: true
    })

    this.data.no_order = 1
    var page = this.data.page;
    var tab_index = this.data.tab_index;
    var token = wx.getStorageSync('token');

    var url = util.api() + 'index.php?s=/Apiuser/myask_list';
    var data = {
      "page": page
    };

    var self = this;
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: function (data) {
        
        if (data.data.code == 0) {
          var agoData = self.data.list;
          var goods = data.data.list;

          goods.map(function (good) {
            agoData.push(good);
          });
          self.setData({
            list: agoData,
            'no_order': 0
          });

        } else {
          self.setData({
            isHideLoadMore: true,
            showTpo: false
          })
          return false;
        }
      }
    });
  },
  goLink: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },
  goLink2: function (e) {
    var link = e.currentTarget.dataset.link;
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
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();

    this.setData({
      isHideLoadMore: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})