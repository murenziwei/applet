// pages/order/hexiao.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    quan_sn:'',
    is_c_hexiao:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
    //scene = '453045641147';

    this.setData({
      quan_sn: scene,
    })

    var that = this;
    var token = wx.getStorageSync('token');
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/hexiao_pickup/token/' + token + '/pick_sn/' + scene,
      success: function (res) {
        if(res.data.code == 1)
        {
          var msg = res.data.msg;

          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel:false,
            success: function (res) {
              that.goIndex();
            }
          })
        }else{

          that.setData({
            order: res.data.data,
            pingtai_deal: res.data.pingtai_deal,
            order_refund: res.data.order_refund
          })
        }
      }
    })

  },
  hexiao : function(){
    var quan_sn = this.data.quan_sn;
    
    var that = this;
    var token = wx.getStorageSync('token');


    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/pickup_pickage/token/' + token + '/pick_sn/' + quan_sn,
      success: function (res) {
        if (res.data.code == 1) {
          var msg = res.data.msg;

          wx.showModal({
            title: '温馨提示',
            content: msg,
            showCancel: false,
            success: function (res) {
              that.goIndex();
            }
          })
        } else {
          wx.showModal({
            title: '温馨提示',
            content: '核销成功',
            showCancel: false,
            success: function (res) {
              var order = that.data.order;
              order.order_status_info.name = '已签收';
              that.setData({
                order:order,
                is_c_hexiao:0
              });
            }
          })
          
        }
      }
    })

  },
  goIndex: function(){
    var pages_all = getCurrentPages();

    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/dan/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/dan/index'
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