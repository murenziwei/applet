var util = require('../utils/util.js');
Page({
  imgerrorfn:function(){
    wx.that.setData({"pu.avatarUrl":"/image/icon7.png"})
  },
  navDetail:function(ev){
    var isBind=wx.getStorageSync("is_bind");
    wx.navigateTo({ url: ev.currentTarget.dataset.url});
    console.log(ev.currentTarget.dataset.url)
    if(isBind){

    }
  },
  gourl(e) {
    var url = e.currentTarget.dataset.url
    wx.navigateTo({ url: `../out/out?url=${url}` })
  },
  /**
   * 页面的初始数据
   */
  data: {
    lwf: {
      circular: true,
      autoplay: true,
      duration: 500,
      interval: 2000,
      vertical: true,
      icon: "icon-kuaijin",
      obj: [] 
     },
     ps:{
       data:[
         
       ]
     },
     pn:{
       icon:"icon-kuaijin",
       obj:[{
         text:"什么这是？八卦的小道消息！"
       }]
     },
     
     pt:{
       typeObj:[
         { imgSrc: "../image/peoplechange.png", text: "资料修改", href: "../pages/child/dataModifit/dataModifit?idonImgNone=1", isShow: 1 , },
         { imgSrc: "../image/addpeople.png", text: "添加人员", href: "../pages/child/helpdata/helpdata", isShow: 1},
         { imgSrc: "../image/ziyuanbaosongshujudaochu.png", text: "我的收藏", href: "../pages/child/myIssue/myIssue", isShow: 1 },
         { imgSrc: "../image/guanyuwomen.png", text: "软件使用说明", href: "../pages/child/seek/seek", isShow: 1 },
         { imgSrc: "../image/ditu.png", text: "中华阮氏分布图", href: "../map/map", isShow: 1 }
       ]
     },

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
        wx.that=this;
        var that=this;
        
        var token = wx.getStorageSync("token");
        var is_bind = wx.getStorageSync("is_bind");//判断是否绑定实名
        
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
    var that=this;
    //开启加载状态
    wx.showLoading({ title: "获取中……" })
    var is_bind = wx.getStorageSync("is_bind");//判断是否绑定实名
    if (!is_bind) {
      wx.showModal({
        content: "你未实名，是否去实名", success: function (data) {
          if (data.confirm) {
            wx.navigateTo({ url: "../pages/child/dataModifit/dataModifit" });
          } else {
            wx.navigateBack();
          }

        }
      });
      //关闭加载状态
      wx.hideLoading();
    }else{
        wx.request({
          url: util.api() + 'ruan.php?s=/Apicheck/user_info.html',
          data: { token: wx.getStorageSync("token") },
          method: 'get',
          success: function (res) {
            console.log(res, "你好");
            var userinfo = res.data;
            if(userinfo.status=="1"){

              if (userinfo.is_show_mail) {
                that.setData({
                  // "pt.typeObj[2].isShow": userinfo.is_show_mail //是否隐藏通讯录
                });
              }
              if (userinfo.is_show_add_user) {
                that.setData({
                  "pt.typeObj[1].isShow": userinfo.is_show_add_user //是否隐藏添加人员
                });
              }
              that.setData({
                pu: userinfo,
              });

              wx.that.setData({ loadshow: false });
            } else if (userinfo.status == "0"){
              wx.showModal({title:"封号提示！",content:"你的账号处于封号状态，如若不善，请你带来歉意的谅解！",success:function(res){
                if(res.confirm){
                  wx.reLaunch({url:"/mine/mine"})
                }else{
                  wx.navigateBack();

                }
              }})
            }
          },
          fail: function () {
            wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
            
          },
          complete:function(){
            //关闭加载状态
            wx.hideLoading();
          }
        })
    }
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