// pages/order/refunddetail.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hide_cancle:true,
    order_id:0,
    pingtai_deal:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order_id = options.id;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/refunddetail/token/' + token + '/order_id/' + order_id,
      success: function (res) {
        if (res.data.code == 3) {
          //un login
        } else if (res.data.code == 1) {
          //
          //code goods_image
          that.setData({
            pingtai_deal: res.data.pingtai_deal,
            order_refund: res.data.order_refund,
            order_id: res.data.order_id,
            order_refund_history: res.data.order_refund_history,
            order_refund_historylist: res.data.order_refund_historylist,
            refund_images: res.data.refund_images,
            order_goods: res.data.order_goods,
            order_info: res.data.order_info
          })
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
  cancle_shen: function(){
    this.setData({
      hide_cancle:false    
    })
  },
  hide_cancle:function()
  {
    this.setData({
      hide_cancle: true
    })
  },
  sub_cancle:function()
  {
    var order_id = this.data.order_id;
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/cancel_refund/token/' + token + '/order_id/' + order_id,
      success: function (res) {
        if (res.data.code == 3) {
          //un login
        } else if (res.data.code == 1) {
          //
          //code goods_image
          wx.showToast({
            title: '撤销成功',
            icon: 'success',
            duration: 1000,
            success: function (res) {
              wx.redirectTo({
                url: "/pages/order/order?id=" + order_id
              })
            }
          })
          

        }
      }
    })
  },
  pingtai_deal:function()
  {
    var order_id = this.data.order_id;
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/judgement_refund/token/' + token + '/order_id/' + order_id,
      success: function (res) {
        if (res.data.code == 3) {
          //un login
        } else if (res.data.code == 1) {
          //
          //code goods_image 
          wx.showToast({
            title: '介入成功',
            icon: 'success',
            duration: 2000,
            success: function (res) {
              wx.redirectTo({
                url: "/pages/order/order?id=" + order_id
              })
            }
          })
          

        }
      }
    })

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