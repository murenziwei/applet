//index.js
var util = require('../../utils/util.js');
function go_new(that)
{
	that.socketmsg();
}
Page({
  data: {
    nav: {},
    hidetip:true,
    scrollTop:0,
    tablebar:1,
    menuindex: -1,
    slide: {},
    ad: {},
    is_login: true,
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tip_html:'^_^已经到底了',
    list: {},
    listtwo: {},
    prolist:[],
    pageNum: 1,
    indexpageNum:0,
    gid:0,
    hasRefesh:false,
    putonghasRefesh:false,
    LoadingComplete:true,
    isHidenotice: true,
    share_title:'',
    show_quan: false,
    quan: [],
    jarray: [],
    s_num: 0,
    types:0,
    typetwo:0,
    member_info:[],
  },

  onLoad: function (options) {
    //getApp().globalData.s_num = "12345";
    var s_num = getApp().globalData.s_num;
    console.log(getApp().globalData.s_num, "666666666666");
    this.setData({ s_num: s_num });
    var that = this;

    var token = wx.getStorageSync('token');
    console.log(123123123);
    
    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
        console.log(resolve, 123456)
      } else {
        this.setData({ is_login: false })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_user_info/token/' + token,
      method: 'get',
      success: function (res) {
          console.log(res,"PPPPPPPPPPPPPPP");
          
        that.setData({
            member_info: res.data.data,
          is_yue_open: res.data.is_yue_open,
          is_open_commiss: res.data.is_open_commiss
        });
        console.log(that.data.member_info,"KKKKKKKKKKKK");
        go_new(that);
        //this.socketmsg();
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/per_page/12/is_index_show/1/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {
        if (res.data.code == 0) {
          if (res.data.data.length > 0) {
            that.setData({
              showguess: false,
              guessdata: res.data.data
            });
          }
        }


      }
    })


    var token = wx.getStorageSync('token');
   util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      } else {
        this.setData({ is_login: false })
      }
    })
    that.setData({
      hidetip: false,
      token: token
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
      url: util.api() + 'index.php?s=/Apigoods/get_seller_quan',
      success: function (res) {
        var show_quan = false;
        if (res.data.quan_list != undefined && res.data.quan_list.length > 0) {
          show_quan = true;
        }

        that.setData({
          show_quan: show_quan,
          quan: res.data.quan_list,
        })
      }
    })

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/types/index',
      success: function (res) {

        if( res.data.code == 0 )
        {
          that.setData({
            list: res.data.data,
            hidetip: true,
            types:1,
          })
          if (res.data.data.length < 10)
          {
            that.loadPutongMore();
          }
        }else{
          that.loadPutongMore();
        }
        
      }
    })

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/types/indexs/type/newman/is_index_show/2',
      success: function (res) {

        if (res.data.code == 0) {
          that.setData({
            listtwo: res.data.data,
            hidetip: true,
            typetwo: 1,
          })
          if (res.data.data.length < 10) {
            that.loadPutongMore();
          }
        } else {
          that.loadPutongMore();
        }

      }
    })

    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata',
      data: {
        "type": 'index_wepro_iconnav',
      },
      success: function (res) {
        that.setData({
          iconnav: res.data.data,
        })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata',
      data: {
        "type": 'index_wepro_head',
      },
      success: function (res) {
        that.setData({
          slide: res.data.data,
        })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata',
      data: {
        "type": 'index_wepro_line',
      },
      success: function (res) {
        that.setData({
          ad: res.data.data,
        })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata',
      data: {
        "type": 'index_wepro_ziying_line',
      },
      success: function (res) {
        that.setData({
          ad_line: res.data.data,
        })
      }
    })
    
    
  },
  imageLoad: function (e) { 
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  imageLoad2: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth2: imageSize.imageWidth,
      imageheight2: imageSize.imageHeight
    })
  },
  imageLoad3: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth3: imageSize.imageWidth,
      imageheight3: imageSize.imageHeight
    })
  },
  bindGetUserInfo: function (e) {
    var id = e.currentTarget.dataset.type;
    util.login('/pages/goods/index?id=' + id);
    this.setData({ is_login: true })
  },
  bindGetUserInfos: function (e) {
    util.login('/pages/index/index');
    this.setData({ is_login: true })
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
        }else if(msg.data.code == 4)
        {
          wx.showToast({
            title: msg.data.msg,
            icon:'none'
          }) 
        }
         else if (msg.data.code == 3) {
          wx.showToast({
            title: '领取成功',
          })
        }
      }
    })

  },
  goLink2: function (event){
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
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
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
      hidetip: true,
      prolist: [],
      indexpageNum: 0,
      putonghasRefesh: false,
      hasRefesh: false
    })
    
    this.setData({
      scrollTop:0
    })
   
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan',
      data: {
        "gid": gid,
        is_index_show: 2,
        "types": 'index'
      },
      success: function (res) {
        if (res.data.code == 1) {
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
        } else {

          that.setData({
            list: res.data.data,
            tip_html: '',
            pageNum: 1,
            gid: gid,
            hidetip: true
          })
          if (res.data.data.length < 10) {
            that.loadPutongMore();
          }
        }
      }
    })

  },
  loadPutongMore:function(){
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
          "gid": that.data.gid,
          
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
    var member_info=self.data.member_info;
      console.log(member_info,"++++++++++++++++++++++++");
    wx.connectSocket({
      url: 'ws://127.0.0.1:8080/wss',
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    
    wx.onSocketOpen(function (res) {
      if(member_info){
            var login_data = '{ "type":"membre_login","uid":"'+member_info.member_id+'","tip_list":"user_'+member_info.member_id+'","domain":"' + domain + '"} ';
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
            self.setData({
              s_num: data.unread_count
            });
            break;
        case 'seller_sayto_client':
            getApp().globalData.s_num=data.unread_count;
            self.setData({
              s_num: data.unread_count
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
    //share_id
    var share_id = wx.getStorageSync('member_id');
    
    var share_path = 'pages/index/index?share_id=' + share_id;
   
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
