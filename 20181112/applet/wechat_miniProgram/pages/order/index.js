var util = require('../../utils/util.js');
Page({
  data: {
    tablebar: 4,
    page:1,
    order_status:-1,
    no_order:0,
    hide_tip:true,
    order:{},
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var order_status = options.order_status;
    console.log(order_status);
    if(order_status == undefined)
    {
      order_status = -1;
    }
    this.setData({
      order_status: order_status,
    })


    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/orderlist/token/' + token + '/page/' + that.data.page + '/order_status/' + order_status,
      success: function (res) {
        if(res.data.code ==1)
        {
          that.guess_goods();
          that.setData({
            hide_tip: false
          })
        }
        that.setData({
          order: res.data.data,
          isHideLoadMore:true
        })
      }
    })
  },
  onReachBottom: function () {
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();

    this.setData({
      isHideLoadMore: false
    })

  }, 
  gotop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  goGoods: function (event) {
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
  getData: function () {
    this.setData({
      isHideLoadMore: true
    })

    this.data.no_order = 1
    let that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/orderlist/token/' + token + '/page/' + that.data.page + '/order_status/' + that.data.order_status,
      success: function (res) {

         if (res.data.code == 0) {
          var agoData = that.data.order;
          var goods = res.data.data;

          goods.map(function (good) {
            agoData.push(good);
          });
          that.setData({
            order: agoData,
            hide_tip: true,
            'no_order': 0
          });

        } else {
          that.setData({
            isHideLoadMore: true
          })
          return false;
        }

      }
    })
    
  }, 
  expressOrder: function (event){
    let order_id = event.currentTarget.dataset.type;
  
    wx.navigateTo({
      url: "/pages/order/goods_express?id=" + order_id
    })
  },
  goLink:function(event){
    let link = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },
  goLink2: function (event) {
    let link = event.currentTarget.dataset.link;

    var pages_all = getCurrentPages();
    console.log(pages_all);
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
  goOrder: function (event) {
    let id = event.currentTarget.dataset.type;
    
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/order/order?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?id=' + id
      })
    }

  },
  receivOrder: function(event){
    let id = event.currentTarget.dataset.type;
    var token = wx.getStorageSync('token');
    var that = this;
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/receive_order/token/' + token + '/order_id/' + id,
      success: function (res) {
        if(res.data.code == 0)
        {
          wx.showToast({
            title: '收货成功',
            icon: 'success',
            duration: 1000
          })
          that.order(that.data.order_status);
        }
      }
    })
  },
  cancelOrder: function (event){
    let id = event.currentTarget.dataset.type;
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/cancel_order/token/' + token + '/order_id/' + id,
      success: function (res) {
        wx.showToast({
          title: '取消成功',
          icon: 'success',
          duration: 1000
        })
        that.order(that.data.order_status);
      }
    })
  },
  getOrder: function (event) {
    let starus = event.currentTarget.dataset.type;
    this.order(starus);
  },
  order: function (starus){
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      order_status: starus,
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/orderlist/token/' + token + '/page/1/order_status/' + starus,
      success: function (res) {
        
        if (res.data.code == 1) {
          that.guess_goods();
          that.setData({
            order: '',
            hide_tip: false,
            isHideLoadMore:true
          })
        } else {
          that.setData({
            hide_tip: true,
            isHideLoadMore:true,
            order: res.data.data,
          })
        }
      }
    })
  },
  guess_goods: function () {
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/per_page/8/is_index_show/1/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {

        if (res.data.data.length > 0) {
          that.setData({
            showguess: false,
            guessdata: res.data.data
          });
        }
      }
    })
  },
  orderComment: function (event){
    var that = this;
    var token = wx.getStorageSync('token');
    let order_id = event.currentTarget.dataset.type;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/order/comment?id=' + order_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/comment?id=' + order_id
      })
    }

  },
  orderPay: function (event){
    var that = this;
    var token = wx.getStorageSync('token');
    let id = event.currentTarget.dataset.type;
    var is_pin = event.currentTarget.dataset.is_pin;

    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/wxpay/token/' + token + '/order_id/' + id,
      success: function (res) {
        wx.requestPayment({
          "appId": res.data.appId,
          "timeStamp": res.data.timeStamp,
          "nonceStr": res.data.nonceStr,
          "package": res.data.package,
          "signType": res.data.signType,
          "paySign": res.data.paySign,
          'success': function (wxres) {
          
            if (is_pin == 0) {
              wx.reLaunch({
                url: '/pages/order/order?id=' + id
              })
            } else {
              wx.reLaunch({
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