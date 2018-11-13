//index.js
var util = require('../../utils/util.js');
Page({
  data: {
    nav: {},
    hidetip:true,
    tablebar:-1,
    menuindex: -1,
    slide: {},
    ad: {},
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tip_html:'^_^已经到底了',
    list: {},
    prolist:[],
    pageNum: 1,
    indexpageNum:0,
    gid:'',
    hasRefesh:false,
    putonghasRefesh:false,
    LoadingComplete:true,
    isHidenotice: true,
    share_title:'',
    show_quan: false,
    quan: [],
    jarray: []
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token')
   
	//options.id "gid": gid, menuindex
	var menuindex = options.menuindex
	
	var gid = options.id;
	this.setData({
		 hidetip: false,
		token: token,
		gid:gid,
		menuindex:menuindex
	})
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/index_share',
      success: function (res) {
        that.setData({
          share_title: res.data.title,
        })
      }
    })

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/get_index_category',
      success: function (res) {
        that.setData({
          nav: res.data.data,
        })
      }
    })

    

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan',
	  data: {
        "gid": gid,
        is_index_show:2
      },
      success: function (res) {

        if( res.data.code == 0 )
        {
          that.setData({
            list: res.data.data,
            hidetip: true
          })
        }else{
          that.loadPutongMore();
        }
        
      }
    })
    
    this.socketmsg();
  },
  goOrderfrom:function(e){
    var goods_id = e.detail.target.dataset.type;

    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
        console.log(res);
      }
    })
    this.goGoods(goods_id);
  },
  goGoods_link:function(e){
    var goods_id = e.currentTarget.dataset.type;
    this.goGoods(goods_id);
  },
  goGoods: function (goods_id) {
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
  get_quan: function (event) {
    let quan_id = event.currentTarget.dataset.quan_id;
    var token = wx.getStorageSync('token');
    var quan_list = this.data.quan;
    var that = this;
    //is_get

    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/getQuan/token/' + token,
      data: { quan_id: quan_id },
      method: 'POST',
      success: function (msg) {
        //1 被抢光了 2 已领过  3  领取成功
        var new_quan = [];
        for (var i in quan_list) {
          if (quan_list[i].id == quan_id) {
            quan_list[i].is_get = 1;
          }
          new_quan.push(quan_list[i]);
        }
        that.setData({
          quan: new_quan
        })
        if (msg.data.code == 1) {
          wx.showToast({
            title: '被抢光了',
          })
        } else if (msg.data.code == 2) {
          wx.showToast({
            title: '已领过',
          })
        } else if (msg.data.code == 3) {
          wx.showToast({
            title: '领取成功',
          })
        }
      }
    })

  },
  goLink: function (event){
    let url = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: url
    })
  },
  goBannlinc: function (event)
  {
    let url = event.currentTarget.dataset.url;
    if (url == '/pages/index/webview')
    {
      var id = event.currentTarget.dataset.id;
      url = url + '?id=' + id;
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
      return false;
    }
    //console.log(pages_all.length);
    if(url =='')
    {
      url = '/pages/index/index';
    }

    var pages_all = getCurrentPages(); 
    if(pages_all.length >3)
    {
      wx.redirectTo({
        url: url
      })
    }else {
      wx.navigateTo({
        url: url
      })
    }
    
  },
  choiceMenu: function (event) {//分类
    let that = this;
    let vid = event.currentTarget.dataset.id;
    let gid = event.currentTarget.dataset.navid;
    
    this.setData({
      menuindex: vid,
      hidetip:true,
      prolist: [],
      indexpageNum:0,
      putonghasRefesh:false,
      hasRefesh:false
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan',
      data: {
        "gid": gid,
        is_index_show:2
      },
      success: function (res) {
        if (res.data.code==1){
          that.setData({
            list: '',
           
            tip_html: '',
            pageNum: 1,
            LoadingComplete: false,
            gid: gid,
            hidetip: false
          })
          that.loadPutongMore();
          /**
          */
        }else{
          
          that.setData({
            list: res.data.data,
            tip_html: '',
            pageNum: 1,
            gid: gid,
            hidetip:true
          })
        }
      }
    })
  },
  loadPutongMore:function(){
    console.log(23);
    //putonghasRefesh
    let that = this;
    if (!that.data.putonghasRefesh) {
      that.setData({
        putonghasRefesh: true
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiindex/wepro_index_goods',
        data: {
          "page": that.data.indexpageNum + 1,
          "gid": that.data.gid
        },
        success: function (res) {
          if (res.data.code == 0) {
            let prolist = that.data.prolist.concat(res.data.list);
            console.log(prolist);

            that.setData({
              prolist: prolist,
              indexpageNum: that.data.indexpageNum + 1,
              putonghasRefesh: false,
              hidetip: true
            });
          } else {
            that.setData({
              LoadingComplete: false,
              tip_html: '^_^已经到底了',
              hidetip: true
            });
            
            /**
           
             */
          }
        }
      })


    }
  },
  loadMore: function () {
    
    let that = this;
    if (!that.data.hasRefesh){
      that.setData({
        hasRefesh: true,
        hidetip:false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan',
        data: {
          "page": that.data.pageNum + 1,
          is_index_show:2,
          "gid": that.data.gid
        },
        success: function (res) {
          if (res.data.code == 0){
            let list = that.data.list.concat(res.data.data);
            that.setData({
              list: list,
              pageNum: that.data.pageNum + 1,
              hasRefesh: false,
              hidetip:true
            });
          }else{
            that.setData({
              LoadingComplete: false,
              hasRefesh: true,
              tip_html: '',
              hidetip: true
            });
            that.loadPutongMore();
            /**
           
             */
          }
        }
      })
    }else{
      that.loadPutongMore();
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
  onShareAppMessage: function (res) {
    var share_title = this.data.share_title;
	var gid = this.data.gid;
	var vid = this.data.menuindex;

  var share_id = wx.getStorageSync('member_id');
  var share_path = 'pages/index/category?id=' + gid + '&menuindex=' + vid + '&share_id=' + share_id;

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
