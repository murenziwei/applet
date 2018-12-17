const util=require("/utils/util.js");
//让util共用
wx.util=util;
App({
  onLaunch: function (opt) {
    //登录账号
    util.login1();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (res) {
    var scene=res.scene;
    switch(scene){
      case 1044:(()=>{
        try{
          var tUrl = res.path + "?id=" + res.query.id;
          wx.navigateTo({ url: tUrl });
        }catch(err){
          
        }
      })();break;
    }
   
    
  },
})
