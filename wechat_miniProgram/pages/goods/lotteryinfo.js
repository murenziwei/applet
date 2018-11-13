// pages/goods/lotteryinfo.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page: 0,
    pre_page:4,
    no_order: 0,
    list:[]
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
  getData:function(){
    this.setData({
      isLoadMore: true
    })

    var goods_id = this.data.goods_id;
    var page = this.data.page;
    var pre_page = this.data.pre_page;
    var self = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_lottery_info/goods_id/' + goods_id + '/page/' + page + '/per_page/' + pre_page,
      success: function (res) {
        if (res.data.code == 1) {
          //un login
          self.setData({
            isHideLoadMore: true
          })
          return false;
        } else if (res.data.code == 0) {
          //code goods_image

          var agoData = self.data.list;
          var goods = res.data.data;

          goods.map(function (good) {
            agoData.push(good);
          });
          self.setData({
            list: agoData,
            goods_info: res.data.goods_info,
            pin_goods: res.data.pin_goods,
            'no_order': 0
          });


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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})