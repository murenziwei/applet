// pages/child/myIssue/myIssue.js
var util = require("../../../utils/util.js");
Page({
  /*
   * 页面的初始数据
   */
  taFn:function(){
    console.log("获取焦点时触发？");
  },
  imgerrorFn:function(getdata){
    console.log(getdata,"这是图片错误");
  },
  navtar: function (ev) {
    console.log(ev, "跳转");
    var idT = ev.currentTarget.dataset.id;
    var urlT = "../../../issue/issue?id=" + idT;
    wx.navigateTo({ url: urlT });
  },

  gateTo(ev) {
    var tUrl = "../maillistDetails/maillistDetails?id=" + ev.currentTarget.dataset.id;
    wx.navigateTo({ url: tUrl });
  },

  closeFrom(){
    //关闭表单
    this.setData({ openFrom: false, checkarr:[],quan:false});
  },

  titleCon(e){
    //标题
    this.setData({ inputValue: e.detail.value });
  },

  textCon(e) {
    //内容
    this.setData({ textareaValue: e.detail.value });
  },

  fasong(){
    //发送按钮点击
    
    wx.that = this;
    var token = wx.getStorageSync("token");
    var to;
    //如果quan=false 就是没有全选
    this.data.quan ? to = 0 : to = this.data.checkarr.join(',');
    wx.request({
      url: util.api() + 'ruan.php?s=/Apicheck/sent_msg.html',
      data: {
        "token": token,
        "to": to,
        "content": wx.that.data.textareaValue,
        "title": wx.that.data.inputValue
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'post',
      success: function (res) {
        if (res.data.code === 1) {
          wx.showToast({ title: "发送成功", icon: "none", duration: 1000 ,success:function(){
            wx.reLaunch({url:"../../../refer/refer"});
          }});
        } 
      },
      fail: function () {
        wx.showToast({ title: "请求失败", icon: "none", duration: 1000 });
      }
    });
    this.setData({ checkarr: [],openFrom: false, quanXuan: false, quan: false });
  },
  data: {
    token: wx.getStorageSync("token"),
    showQuan:false,
    quan:false,
    quanXuan:false,
    isShowQuan:false,
    openFrom:false,
    checkarr:[],
    scrollhidden: true,
    shload: false,
    page: 1,
    size: 10,
    cs: {
      issueObj: []
    }
  },
  lazyload: function (ev) {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  showQuan: function () {
    console.log(this.data.checkarr)
    this.setData({ showQuan: true});
  },
  checkboxChange: function (e) {
    console.log(e)
    if (e.detail.value.length>0){
      const arr = this.data.cs.issueObj;
      const checkarr = new Set(this.data.checkarr) ;
      arr.forEach((item,index)=>{  
        checkarr.add(item.id)  
      })
      this.setData({ checkarr: [...checkarr],quanXuan: true });
    }else{
      this.setData({ quanXuan: false });
    }
  },
  closeMass: function (e) {
    this.setData({ quan : false,showQuan: false, quanXuan: false, checkarr:[]});
  },

  oneboxChange: function (e) {
    const arr = this.data.checkarr;
    if (e.detail.value.length>0){
      arr.push(...e.detail.value)
      this.setData({ checkarr: arr });
    }else{
      const val = e.currentTarget.dataset.val;
      
      arr.forEach((item,index)=>{
        if (item == val){
          arr.splice(index, 1);
        }
      })
    }
    if (arr.length == this.data.cs.issueObj.length){
      this.setData({ quan: true });
    }else{
      this.setData({ quan: false });
    }
    
  },
  ssss: function (e) {
    //及没全选也没选任何人
    if (!this.data.quanXuan&&this.data.checkarr.length==0) {
     return wx.showModal({
        title: '提示',
        content: '你没有选择任何人',
        showCancel:false,
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    };
    this.setData({ openFrom: true, showQuan: false });
  },
  onLoad: function (options) {
    wx.that = this;
    var that = this;
    // 显出加载状态
    that.setData({ loadshow: true, shload: false });
    var token = wx.getStorageSync("token");
    wx.request({
      data: {
        token: token,
        page: that.data.page,
        size: that.data.size,
        is_show_mail:1,
      },
      url: util.api() + "ruan.php?s=/Apicheck/user_list.html",
      success: function (res) {
        console.log(res);
        var jointobj = that.data.cs;
        jointobj.issueObj = res.data.user_list;
        that.setData({ len: res.data.user_list ? res.data.user_list.length:0, cs: jointobj });
        if (res.data.is_show_group_sending){
          that.setData({ isShowQuan: true });
        }
        //console.log(that.data.is_show_group_sending,'999999');
      },
      fail: function (res) {
        that.setData({ shload: true });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //渲染完成后取消加载状态
    var that = this;
    that.setData({ loadshow: false });

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
    var that = this;
    var token = wx.getStorageSync("token");
    var jointobj = that.data.cs;
    
    if (!that.data.shload) {
      //拉到底时触发请求
      that.setData({ page: that.data.page + 1 });
      wx.request({
        data: {
          token: token,
          page: that.data.page,
          size: that.data.size,
          is_show_mail: 1,
        },
        url: util.api() + "ruan.php?s=/Apicheck/user_list.html",
        success: function (res) {
          console.log(res, "成功");
          var jointobj = that.data.cs;
          jointobj.issueObj.push(...res.data.user_list) ;
          const arr = that.data.cs.issueObj;
          const checkarr = new Set(that.data.checkarr);
          arr.forEach((item, index) => {
            checkarr.add(item.id)
          })
          that.setData({ cs: jointobj, len: jointobj.issueObj.length, checkarr: [...checkarr]});
          if(res.data.user_list.length==0){
            that.setData({ shload: true });
          }
          console.log(that.data.len)
        },
        fail: function (res) {
          that.setData({ shload: true });
          console.log(res, "错误");
        }
      });
      that.setData({ cs: jointobj });
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})