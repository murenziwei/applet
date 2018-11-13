// pages/order/hexiao_bind.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    skustate:1,
    scene:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scene = decodeURIComponent(options.scene)
   // scene = 1;
    //1_0
    var seller_store_id = scene;

   // seller_store_id = '1_2';
    //seller_store_id = '1_0';
    this.setData({
      scene: seller_store_id
    })
    var that = this;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/bind_pickup_order/token/' + token + '/seller_store_id/' + seller_store_id,
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
        }else {
          that.setData({
            store_name: res.data.store_name
          })
        }
      }
    })
    


  },
  sub_bind_store: function(){
    
    var scene = this.data.scene;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/bind_pickup_post/token/' + token + '/seller_store_id/' + scene,
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
            content: '绑定成功',
            showCancel: false,
            success: function (res) {
              that.goIndex();
            }
          })
          
        }
      }
    })


  },
  goIndex: function () {
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