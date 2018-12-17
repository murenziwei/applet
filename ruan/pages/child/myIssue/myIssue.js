// pages/child/myIssue/myIssue.js
var util=require("../../../utils/util.js");
Page({
  /*
   页面的初始数据
   */
  gettag(ev){

  },
  imgerrfn:function(tar){
    console.log(tar);
    var changeI =  tar.currentTarget.dataset.index ;
    var issue=wx.that.data.cs.issueObj;
    console.log(issue);
    issue[changeI].img_self ="../../../image/icon7.png";
    wx.that.setData({
      "cs.issueObj":issue
    })
  },
  navtar:function(ev){
    console.log(ev,"跳转");
    var idT=ev.currentTarget.dataset.id;
    var urlT="../../../issue/issue?id="+idT;
    wx.navigateTo({url:urlT});
  },

  gateTo(ev){
    var tUrl = "../details/details?id=" + ev.currentTarget.dataset.id;
    wx.navigateTo({ url: tUrl });
  },
  data: {
    token:wx.getStorageSync("token"),
    scrollhidden:true,
    shload:true,
    page:1,
    size:10,
    cs:{
      issueObj:[]
    }
  },
  digui(){
    //获取设备信息
    var system=wx.getSystemInfoSync();
    var query=wx.createSelectorQuery();
    query.select("#lw-load").boundingClientRect().exec(function(res){
      console.log(res,"什么猫腻？");
      var top=res[0].top;
      if(system.windowHeight>top){
        wx.that.lazyload();
      }
    });
  },
  lazyload:function(ev){
    var that=this;
    var jointobj=that.data.cs;
    
    if(that.data.shload){
      //拉到底时触发请求
      wx.request({
        data: {
          token: that.data.token,
          page: that.data.page++,
          size: that.data.size
        },
        url: util.api() + "ruan.php?s=/apicheck/show_my_collect",
        success: function (res) {
          console.log(res, "成功");
          var joint = that.data.cs;

          if (res.data.list?res.data.list.length>0:0) {
            //...可以打散数组
            joint.issueObj.push(...res.data.list);
            that.setData({ cs: joint, shload: true, page: that.data.page + 1 ,size:joint.issueObj.length});

            if (res.data.list.length < that.data.size) {
              that.setData({ shload: false });
            }
            //递归函数
            wx.that.digui();
          } else {
            that.setData({ shload: false });
          }
        },
        fail: function (res) {
          that.setData({ shload: false });
          console.log(res, "错误");
        }
      });
      that.setData({ cs: jointobj });
    }
  },
  delIssue:function(ev){
    var that=this;
    var token=wx.getStorageSync("token");
    var did=ev.currentTarget.dataset.id;
    var dindex=ev.currentTarget.dataset.index;
    console.log(ev);
    console.log(did,token,"删除需要的参数");
    wx.showModal({
      title:"删除发布",content:"是否删除此发布",success:function(data){
        console.log(data);
        if(data.confirm){
          wx.request({
            url:util.api()+"ruan.php?s=/apicheck/del_event",
            data:{
              token:token,
              id:did
            },
            success:function(res){
              if(res.data.code){
                wx.showToast({title:"删除成功",icon:"none",success:function(){
                  var jointobj=that.data.cs;
                  jointobj.issueObj.splice(dindex,1);
                  console.log(jointobj);
                  that.setData({cs:jointobj});
                }});
              }
              console.log(res,"删除发布请求回来的数据");
            },
            fail:function(res){
              console.log("删除失败");
            }
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  tiaozhuan:function(){
    wx.navigateTo({url:"../../../issue/issue"});
  },
  onLoad: function (options) {
    wx.that=this;
    var that=this;
    var token=wx.getStorageSync("token");
    var isbind=wx.getStorageSync("is_bind");
    if (isbind) {
      wx.that.lazyload();
      /*// 显出加载状态
      that.setData({ loadshow: true, shload: true });
      wx.request({
        data: {
          token: token,
          page: that.data.page,
          size: that.data.size
        },
        url: util.api() + "ruan.php?s=/apicheck/show_my_collect",
        success: function (res) {
          console.log(res,"叫你");
          var jointobj = that.data.cs;
          jointobj.issueObj = res.data.list;
          that.setData({ cs: jointobj });
          console.log(that.data.cs);

          if (res.data.list.length < that.data.size) {
            that.setData({ shload: false });
          }
          if (that.data.cs.issueObj ? that.data.cs.issueObj.length == 0 : 1) {
            wx.showModal({
              title: "我的收藏", content: "你收藏任何用户，是否跳转寻亲页", success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({ url: "../../../total/total" });
                } else {
                  that.setData({ shload: false });
                }
              }
            });
          }
        },
        fail: function (res) {
          that.setData({ shload: false });
        }
      });
      */
    } 
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //渲染完成后取消加载状态
    var that=this;
    that.setData({ loadshow:false});
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var isbind=wx.getStorageSync("is_bind");
    if(!isbind){
      wx.showModal({
        content: "你未实名，是否去实名", success: function (data) {
          if (data.confirm) {
            wx.navigateTo({ url: "../dataModifit/dataModifit" });
          } else {
            wx.navigateBack();
          }
        }
      });
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