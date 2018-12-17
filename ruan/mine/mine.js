// mine/mine.js
// import xlsx from 'xlsx';
var util=require("../utils/util.js");

// console.log(xlsx,'111')

Page({

  /**
   * 页面的初始数据
   */
  data: {
     userinfoTitle:"需要用户手动授权",
     userinfoContent:"",
     componenturl:"../../mine",
     mt:{
       nameUser:"俊姑娘（他是男的）",
       bgUser:"../image/wx.png"
     },
     mut:{
       thingList:[
         { 
           icon:"../image/icon7.png",text:"个人中心",
           navHref:"../personal/personal"
         },
        //  {
        //    icon: "../image/fabu.png", text: "我的发布",
        //    navHref:"../pages/child/myIssue/myIssue"
        //  },
         {
           icon: "../image/iconzhengli-.png", text: "捐助赞助",
           navHref: "pay"
         }
       ]
     }
  },
  navFn:function(ev){
    if (ev.currentTarget.dataset.href === 'pay') return this.pay()
    wx.navigateTo({url:ev.currentTarget.dataset.href});
  },

  pay(){
    return
    wx.request({
      url: 'https://www.yourhost.com/weixin/WeiActivity/payfee.php',//改成你自己的链接
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data);
        console.log('调起支付');
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonceStr,
          'package': res.data.package,
          'signType': 'MD5',
          'paySign': res.data.paySign,
          'success': function (res) {
            console.log('success');
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 3000
            });
          },
          'fail': function (res) {
            console.log('fail');
          },
          'complete': function (res) {
            console.log('complete');
          }
        });
      },
      fail: function (res) {
        console.log(res.data)
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that=this;
    that.setData({loadshow:true});
    wx.getUserInfo({success:function(res){
      var userinfo = res.userInfo;
      that.setData({ mt: userinfo });
    }});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     var that=this;
     that.setData({loadshow:false});
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