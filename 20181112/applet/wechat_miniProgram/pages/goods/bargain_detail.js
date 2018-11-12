// pages/goods/bargain_detail.js
var util = require('../../utils/util.js');
function count_down(that, total_micro_second) {
  var second = Math.floor(total_micro_second / 1000);
  var days = second / 3600 / 24;
  var daysRound = Math.floor(days);
  var hours = second / 3600 - (24 * daysRound);
  var hoursRound = Math.floor(hours);
  var minutes = second / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
  var minutesRound = Math.floor(minutes);
  var seconds = second - (24 * 3600 * daysRound) - (3600 * hoursRound) - (60 * minutesRound);

  that.setData({
    endtime: {
      days: daysRound,
      hours: hoursRound,
      minutes: minutesRound,
      seconds: seconds,
      show_detail: 1
    }
  });

  if (total_micro_second <= 0) {
    that.setData({
      endtime: {
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      }
    });
    return;
  }

  setTimeout(function () {
    total_micro_second -= 1000;
    count_down(that, total_micro_second);
  }, 1000)

}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_login: false, 
    order_id:0,
    show_hide_act:1,
	is_hide:true,
  is_hiden_kan:true,
    kan_order_list:[],
    bargain_info:[],
    goods_info:[],
    is_me:false,
    has_kan:false,
    member_info:[],
    kan_description_str:'',
    kan_rules_str:'',
    kan_person_count:'',
    related_goods:[],
    share_logo:'',
    indexsharetitle:'',
    url:'',
    indexsharesummary:'',
    is_hiden_guize:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
   var order_id = options.id;
   //var order_id = 19;



    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }
    })
    this.setData({ order_id: order_id});

    //bargain_detail
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/bargain_detail/token/' + token + '/id/' + order_id,
      data: {},
      method: 'POST',
      success: function (msg) {
        if (msg.data.code == 0) {
          
          that.setData({
            bargain_info : msg.data.data.bargain_info,
            goods_info : msg.data.data.goods_info,
            has_kan : msg.data.data.has_kan,
            kan_order_list: msg.data.data.kan_order_list,
            is_me: msg.data.data.is_me,
            has_kan: msg.data.data.has_kan,
            member_info: msg.data.data.member_info,  
            kan_rules_str: msg.data.data.kan_rules_str,
            kan_person_count: msg.data.data.kan_person_count,
            related_goods: msg.data.data.related_goods,
            share_logo: msg.data.data.share_logo,
            indexsharetitle: msg.data.data.indexsharetitle,
            url: msg.data.data.url,
            indexsharesummary: msg.data.data.indexsharesummary,
            cur_time: msg.data.data.cur_time,
          })

          var seconds = (msg.data.data.bargain_info.end_time - msg.data.data.cur_time) * 1000;
          if (seconds > 0) {
            count_down(that, seconds);
          }
        }

      }
    })

  },
  show_hide_kan: function(){
    this.setData({ show_hide_act: 2, is_hide:false})
  },
  hide_hide_kan:function(){
    this.setData({ show_hide_act: 1, is_hide: true})
  },
  bindGetUserInfo: function (e) {
    
    util.login('/pages/goods/bargain_detail?id='+this.data.order_id);
    //this.setData({ is_login: true })
  },
  go_goods:function(e){
    var goods_id = e.currentTarget.dataset.goods_id;
    let id = goods_id;
    var pages_all = getCurrentPages();

    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/goods/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/index?id=' + id
      })
    }
  },
  go_bargain_index:function(){
    wx.reLaunch({
      url: '/pages/goods/bargain'
    })
  },
  kan_othder : function (){
    var that = this;
    var token = wx.getStorageSync('token');
    var order_id = this.data.order_id;

    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/kan_others_bargain/token/' + token + '/id/' + order_id,
      success: function (res) {
        if (res.data.code == 0) {
          that.data.kan_order_list.push(res.data.order_detail);
          var c_list = that.data.kan_order_list;
         
          that.setData({
            kan_order_list: c_list,
            bargain_info: res.data.bargain_order,
            has_kan:true
          })
          
          wx.showToast({
            title: '您帮砍了' + res.data.order_detail.kan_money + '元',
            icon: 'none'
          })

        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          })
        }
      }
    })
  },
  goOrderfrom_bt: function (e){
    var goods_id = e.detail.target.dataset.type;

    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
        console.log(res);
      }
    })
    this.setData({ is_hiden_kan: false });
  },
  goOrderfrom: function (e) {
    var goods_id = e.detail.target.dataset.type;

    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
        console.log(res);
      }
    })
    this.setData({is_hiden_guize:false});
  },
  hide_guize_box:function(){
    this.setData({ is_hiden_guize: true });
    this.setData({ is_hiden_kan: true });
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



    var share_title = this.data.indexsharetitle;
    var share_logo = this.data.share_logo;
    
    var indexsharesummary = this.data.indexsharesummary;
    var order_id = this.data.order_id;
    var that = this;
    
    var share_id = wx.getStorageSync('member_id');

    var share_path = 'pages/goods/bargain_detail?id=' + order_id +'&share_id=' + share_id;


    return {
      title: share_title,
      //imageUrl: share_logo,
      path: share_path,
      success: function (res) {
        // 转发成功

        //share_success_kan 
        var token = wx.getStorageSync('token');
        

        wx.request({
          url: util.api() + 'index.php?s=/Apigoods/share_success_kan/token/' + token + '/id/' + order_id,
          success: function (res) {
            if (res.data.code == 0) {
              that.data.kan_order_list.push(res.data.order_detail);
              that.setData({
                bargain_info: res.data.bargain_order
              })
              wx.showToast({
                title: '分享成功，多砍了一刀' + res.data.order_detail.kan_money +'元',
                icon:'none'
              })

            }
          }
        })
      },
      fail: function (res) {
        // 转发失败
      }
    }
  
  }
})