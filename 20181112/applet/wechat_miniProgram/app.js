var util = require('utils/util.js');
App({
  onShow: function (options){
    
    var s = JSON.stringify(options);
    var share_id = options.query.share_id;
    if(share_id == undefined)
    {
      share_id = '0';
    }
   
   
    var token = wx.getStorageSync('token');
    var member_id = wx.getStorageSync('member_id');

    if (token && (member_id == undefined || member_id.length == 0) )
    {
      wx.request({
        url: util.api() + 'index.php?s=/Apiuser/get_user_info/token/' + token,
        method: 'get',
        success: function (res) {
           if(res.data.data != '' )
           {
             wx.setStorage({
               key: "member_id",
               data: res.data.data.member_id
             })
           }   
          

        }
      })
    }
    
   
  },
  onLaunch: function (options) {
  
    var share_id = options.query.share_id;
    if (share_id == undefined) {
      share_id = '0';
    }
    if (share_id > 0) {
      wx.setStorage({
        key: "share_id",
        data: share_id
      })
    }
    
    var last_login_time = wx.getStorageSync('last_login_time');
    //bc6fd8b2b2818e7956c5628217eb4216
   
    var token = wx.getStorageSync('token');
    var member_id = wx.getStorageSync('member_id');
   
    var timestamp = Date.parse(new Date()) / 1000;
 
    var that = this;

   if (token && member_id != undefined && member_id.length > 0) {
    } else {
     wx.getSetting({
       success: function (res) {

         var add_scope = res.authSetting;
         if (add_scope['scope.userInfo'] == undefined) {
           
         } else {
           
         }
        
       }
     })

    }
  },
  globalData: {
    s_num: 0,
    store_id: 0
  }

})
