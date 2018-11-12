var util = require('../../utils/util.js');
Page({
  data: {
    tablebar: 4,
    page:1,
    size:4,
    gid:0,
    keyword:'',
    hasRefesh:false,
    order_status:-1,
    show_quan:false,
    seller_id:0,
    isHideLoadMore:true,
    no_order:0,
    isHidecate:true,
    isHidenotice:true,
    order_by:'default',
    share_title:'',
    quan:[],
    cur_nav:1,
    goods:[],
    order:{},
    seller: {},
    jarray: []
  },
  onLoad: function (options) {
    var that = this;
    this.data.jarray = [];
    

    this.data.seller_id = options.id;
     wx.request({
       url: util.api() + 'index.php?s=/Apigoods/seller_info/id/' + options.id,
        success: function (res) {
          console.log(res.data.data.quan_list == undefined);
          var show_quan =false;
          if (res.data.data.quan_list != undefined && res.data.data.quan_list.length > 0)
          {
            show_quan = true;
          }
          that.setData({
            show_quan: show_quan,
            seller: res.data.data,
            quan:res.data.data.quan_list,
            share_title: res.data.data.s_true_name,
            
          })
          //share_title
        }
      })

     this.socketmsg();
     
    this.setData({
      page:1
    })
     this.getData();

  },
  get_quan: function (event){
    let quan_id = event.currentTarget.dataset.quan_id;
    var token = wx.getStorageSync('token');
    var quan_list = this.data.quan;
    var that = this;
    //is_get

    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/getQuan/token/' + token,
      data: { quan_id: quan_id},
      method: 'POST',
      success: function (msg) {
        //1 被抢光了 2 已领过  3  领取成功
        var new_quan =[];
        for (var i in quan_list)
        {
          if (quan_list[i].id == quan_id)
          {
            quan_list[i].is_get = 1;
          }
          new_quan.push(quan_list[i]);
        }
        that.setData({
          quan: new_quan
        })
        if(msg.data.code ==1)
        {
          wx.showToast({
            title: '被抢光了',
          })
        } else if (msg.data.code == 2)
        {
          wx.showToast({
            title: '已领过',
          })
        } else if (msg.data.code == 3){
          wx.showToast({
            title: '领取成功',
          })
        }
      }
    })

  },
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: url
      })
    } else {
      wx.navigateTo({
        url: url
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
    var page = this.data.page;
    var gid = this.data.gid;
    var order_by = this.data.order_by;
    var pre_page = this.data.size;
    var seller_id = this.data.seller_id;
    var keyword = this.data.keyword;

    var url = util.api() + 'index.php?s=/Apigoods/seller_goods_list';
    var data = {
      "page": page,
      "gid": gid,
      "keyword": keyword,
      "seller_id": seller_id,
      "pre_page": pre_page,
      "order_by": order_by
    };
    
    var self = this;
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: function (data) {
        if (data.data.code == 0) {
          var agoData = self.data.goods;
          var goods = data.data.data;

          goods.map(function (good) {
            agoData.push(good);
          });
          self.setData({
            goods: agoData,
            'no_order':0
          });
         
        } else {
          self.setData({
            isHideLoadMore: true
          })
          return false;
        }
      }
    });
  }, 
  loaded: function () {
    
    this.setData({ no_order: 1 });
  },
  searchbtn:function(e){
    var sear_word = e.detail.value;
    this.setData({
      keyword: sear_word,
      gid:0,
      goods: []
    });
    this.page = 1;
    this.getData();
  },
  noticego:function(e){
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
  goback:function(){
    wx.navigateBack();
  },
  cateClick:function(e){
    var gid= e.currentTarget.dataset.gid;

    this.setData({
      gid: gid,
      page:1,
      goods: []
    });
    
    this.getData();
  },
  navClick: function (e) {
    this.setData({
      cur_nav: e.currentTarget.dataset.cur_nav
    });
    var cur_nav = e.currentTarget.dataset.cur_nav;

    if (cur_nav == 4) {
      this.setData({
        isHidecate: false
      });
      return false;
    }
    this.setData({
      isHidecate: true
    });
    if (cur_nav == 1)
    {
      this.setData({
        order_by: 'default'
      });
    } else if (cur_nav == 2){
      this.setData({
        order_by: 'hot'
      });
    } else if (cur_nav == 3) {
      this.setData({
        order_by: 'new'
      });
    }
    this.setData({
      goods: [],
      gid:0,
      page:1
    });
   
   // this.page = 1;
    this.getData();
  },
   socketmsg:function()
   {
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
        } );

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
        setInterval(function(){
          
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
            wx.sendSocketMessage({data:pong_data});
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
   send_bao_notify: function (res)
  {
     var buy_data = '{ "type":"member_buy","avatar":"' + res.avatar + '","miao":"' + res.miao + '","username":"' + res.username + '","order_id":"' + res.order_id + '","order_url":"' + res.order_url + '"} ';
    wx.sendSocketMessage({
      data: buy_data
    });
  },
   show_or:function (res)
	{
     this.setData({
       notice_orderid: res.order_id,
       notice_avatar: res.avatar,
       notice_name: res.username,
       notice_miao: res.miao,
       isHidenotice: false
     });
  
    var self = this;
    setTimeout(function(){
      self.setData({
        isHidenotice: true
      })
     
      setTimeout(function(){
        if (self.data.jarray.length > 0) {
         var res = self.data.jarray.pop();
         self.show_or(res);
       }
     }, 3000);
   }, 2000);
	},
hidenoticeorder:function()
{
 

},
  onShareAppMessage: function (res) {
    var share_title = this.data.share_title;
    var id = this.data.seller_id ;
    return {
      title: share_title,
      path: 'pages/store/index?id=' + id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
   on_member_buy_msg:function(data){
     this.data.jarray.push(data);
   }
})