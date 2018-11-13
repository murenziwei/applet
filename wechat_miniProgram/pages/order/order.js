var util = require('../../utils/util.js');
Page({
  data: {
    tablebar: 4,
    navState:0,
    pingtai_deal:0,
    is_show:false,
    order: {},
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var is_show_tip = options.is_show;
    console.log(is_show_tip);

    if (is_show_tip != undefined && is_show_tip ==1 )
    {
      wx.showToast({
        title: '支付成功',
      })
    }else{
      wx.showLoading();
    }

    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/order_info/token/' + token + '/id/' + options.id,
      success: function (res) {
        that.setData({
          order: res.data.data,
          pingtai_deal: res.data.pingtai_deal,
          order_refund: res.data.order_refund,
          hide_lding:true
        })
        that.hide_lding();
      }
    })

    var  that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/per_page/4/is_index_show/0/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {

        if(res.data.code == 1)
        { 
         
            that.setData({
              showguess: false
            });
         
        }else {
          if (res.data.data.length > 0) {
            that.setData({
              showguess: true,
              guessdata: res.data.data
            });
          }
        }
      }
    })
  },
  hide_lding:function(){
    wx.hideLoading();
    this.setData({
      is_show : true
    })
  },
  go_goods_link:function(e){
    var id = e.currentTarget.dataset.id;
    
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
  gotop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  call_mobile: function (event)
  {
    let mobile = event.currentTarget.dataset.mobile;
    wx.makePhoneCall({
      phoneNumber: mobile
    })
  },
  goGoods:function(event){
    let id = event.currentTarget.dataset.type;

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
  gokefu: function (event) {
    let id = event.currentTarget.dataset.s_id;
    
    var goods = this.data.goods;
    var seller_info = this.data.seller_info;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/im/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/im/index?id=' + id
      })
    }
  },
  orderRefund: function (event){
    let order_id = event.currentTarget.dataset.type;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/order/refund?id=' + order_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/refund?id=' + order_id
      })
    }


  },
  orderRefunddetail: function (event){
    let order_id = event.currentTarget.dataset.type;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/order/refunddetail?id=' + order_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/refunddetail?id=' + order_id
      })
    }


  },
  goLink2: function (event) {
    let link = event.currentTarget.dataset.link;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }


  },
  goLink: function (event) {
    let link = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },
  navShow: function () {
    this.setData({
      navState: 1
    })
  },
  navHide: function () {
    this.setData({
      navState: 0
    })
  },
  orderPay: function (event) {
    var that = this;
    var token = wx.getStorageSync('token');
    let id = event.currentTarget.dataset.type;
    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/wxpay/token/' + token + '/order_id/' + id,
      success: function (res) {
        var is_pin = res.data.is_pin;
       
        wx.requestPayment({
          "appId": res.data.appId,
          "timeStamp": res.data.timeStamp,
          "nonceStr": res.data.nonceStr,
          "package": res.data.package,
          "signType": res.data.signType,
          "paySign": res.data.paySign,
          'success': function (wxres) {
            
              if (is_pin == 0)
            {
              wx.redirectTo({
                url: '/pages/order/order?id=' + id+'&is_show=1'
              })
            }else {
              wx.redirectTo({
                url: '/pages/share/index?id=' + id
              })
            }

          },
          'fail': function (res) {
            console.log(res);
          }
        })
      }
    })
  }
})