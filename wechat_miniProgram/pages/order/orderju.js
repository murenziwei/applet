var util = require('../../utils/util.js');
Page({
  data: {
    tablebar: 4,
    navState:0,
	order_all_id:0,
    pingtai_deal:0,
    is_show:false,
    orders: {},
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var is_show_tip = options.is_show;
    
    if (is_show_tip != undefined && is_show_tip ==1 )
    {
      wx.showToast({
        title: '支付成功',
      })
	  //orderju clear cardan
	  wx.request({
      url: util.api() + 'index.php?s=/Apicart/clear_dan_cars/token/' + token ,
      success: function (res) {
	  }
	  })
	  
    }else{
      wx.showLoading();
    }
	var order_all_id = options.id;
    //order_all_id = 75;
    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/order_all_show/token/' + token + '/id/' + order_all_id,
	  //url: util.api() + 'index.php?s=/Apicheckout/order_all_show/token/' + token + '/id/1074',
      success: function (res) {
		 //console.log(res.data.data.order_list);
		 
        that.setData({
		      order_all_id:order_all_id,
          orders: res.data.data.order_list,
		      order_status_info:res.data.data.order_status_info,
          pingtai_deal: [],
          order_refund: [],
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
  goLink: function (event) {
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
      url: util.api() + 'index.php?s=/Apicheckout/wxpay_allorder/token/' + token + '/order_all_id/' + id,
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
            
             
              wx.redirectTo({
                url: '/pages/order/orderju?id=' + id+'&is_show=1'
              })
            

          },
          'fail': function (res) {
            console.log(res);
          }
        })
      }
    })
  }
})