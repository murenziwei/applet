// pages/child/maillistDetails/maillistDetails.js
var util = require("../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gshow:false
  },
  imgerrorfn(){
    this.setData({"userInfo.img_self":"../../../image/icon7.png"});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this;
    var token = wx.getStorageSync("token");
    wx.request({
      data: {
        token: token,
        id: options.id
      },
      method:"get",
      url: util.api() + "ruan.php?s=/Apicheck/users_info.html",
      success: function (res) {
        console.log(res,"没空理你");
        if (res.data.code) {
          if(res.data.info){
            if (res.data.info.enterprise_info) {
              that.setData({ gshow: true });
            }
            that.setData({ userInfo: res.data.info });
          }else{
            wx.showToast({duration:2000,title:res.data.msg,icon:"none"});
          }
        }
      },
      fail: function (res) {
       
      }
    });
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