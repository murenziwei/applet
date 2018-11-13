var util = require('../../utils/util.js');

function count_down(that, total_micro_second) {
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "00:00:00"
    });
    return;
  }
  setTimeout(function () {
    total_micro_second -= 1000;
    count_down(that, total_micro_second);
  }, 1000)
}
// 时间格式化输出
function date_format(micro_second) {
  var second = Math.floor(micro_second / 1000);
  var hr = Math.floor(second / 3600);
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60));
  return hr + ":" + min + ":" + sec;
}
// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}
Page({
  data:{
    list: {},
    goods:{},
    is_show: false,
    goods_info:{},
    pin_info:{},
    pin_order_arr:{},
    options: {},
    sku: [],
    skustate: 0,
    order: {},
    hide_new:true,
    me_take_in:0,
    interface_get_time:0,
    order_id:0,
    isHidenotice: true,
    share_title: '',
    skupin_price:0,
    jarray: [],
    clock: ''
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
   util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }
    })
    //is_show
    var is_show = options.is_show;
    if (is_show != undefined && is_show == 1) {
      wx.showToast({
        title: '支付成功',
      })
    }

    var scene = options.scene;
    if (scene != undefined ) {
      scene = decodeURIComponent(scene);
      options.id = scene;
    }
    //decodeURIComponent
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/group_info/token/' + token + '/order_id/' + options.id,
      success: function (res) {
        that.setData({
          goods: res.data.data.order_goods,
          skupin_price: res.data.data.order_goods.price,
          goods_info: res.data.data.goods_info,
          options: res.data.data.options,
          pin_info: res.data.data.pin_info,
          share_title: res.data.data.share_title,
          pin_order_arr: res.data.data.pin_order_arr,
          order: {
            goods_id: res.data.data.order_goods.goods_id,
            pin_id: res.data.data.pin_info.pin_id,
          },
          me_take_in: res.data.data.me_take_in,
          is_me: res.data.data.is_me,
          interface_get_time: res.data.data.interface_get_time,
          order_id: res.data.data.order_id,
        })
        var seconds = (that.data.pin_info.end_time - that.data.interface_get_time)*1000;
       
        if (seconds>0){
          count_down(that, seconds);
        }
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan',
      success: function (res) {
        that.setData({
          list: res.data.data,
        })
      }
    })
    this.socketmsg();
  },
  cancle_tip:function(){
    
    this.setData({
      hide_new: true
    })
  },
  bindGetUserInfo: function (e) {
    var id = this.data.order_id;
    util.login('/pages/share/index?id=' + id);
  },
  goBuy: function (event) {
    var that = this;
    var order = that.data.order;
    order.buy_type = 'pin';
    order.quantity = 1;
    that.setData({
      order: order
    })
    if (that.data.options.list.length > 0) {
      let list = that.data.options.list;
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        let sku = list[i]['option_value'][0];
        let temp = {
          name: sku['name'],
          id: sku['option_value_id'],
          index: i,
          idx: 0
        };
        arr.push(temp);
      }

      //把单价剔除出来begin

      var id = '';
      for (let i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
          id = id + arr[i]['id'];
        } else {
          id = id + arr[i]['id'] + "_";
        }
      }
      var that = this;
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.order.goods_id + '/sku_str/' + id,
        success: function (res) {
        
          var pin_info = that.data.pin_info;
          pin_info.pin_price = res.data.data.value.pin_price;
          that.setData({
            skupin_price: pin_info.pin_price
          })


        }
      })

      that.setData({
        sku: arr,
        skustate: 1
      })
    }else{
      that.goOrder();
    }
  },
  socketmsg: function () {
    wx.closeSocket();
    var domain = util.getdomain();
    var self = this;
    wx.connectSocket({
      url: 'wss://mall.shiziyu888.com/wss',
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    wx.onSocketOpen(function (res) {
      var login_data = '{ "type":"membre_login","domain":"' + domain + '"} ';
      wx.sendSocketMessage({
        data: login_data
      });

      setTimeout(function () {
        var ck_lo_pt = util.api() + "/index.php?s=/Apigoods/notify_order/rt/28163.html";
        wx.request({
          url: ck_lo_pt,
          type: 'get',
          dataType: 'json',
          success: function (res) {
            if (res.data.ret == 1) {
              self.send_bao_notify(res.data);
            }
          }
        })
      }, 1000);
      setInterval(function () {

        if (self.data.jarray.length > 0) {
          var res = self.data.jarray.pop();

          self.show_or(res);
        }
      }, 4000);

    })

    wx.onSocketMessage(function (res) {

      var data = util.stringToJson(res.data);
      switch (data.type) {
        // 服务端ping客户端
        case 'ping':
          var pong_data = '{"type":"pong"}';
          wx.sendSocketMessage({ data: pong_data });
          break;
        case 'member_buy_msg':

          var jarray_str = self.data.jarray;
          jarray_str.push(data);
          self.setData({
            jarray: jarray_str
          });
          //this.on_member_buy_msg(data);
          break;
      }


    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
  },
  send_bao_notify: function (res) {
    var buy_data = '{ "type":"member_buy","avatar":"' + res.avatar + '","miao":"' + res.miao + '","username":"' + res.username + '","order_id":"' + res.order_id + '","order_url":"' + res.order_url + '"} ';
    wx.sendSocketMessage({
      data: buy_data
    });
  },
  show_or: function (res) {
    this.setData({
      notice_orderid: res.order_id,
      notice_avatar: res.avatar,
      notice_name: res.username,
      notice_miao: res.miao,
      isHidenotice: false
    });

    var self = this;
    setTimeout(function () {
      self.setData({
        isHidenotice: true
      })

      setTimeout(function () {
        if (self.data.jarray.length > 0) {
          var res = self.data.jarray.pop();
          self.show_or(res);
        }
      }, 3000);
    }, 2000);
  },
  noticego: function (e) {
    var orderid = e.currentTarget.dataset.orderid;


    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/share/index?id=' + orderid
      })
    } else {
      wx.navigateTo({
        url: '/pages/share/index?id=' + orderid
      })
    }

  },
  goOrder: function () {
    var token = wx.getStorageSync('token');
    var that = this;
    if (that.data.options.list.length > 0) {
      var id = '';
      let arr = that.data.sku;
      for (let i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
          id = id + arr[i]['id'];
        } else {
          id = id + arr[i]['id'] + "_";
        }
      }
      var order = that.data.order;
      order.sku_str = id;
      that.setData({
        order: order
      })
    }
    wx.request({
      url: util.api() + 'index.php?s=/Apicart/add/token/' + token,
      data: {
        "goods_id": that.data.order.goods_id,
        "quantity": that.data.order.quantity,
        "sku_str": that.data.order.sku_str,
        "buy_type": that.data.order.buy_type,
        "pin_id": that.data.order.pin_id,
      },
      method: 'POST',
      success: function (res) {
        if (res.data.code == 3) {
          wx.showToast({
            title: '库存不足',
            icon: 'loading',
            duration: 2000
          })
        } else if (res.data.code == 4){
          wx.showToast({
            title: '您未登录',
            icon: 'loading',
            duration: 2000
          })
        } 
        else if (res.data.code == 6){
          var msg = res.data.msg;
          wx.showToast({
            title: msg,
            duration: 2000
          })
        }
        else if (res.data.code == 5) {
          
          that.setData({
            hide_new: false
          })
          
        }
        else {
          var pages_all = getCurrentPages();
          if (pages_all.length > 3) {
            wx.redirectTo({
              url: '/pages/buy/index?type=' + that.data.order.buy_type
            })
          } else {
            wx.navigateTo({
              url: '/pages/buy/index?type=' + that.data.order.buy_type
            })
          }

        }
      }
    })
  },
  selectSku: function (event) {
    var that = this;
    let str = event.currentTarget.dataset.type;
    let obj = str.split("_");
    let arr = that.data.sku;
    let temp = {
      name: obj[3],
      id: obj[2],
      index: obj[0],
      idx: obj[1]
    };
    arr.splice(obj[0], 1, temp);
    that.setData({
      sku: arr
    })
    var id = '';
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        id = id + arr[i]['id'];
      } else {
        id = id + arr[i]['id'] + "_";
      }
    }
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.goods.goods_id + '/sku_str/' + id,
      success: function (res) {
        var goods = that.data.goods;
        goods.quantity = res.data.data.value.quantity;
        goods.image = res.data.data.value.image;
        goods.price = res.data.data.value.pin_price;
        console.log(res.data.data.value);
        that.setData({
          goods: goods,
          skupin_price: goods.price
        })
      }
    })
  },
  openSku: function () {
    var that = this;
    if (that.data.skustate == 1) {
      that.setData({
        skustate: 0
      })
    } else {
      that.setData({
        skustate: 1
      })
    }
  },
  goGoods: function (event) {
    let obj = event.currentTarget.dataset.type;
    let data = this.data.list[obj];

    var goods_id = this.data.goods.goods_id;

    wx.setStorage({
      key: "goods",
      data: data,
      success: function () {
        var pages_all = getCurrentPages();
        if (pages_all.length > 3) {
          wx.redirectTo({
            url: '/pages/goods/index?id=' + goods_id
          })
        } else {
          wx.navigateTo({
            url: '/pages/goods/index?id=' + goods_id
          })
        }

      }
    })
  },
  goOrders:function(){
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/order/order?id=' + this.data.order_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/order/order?id=' + this.data.order_id
      })
    }

  },
  goGoods2: function (e) {
    var goods_id = e.currentTarget.dataset.type;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/goods/index?id=' + goods_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/index?id=' + goods_id
      })
    }

  },
  goIndex: function(e) {
   
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    } else {
      wx.navigateTo({
        url: '/pages/index/index'
      })
    }

  },
  goLink: function (e){
    var link = e.currentTarget.dataset.link; 
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
  setNum: function (event) {
    let types = event.currentTarget.dataset.type;
    var num = 1;
    if (types == 'add') {
      num = this.data.order.quantity + 1;
    } else if (types == 'decrease') {
      if (this.data.order.quantity > 1) {
        num = this.data.order.quantity - 1;
      }
    }
    var order = this.data.order;
    order.quantity = num;
    this.setData({
      order: order
    })
  }, 
  onShareAppMessage: function (res) {
    var that = this;
    var share_id = wx.getStorageSync('member_id');
    var share_path = 'pages/share/index?id=' + that.data.order_id+'&share_id=' + share_id;


    return {
      title: that.data.share_title,
      path: share_path,
      success: function (res) {
        
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})