// pages/dan/quan.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_index:1,
    no_order:0,
    quan:[],
    page:1,
    isHideLoadMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.page = 1;
    this.getData();
  },
  tabchange:function(e){
    var index = e.currentTarget.dataset.index;

    this.setData({
      quan: [],
      tab_index: index,
      page:1
    })
    this.getData();
  },
  getData: function () {
    this.setData({
      isHideLoadMore: true
    })

    this.data.no_order = 1
    var page = this.data.page;
    var tab_index = this.data.tab_index;
    var token = wx.getStorageSync('token');

    var url = util.api() + 'index.php?s=/Apiuser/myvoucherlist/token/' + token + '/type/' + tab_index+'/page/' + page+'/pre_page/4';
    var data = {
      "page": page
    };

    var self = this;
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: function (data) {
        console.log(data);

        if (data.data.code == 0) {
          var agoData = self.data.quan;
          var goods = data.data.list;

          goods.map(function (good) {
            agoData.push(good);
          });
          self.setData({
            quan: agoData,
            'no_order': 0
          });

        } else {
          self.setData({
            isHideLoadMore: true
          })
          return false;
        }
      }
    });
  }, 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  goLink: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
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