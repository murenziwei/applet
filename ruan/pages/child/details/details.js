// pages/child/details/details.js
var util = require("../../../utils/util.js");

Page({
  imgerrorfn(){
    this.setData({"info.img_self":"../../../image/icon7.png"});
  },
  //查看图片全图
  previewI: function (ev) {
    var imgSrc = ev.currentTarget.dataset.src;
    wx.previewImage({ current: imgSrc, urls: [imgSrc], fail: function (err) { console.log(err, "执行失败"); } });
  },
  showImg(e){
    this.setData({
      showImg:true,
      imgSelf: e.currentTarget.dataset.src
    })
  },

  closeImg(){
    this.setData({
      showImg: false,
      imgSelf:''
    })
  },

  //收藏
  sc(){
    
    var that=this;
    
    var urlD = util.api() + "ruan.php?s=/Apicheck/collect_user";
    var that = this
    console.log(that.data.star,"这是？");
    wx.request({
      url: urlD,
      method: "get",
      data: {
        token: that.data.token,
        id: that.data.options.id,
        type: that.data.star?0:1
      },
      success: function (res) {
        wx.showToast({title:res.data.msg,icon:"none",success:function(){
          console.log(res,"这是？");
          if(res.data.code){
            if (that.data.star == 1) {
              that.setData({
                'star': 0,
                'info.collect_num': +that.data.info.collect_num - 1
              })
            } else {
              that.setData({
                'star': 1,
                'info.collect_num': +that.data.info.collect_num + 1
              })
            }
          }
          
        }});
      }
    });
  },

  // navFn:function(ev){
  //   wx.reLaunch({url:ev.currentTarget.dataset.url});
  // },
  getPosition:function(ev){
    
    var that=this;
    
    wx.showShareMenu({
      withShareTicket:true,
      success:function(res){
        console.log(res,"成功");
        
      },
      fail:function(err){
        console.log(err,"错误");
      }
    });
  },
  // makeCall:function(ev){
  //   console.log(ev);
  //   var phone=ev.target.dataset.call;
  //   wx.makePhoneCall({
  //     phoneNumber:String(phone),
  //     success:function(res){
  //       var data=res;
  //       wx.showToast({title:"拨打成功",icon:"none",success:function(){
  //         console.log(data,"拨打成功");
  //       }});
  //     },
  //     fail:function(){
  //       wx.showToast({
  //         title: "拨打失败", icon: "none", success: function () {
  //           console.log("拨打失败");
  //         }
  //       });
  //     }
  //   });
  // },
  /**
   * 页面的初始数据
   */
  data: {
    token:wx.getStorageSync("token"),
    isbind:wx.getStorageSync("is_bind"),
    star:0,
    imgSelf:'',
    options:{
    },
    shareShow:false,
    info:{
    },
  },

  closeShare(){
    this.setData({ shareShow: false });
  },

  showShare(){
    this.setData({ shareShow: true });
  },
  
  onLoad: function (options) {
    wx.that=this;
    console.log(options);
    this.setData({ options: options});
    //options是接收跳转页面传递的参数
    //向服务器发送一次请求
    wx.showShareMenu({withShareTicket:true});
    var that=this;
    var token = wx.getStorageSync('token');
    console.log(token,"token");
    var urlD = util.api() +"ruan.php?s=/Apicheck/users_info";//详情
    wx.request({
      url:urlD,
      method:"get",
      data:{
        token:token,
        id:that.data.options.id
      },
      success:function(res){
        console.log(res, "请求");
        if(res.data.code){
          wx.showToast({duration:2000,title:res.data.msg,icon:"none",success:function(){
            if(res.data.info){
              var infoobj=res.data.info;
              infoobj.show_self = infoobj.show_self ==undefined ? infoobj.show_self:"本人无介绍";
              that.setData({
                info: res.data.info,
                star: res.data.info.is_collected
              })
            }
          }});
        }
        return
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (res) {
   
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
  onShareAppMessage: function (res) {
    console.log(res);
    var that=this;
    var token=wx.getStorageSync("token");
    console.log(token,this.data.options.id);
    return {
      title: "寻亲不用愁",
      path: "/pages/child/details/details?id="+that.data.options.id,
      success: function (res) {
        var shareTickets = res.shareTickets;
        wx.request({
          methed: "get",
          url: util.api() + "ruan.php?s=/Apicheck/set_user_forward",
          data: {
            token: token,
            id: that.data.options.id
          },
          success: function (jj) {
            if (jj.data.code) {
              
              var obj = that.data.info;
              obj.forward_num++;
              console.log(obj);
              wx.that.setData({ info: obj });
              console.log(util.api(), jj, "转发成功了");

            }
          }
        });
        // console.log("见你姥姥",shareTickets.length);
        // if (shareTickets.length === 0) {
        //   return false;
        // }

        // wx.getShareInfo({
        //   shareTicket: shareTickets[0],
        //   success: function (res) {
        //     var encryptedData = res.encryptedData;
        //     var iv = res.iv;
            
        //     console.log(res);
        //     wx.request({
        //       methed:"get",
        //       url:util.api()+"ruan.php?apievent/set_event_forward.html",
        //       data:{
        //         token:token,
        //         id:that.data.options.id
        //       },
        //       success:function(res){
        //         console.log(res,"转发成功了");
        //       }
        //     });
        //   },
        //   fail: function (res) {
        //     showToast({ title: "转发失败", icon: "none" })
        //   }
        // });
      }
    }
  }
})