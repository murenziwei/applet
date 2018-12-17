
var util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    token:wx.getStorageSync("token"),
    ci:{
      topic:"寻亲启事",
      content: ["微信“寻人启事” 小程序平台是为广大寻亲求助者搭建的信息发布平台，","由于访问量巨大，平台服务器及维护人员费用也不断上涨，希望广大社会爱心人士能够支持我们，支持“寻亲启事”小程序平台走的更远，帮助更多的良人成奉。"],
      button:"打赏支持",
      help:{name:"爱心赞助商"}
    }
  },

  /*
    生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.that=this;
    wx.request({
      data:{
        token:wx.that.data.token
      },
      url: util.api() + 'ruan.php?s=/apicheck/get_about_us',
      method: 'get',
      success: function (res) {
        console.log(res);
        if(res.data.code){
          wx.that.setData({ "ci.content": [res.data.about_us] });                    
        }
      },
      fail: function () {
        wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
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