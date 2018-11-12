// pages/goods/comment.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_id:0,
    page:1,
    pre_page:10,
    goods:[],
    no_order:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var goods_id = options.id;
    this.setData({
      goods_id: goods_id
    })

    this.data.page = 1;
    this.getData();
  },
  getData: function () {
    this.setData({
      isLoadMore: true
    })

    var goods_id =  this.data.goods_id;
    var page = this.data.page;
    var pre_page = this.data.pre_page;
    var token = wx.getStorageSync('token');
  
    var url = util.api() + 'index.php?s=/Apigoods/comment_info/token/' + token + '/goods_id/' + goods_id + '/per_page/' + pre_page + '/page/' + page;
  
    var self = this;
    wx.request({
      url: url,
      method: 'GET',
      success: function (data) {

        console.log(data);

        if (data.data.code == 1) {
          var agoData = self.data.goods;
          var goods = data.data.list;

          goods.map(function (good) {
            agoData.push(good);
          });
          self.setData({
            goods: agoData,
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
  go_index:function(event){
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  go_back_goods:function(event){
    var that = this;
    wx.redirectTo({
      url: '/pages/goods/index?id=' + that.data.goods_id
    })
  },
  onReachBottom: function () {
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();

    this.setData({
      isHideLoadMore: false
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})