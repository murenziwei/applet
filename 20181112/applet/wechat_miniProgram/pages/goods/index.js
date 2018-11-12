var util = require('../../utils/util.js');
var WxParse = require('../../wxParse/wxParse.js');
function go_new(that)
{
	that.socketmsg();
}
function pintuancount_down(that,cur_time) {
 
  var pintuan = that.data.pintuan;
  
  for(var i in pintuan)
  {
   //end_time_html
    var total_micro_second = (pintuan[i].end_time - cur_time) * 1000;
   
   
    var second = Math.floor(total_micro_second / 1000);
    var days = second / 3600 / 24;
    var daysRound = Math.floor(days);
    var hours = second / 3600 - (24 * daysRound);
    var hoursRound = Math.floor(hours);
    var minutes = second / 60 - (24 * 60 * daysRound) - (60 * hoursRound);
    var minutesRound = Math.floor(minutes);
    var seconds = second - (24 * 3600 * daysRound) - (3600 * hoursRound) - (60 * minutesRound);
    var end_time_html = '';
    if (daysRound >0)
    {
      end_time_html += daysRound+'天';
    }
    if (hoursRound > 0)
    {
      end_time_html += hoursRound + '时';
    }
    if (minutesRound > 0) {
      end_time_html += minutesRound + '分';
    }
   
    end_time_html += seconds + '秒';
    pintuan[i].end_time = pintuan[i].end_time -1;
    pintuan[i].end_time_html = end_time_html;
  }
 
  that.setData({
    pintuan: pintuan
  });
  
  if (total_micro_second <= 0) {
    return;
  }

  setTimeout(function () {
    pintuancount_down(that, cur_time);
  }, 1000)
  
}

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
      show_detail:1
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
  data: {
    navState: 0,
    indicatorDots: false,
    autoplay: true,
    interval: 3000,
    duration: 300,
    goods:{},
    seller_info:{},
    options: {},
    goods_image: {},
    show_menu_nav:1,
    pin_info: {},
    skustate:0,
    can_car:true,
    share_title: '',
    is_login: true,
    isHidenotice: true,
    jarray: [],
    sku: [],
    skj: [],
    skudanprice:0,
    skupin_price:0,
    show_detail:1,
    is_addcar:false,
    endtime: {
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
    },
    order:{},
    service:[{
      "icon":"https://s3.mogucdn.com/p2/161121/upload_804deld49f8i13gb2gdji12k6h9h2_60x60.png",
      "name":"退货补运费"
    },{
      "icon": "https://s3.mogucdn.com/p2/161121/upload_4c9fi653lcljc0ig512il61jh3ljl_60x60.png",
      "name": "全国包邮"
    },{
      "icon": "https://s3.mogucdn.com/p2/161121/upload_69l7gg2aeb5jb1k0g5l785gdhk7g0_60x60.png",
      "name": "7天无理由退货"
    }],
    pintuan:{},
    s_num:0
  },
  onLoad: function (options) {
      var s_num = getApp().globalData.s_num;
    console.log(s_num,"我一开始就加载进来了")
    this.setData({ s_num: s_num });
    var that = this;
    var token = wx.getStorageSync('token');
    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }else{
        this.setData({ is_login: false })
        
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_goods_detail/id/' + options.id + '/token/' + token,
     // url: util.api() + 'index.php?s=/Apigoods/get_goods_detail/id/28',
      success: function (res) {

        //skudanprice: 0,
        //skupin_price:0,

        console.log(res.data.data.seller_info,"111111111111111");
        that.setData({
          order_comment_count: res.data.order_comment_count,
          comment_list: res.data.comment_list,
          goods: res.data.data.goods,
          share_title: res.data.data.goods.share_title,
          options: res.data.data.options,
          seller_info: res.data.data.seller_info,
          goods_image: res.data.data.goods_image,
          pin_info: res.data.data.pin_info,
          lottery_info: res.data.data.lottery_info,
          service: res.data.data.goods.tag,
          favgoods: res.data.data.goods.favgoods,
          cur_time: res.data.data.cur_time,
          order:{
            goods_id: res.data.data.goods.goods_id,
            pin_id: res.data.data.pin_id,
          }
        })
        var seconds =(res.data.data.pin_info.end_time - res.data.data.cur_time)* 1000;
        
        if (seconds > 0) {
          count_down(that, seconds);
        }
        
        var article = res.data.data.goods.description;
        WxParse.wxParse('article', 'html', article, that, 0);
        var summary = res.data.data.goods.summary;
        WxParse.wxParse('summary', 'html', summary, that, 0);
        go_new(that);
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_goods_fujin_tuan/id/' + options.id,
      success: function (res) {
       
        that.setData({
          pintuan: res.data.data
        })
        if (res.data.data.length > 0) {
          pintuancount_down(that, res.data.cur_time);
        }
      }
    })
    //this.socketmsg();
  },
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  gotop: function () {
    wx.pageScrollTo({
      scrollTop: 0,
      duration: 300
    })
  },
  socketmsg: function () {
    wx.closeSocket();

    var domain = util.getdomain();
    var self = this;
    wx.connectSocket({
      url: 'ws://127.0.0.1:8080/ws',
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    wx.onSocketOpen(function (res) {
      var member_id = wx.getStorageSync('member_id');
      console.log(self.data.seller_info,"goods_index");
      if(member_id){
       var login_data = '{ "type":"membre_login","room_id":"'+self.data.seller_info.s_id+'","uid":"'+member_id+'","tip_list":"store_'+self.data.seller_info.s_id+'","domain":"' + domain + '"} ';
    }else{
        var login_data = '{ "type":"membre_login","domain":"' + domain + '"} ';
    }
    
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
      console.log(data);
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
        case 'unread_to_clien':
        getApp().globalData.s_num=data.unread_count;
        console.log(data.unread_count,"unread_to_clien");
        self.setData({
          s_num: data.unread_count,
        });
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
  ck_tab:function(e){
    var rel = e.currentTarget.dataset.rel;
    this.setData({
      show_detail: rel
    })

  },
  goRewardList :function(){
    var goods_id = this.data.order.goods_id;

    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/goods/lotteryinfo?id=' + goods_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/lotteryinfo?id=' + goods_id
      })
    }  
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
  goBuy: function (event) {
    var that = this;
    var buy_type = event.currentTarget.dataset.type;
    var is_car = event.currentTarget.dataset.is_car;

    if( is_car == undefined )
    {
       
      this.setData({
        is_addcar:false
      })
    }else {
      this.setData({
        is_addcar: true
      })
    }

    var order = that.data.order;
    order.buy_type = buy_type;
    order.quantity = 1;
    var skudanprice = this.data.skudanprice;
    var skupin_price = this.data.skupin_price;

    //goods.danprice:pin_info.pin_price
    //order.buy_type=='dan'?goods.danprice:pin_info.pin_price

    if (order.buy_type == 'dan')
    {
      skudanprice = this.data.goods.danprice;
    }else {
      skupin_price = this.data.pin_info.pin_price;
    }
    //skudanprice:skupin_price

    this.setData({
      order: order,
      skudanprice: skudanprice,
      skupin_price: skupin_price
    })
 
    if (that.data.options.list.length>0){
      let list = that.data.options.list;
      let arr = [];
      let sku = [];
      for (let i = 0; i < list.length; i++) {
        let status = 0;
        let skj = list[i]['option_value'];
        console.log(skj);
        for (let j = 0; j < skj.length; j++){
          console.log(skj[j]);
          if (skj[j]['class_status'] == ''){
            sku = skj[j];
            status = j;
            break;
          }
        }
        
        let temp = {
          name: sku['name'],
          id: sku['option_value_id'],
          index: i,
          idx: status
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
        url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.goods.goods_id + '/sku_str/' + id,
        success: function (res) {
          var options = that.data.options
          for (let k in res.data.data.focus) {
            for (let i = 0; i < options.list.length; i++) {
              for (let j = 0; j < options.list[i].option_value.length; j++) {
                if (options.list[i].option_value[j].option_value_id == res.data.data.focus[k].id) {
                  options.list[i].option_value[j].class_status = res.data.data.focus[k].class_status == 0 ? '' : 'is-disable'
                }
              }
            }
          }
          for (let l = 0; l < res.data.data.one.length; l++) {
            console.log(res.data.data.one[l], 123)
            for (let m = 0; m < options.list.length; m++) {
              for (let n = 0; n < options.list[m].option_value.length; n++) {
                if (options.list[m].option_value[n].option_value_id == res.data.data.one[l].id) {
                  options.list[m].option_value[n].class_status = res.data.data.one[l].class_status == 0 ? '' : 'is-disable'
                }
              }
            }
          }
          that.setData({
            options: options
          })
          console.log(res.data.data)


          if (that.data.options.list.length > 0 && res.data.data.str_array) {
            let list = that.data.options.list;
            let arr = [];
            let sku = [];
            for (let i = 0; i < list.length; i++) {
              let status = 0;
              let skj = list[i]['option_value'];
              console.log(skj);
              for (let j = 0; j < skj.length; j++) {
                for (let m = 0; m < res.data.data.str_array.length; m++) {
                  // console.log(res.data.data.str_array[m])
                  // console.log(skj[j]['option_value_id'], res.data.data.str_array[m], skj[j]['class_status'] == '' && skj[j]['option_value_id'] == res.data.data.str_array[m])
                  if (skj[j]['class_status'] == '' && skj[j]['option_value_id'] == res.data.data.str_array[m]) {
                    sku = skj[j];
                    status = j;
                    break;
                  }
                }
              }
              let temp = {
                name: sku['name'],
                id: sku['option_value_id'],
                index: i,
                idx: status
              };
              arr.push(temp);

            }
            that.setData({
              sku: arr
            })
          }
          var goods = that.data.goods;
          console.log(111111111111111111111111111111111111111111)
          goods.quantity = res.data.data.value.quantity;
          goods.image = res.data.data.value.image;
          goods.danprice = res.data.data.value.dan_price;

          that.setData({
            goods: goods,
            skudanprice: goods.danprice
          })
          var pin_info = that.data.pin_info;
          pin_info.pin_price = res.data.data.value.pin_price;
          that.setData({
            pin_info: pin_info,
            skupin_price: pin_info.pin_price
          })


        }
      })

      //end
      that.setData({
        sku: arr,
        skustate: 1
      })
    }else{
      that.goOrder();
    }
  },
  closeSku:function()
  {
    this.setData({
      skustate: 0
    })
   
  },
  goOrderfrom: function (e){
    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
       console.log(res);
      }
    })
    this.goOrder();

  },
  goOrder:function(){
    
    var token = wx.getStorageSync('token');
    var that = this;
    if (that.data.can_car)
    {
      that.data.can_car = false;
    }
    var is_just_addcar = 0;
    if (that.data.is_addcar )
    {
      is_just_addcar = 1;
    }

    if (that.data.options.list.length > 0){
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
        "is_just_addcar": is_just_addcar
      },
      method: 'POST',
      success: function (res) {
        //console.log(res);
        if (res.data.code == 3) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else if (res.data.code == 4) {
          wx.showToast({
            title: '您未登录',
            icon: 'loading',
            duration: 2000
          })
        }
        else if (res.data.code == 6) {
          var msg = res.data.msg;
          wx.showToast({
            title: msg,
            icon:'none',
            duration: 2000
          })
        }
         else {

          if (is_just_addcar == 1)
          {
            that.closeSku();
            wx.showToast({
              title: '加入购物车成功',
              duration: 2000
            })
          }else{
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
      }
    })
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
  goShare: function (event) {
    let id = event.currentTarget.dataset.type;
    var pages_all = getCurrentPages();

    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/share/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/share/index?id=' + id
      })
    }

  },
  goLink: function (event) {
    let link = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },
  bindGetUserInfo: function (e) {
    var id = this.data.goods.goods_id;
    util.login('/pages/goods/index?id=' + id);
    this.setData({ is_login: true })
  },
  go_goods_comment:function(){
    var goods = this.data.goods;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/goods/comment?id=' + goods.goods_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/comment?id=' + goods.goods_id
      })
    }

  },
  gokefu:function(){
    
    var goods = this.data.goods;
    var seller_info = this.data.seller_info;
  
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/im/index?id=' + seller_info.s_id + '&goods_id=' + goods.goods_id
      })
    } else {
      wx.navigateTo({
        url: '/pages/im/index?id=' + seller_info.s_id + '&goods_id=' + goods.goods_id
      })
    }

  },
  goStore: function (event) {
    let id = event.currentTarget.dataset.type;
   
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: '/pages/store/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '/pages/store/index?id=' + id
      })
    }

  },
  openSku: function (event){

    var that = this;
    var buy_type = event.currentTarget.dataset.type;
    var order = that.data.order;
    order.buy_type = buy_type;
    order.quantity = 1;
    var skudanprice = this.data.skudanprice;
    var skupin_price = this.data.skupin_price;

    if (order.buy_type == 'dan') {
      skudanprice = this.data.goods.danprice;
    } else {
      skupin_price = this.data.pin_info.pin_price;
    }
    //skudanprice:skupin_price

    this.setData({
      order: order,
      skudanprice: skudanprice,
      skupin_price: skupin_price
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
        url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.goods.goods_id + '/sku_str/' + id,
        success: function (res) {
          var goods = that.data.goods;
          goods.quantity = res.data.data.value.quantity;
          goods.image = res.data.data.value.image;
          goods.danprice = res.data.data.value.dan_price;

          that.setData({
            goods: goods,
            skudanprice: goods.danprice
          })
          var pin_info = that.data.pin_info;
          pin_info.pin_price = res.data.data.value.pin_price;
          that.setData({
            pin_info: pin_info,
            skupin_price: pin_info.pin_price
          })


        }
      })

      //end
      that.setData({
        sku: arr,
        skustate: 1
      })
    } else {
      that.goOrder();
    }


    
  },
  selectSku: function (event){
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
    console.log(1);
    console.log(that.data.options);
    console.log(temp);
    arr.splice(obj[0], 1, temp);
    that.setData({
      sku: arr
    })
    var id = '';
    for(let i=0;i<arr.length;i++){
      if (i == arr.length-1){
        id = id + arr[i]['id'];
      }else{
        id = id + arr[i]['id']+"_";
      }
    }
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.goods.goods_id +'/sku_str/' + id,
      success: function (res) {
        var options = that.data.options
        for(let k in res.data.data.focus){
          for(let i=0;i<options.list.length;i++){
            for(let j=0;j<options.list[i].option_value.length;j++){
              if (options.list[i].option_value[j].option_value_id == res.data.data.focus[k].id){
                options.list[i].option_value[j].class_status = res.data.data.focus[k].class_status == 0 ? '' :'is-disable'
              }
            }
          }
        }
        for(let l=0;l<res.data.data.one.length;l++){
          console.log(res.data.data.one[l],123)
          for (let m = 0; m < options.list.length; m++) {
            for (let n = 0; n < options.list[m].option_value.length; n++) {
              if (options.list[m].option_value[n].option_value_id == res.data.data.one[l].id) {
                options.list[m].option_value[n].class_status = res.data.data.one[l].class_status == 0 ? '' : 'is-disable'
              }
            }
          }
        }
        that.setData({
          options: options
        })
        console.log(res.data.data)


        if (that.data.options.list.length > 0 && res.data.data.str_array) {
          let list = that.data.options.list;
          let arr = [];
          let sku = [];
          for (let i = 0; i < list.length; i++) {
            let status = 0;
            let skj = list[i]['option_value'];
            console.log(skj);
            for (let j = 0; j < skj.length; j++) {
              for (let m = 0; m < res.data.data.str_array.length; m++) {
                // console.log(res.data.data.str_array[m])
                  // console.log(skj[j]['option_value_id'], res.data.data.str_array[m], skj[j]['class_status'] == '' && skj[j]['option_value_id'] == res.data.data.str_array[m])
                if (skj[j]['class_status'] == '' && skj[j]['option_value_id'] == res.data.data.str_array[m]) {
                  sku = skj[j];
                  status = j;
                  break;
                }
              }
            }
            let temp = {
              name: sku['name'],
              id: sku['option_value_id'],
              index: i,
              idx: status
            };
            arr.push(temp);

          }
          that.setData({
            sku: arr
          })
        }

        var goods = that.data.goods;
        goods.quantity = res.data.data.value.quantity;
        goods.image = res.data.data.value.image;
        goods.danprice = res.data.data.value.dan_price;
        that.setData({
          goods: goods,
          skudanprice: goods.danprice
        })
        var pin_info = that.data.pin_info;
        pin_info.pin_price = res.data.data.value.pin_price;
        that.setData({
          pin_info: pin_info,
          skupin_price: pin_info.pin_price
        })
      }
    })
  },
  favtoggle:function(){
    let that = this;
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/fav_toggle/goods_id/' + that.data.goods.goods_id+'/token/'+token,
      success: function (res) {
        that.setData({
          favgoods: res.data.code
        })
        
      }
    })
  },
  onShareAppMessage: function (res) {
    var share_title = this.data.share_title;
    var share_id = wx.getStorageSync('member_id');

    var share_path = 'pages/goods/index?id=' + this.data.goods.goods_id+'&share_id=' + share_id;

    return {
      title: share_title,
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