var util = require('../../utils/util.js');
Page({
  data: {
    tablebar: 4,
    page: 1,
    order_status: 0,
    no_order: 0,
    hide_tip:true,
    tisp:'正在加载',
    order: {},
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var order_status = options.order_status;
 
    if (order_status == undefined) {
      order_status = 0;
    }
    this.setData({
      order_status: order_status,
    })

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/group_orders/token/' + token + '/page/' + that.data.page + '/type/' + order_status,
      success: function (res) {
        if(res.data.code == 1)
        {
          that.setData({
            isHideLoadMore: true,
            hide_tip: false
          })
         
          that.guess_goods();
        }else{
          that.setData({
            order: res.data.data,
            hide_tip: true
          })
        }
        
      }
    })
  },
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: url
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
  onReachBottom: function () {
    if (this.data.no_order == 1) return false;
    this.data.page += 1;
    this.getData();

    this.setData({
      isHideLoadMore: false
    })

  },
  getData: function () {
    this.setData({
      isHideLoadMore: true
    })

    this.data.no_order = 1
    let that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/group_orders/token/' + token + '/page/' + that.data.page + '/type/' + that.data.order_status,
      success: function (res) {
        if (res.data.code == 0) {
          var agoData = that.data.order;
          var goods = res.data.data;

          goods.map(function (good) {
            agoData.push(good);
          });
          that.setData({
            order: agoData,
            'no_order': 0,
            isHideLoadMore: true
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
  cancelOrder: function (event) {
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
  order: function (starus) {
    var that = this;
    var token = wx.getStorageSync('token');
    that.setData({
      order_status: starus,
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/group_orders/token/' + token + '/page/1/type/' + starus,
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            order: '',
            hide_tip:false,
            isHideLoadMore:true
          })
          that.guess_goods();
        } else {
          
          that.setData({
            order: res.data.data,
            hide_tip: true,
            isHideLoadMore: true
          })
        }
      }
    })
  },
  guess_goods:function(){
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
  orderPay: function (event) {
    var that = this;
    var token = wx.getStorageSync('token');
    let id = event.currentTarget.dataset.type;
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
            
            var pages_all = getCurrentPages();
            if (pages_all.length > 3) {
              wx.reLaunch({
                url: '/pages/share/index?id=' + id
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