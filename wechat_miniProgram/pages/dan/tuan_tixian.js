var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    card_name:'',
    card_no:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_tixian_info/token/' + token,
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            list:res.data.data
          })
        }

      }
    })
  },
  inp_name:function(e){
    var value = e.detail.value;
    this.setData({
      name: value
    })
  },
  card_name: function (e){
    var value = e.detail.value;
    this.setData({
      card_name: value
    })
  },
  card_no: function (e){
    var value = e.detail.value;
    this.setData({
      card_no: value
    })
  },
  sub_form:function(){
    var token = wx.getStorageSync('token');

    var name = this.data.name;
    var card_name = this.data.card_name;
    var card_no = this.data.card_no;

    if(name.length <= 0)
    {
      wx.showToast({
        title: '请输入真实姓名',
      })
      return false;
    }
    if (card_name.length <= 0) {
      wx.showToast({
        title: '请输入转账银行名称',
      })
      return false;
    }
    if (card_no.length <= 0) {
      wx.showToast({
        title: '请输入转账账号',
      })
      return false;
    }

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/bindcard/token/' + token,
      data: {
        "bankusername": name,
        "bankname": card_name,
        "bankaccount": card_no
      },
      method: 'POST',
      success: function (res) {
        if(res.data.code ==0)
        {
          var link = '/pages/dan/tuan_tixian_link';
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