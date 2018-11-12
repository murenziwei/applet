var util = require('../../utils/util.js');
var wxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    tablebar: 4,
    page:1,
    size:4,
    gid:0,
    keyword:'',
    hasRefesh:false,
    order_status:-1,
    seller_id:0,
    is_goods:true,
    seller_info:[],
    isHideLoadMore:true,
    no_order:0,
    isHidecate:true,
    isHidenotice:true,
    order_by:'default',
    inpu_val:'',
    cur_nav:1,
    member_id:0,
    cur_page:0,
    goods_id:0,
    member_info:{},
    max_cont:0,
    toView:'',
    can_page_load:true,
    tips_more:'下拉加载更多',
    goods:[],
    msglist:[],
    order:{},
    seller: {},
    jarray: []
  },
  onLoad: function (options) {
    var that = this;
    this.data.jarray = [];
    this.data.seller_id = options.id;
    this.data.goods_id = options.goods_id;
    if(options.goods_id != undefined)
    {
      this.setData({
        is_goods: false
      });
    }
    //var that = this;
    // console.log(wxParse.realWindowWidth);
    // var temp = wxParse.wxParse('article', 'html', that.data.article, that, 5);
    // that.setData({
    //   article: temp
    // })
    getApp().globalData.s_num=0;
    getApp().globalData.store_id=options.id;
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/seller_info/id/' + options.id,
      method: 'get',
      success: function (res) {
        that.setData({
          seller_info: res.data.data
        });
      }
    })

    //seller_info
    if (this.data.goods_id >0)
    {
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/get_goods_simple/id/' + options.goods_id,
        method: 'get',
        success: function (res) {
          that.setData({
            goods: res.data.data
          });
         
        }
      })
    }

    var token = wx.getStorageSync('token');
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_user_info/token/' + token,
      method: 'get',
      success: function (res) {
        that.setData({
          member_info: res.data.data
        });
        that.socketmsg();
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
  getData: function () {
    
  }, 
  choseImg:function(){
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        
        wx.uploadFile({
          url: util.api() + "/index.php?s=/Apigoods/upload_image", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'name': tempFilePaths[0]
          },
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            
            var image_thumb = data.image_thumb;
            var orign_image = data.image;
           
            //do something
            self.sendImgMsg({ image_thumb: image_thumb, orign_image: orign_image});
          }
        })
      }
    })
  },
  sendGoodsLink:function()
  {
    var user_info = this.data.member_info;
    var seller_id = this.data.seller_id;
    var goods = this.data.goods; 
    var chat_data = '{ "type":"say", "goods_price":"' + goods.price + '","goods_image":"' + goods.image + '","goods_name":"' + goods.name + '","is_goods":"1","content":"","content_type":"goods","avatar":"' + user_info.avatar + '","user_name":"' + user_info.name + '","uid":"'+user_info.member_id+'","from":"'+seller_id+'","room_id":' + seller_id + '} ';
    var chat_data2 = '{ "type":"client_sayto_seller", "goods_price":"' + goods.price + '","goods_image":"' + goods.image + '","goods_name":"' + goods.name + '","is_goods":"1","content":"","content_type":"goods","avatar":"' + user_info.avatar + '","user_name":"' + user_info.name + '","room_id":' + seller_id + '} ';
    wx.sendSocketMessage({ data: chat_data });

    var t_msglist = this.data.msglist;
    var send_msg=JSON.parse(chat_data2);
    console.log(send_msg);
//    let that=this;
    wxParse.wxParse('msglist', 'html', send_msg.message, this);
    let msglist=this.data.msglist;
//    console.log(msglist,"22222");
     msglist.nodes[0].avatar=send_msg.avatar;
     msglist.nodes[0].content_type=send_msg.content_type;
     msglist.nodes[0].goods_image=send_msg.goods_image;
     msglist.nodes[0].goods_name=send_msg.goods_name;
     msglist.nodes[0].goods_price=send_msg.goods_price;
     msglist.nodes[0].image=send_msg.image;
     msglist.nodes[0].type=send_msg.type;
     msglist.nodes[0].sent=send_msg.sent;
     msglist.nodes[0].message=send_msg.message;
    t_msglist.push(msglist.nodes);
    //t_msglist.push(JSON.parse(chat_data2));

    var toview = 'msg' + (t_msglist.length - 1);
    // for (let i = 0; i < t_msglist.length; i++) {
    // wxParse.wxParse('icnolist', 'html', t_msglist[i].message, this, 5);
    // }
    this.setData({
      msglist: t_msglist,
      toView: toview
    })

  },
  loadmorepages:function()
  {
    var user_info = this.data.member_info;  
    var cur_page = this.data.cur_page;
    var seller_id = this.data.seller_id;
    
    var login_data = '{ "type":"get_client_page","page":' + cur_page + ',"uid":' + user_info.member_id+',"room_id":"' + seller_id+'"} ';
    wx.sendSocketMessage({ data: login_data });
   
  },
  sendImgMsg:function(data){
    
    var user_info = this.data.member_info;
    var seller_id = this.data.seller_id;
   
    var content = '';

    var chat_data = '{ "type":"say", "orign_image":"' + data.orign_image + '","image":"' + data.image_thumb + '","is_goods":"0","content":"' + content + '","send_type":"user_'+user_info.member_id+'_room_'+seller_id+'","content_type":"image","avatar":"' + user_info.avatar + '","user_name":"' + user_info.name + '","uid":' + user_info.member_id+',"room_id":' + seller_id + '} ';
    var chat_data2 = '{ "type":"client_sayto_seller", "orign_image":"' + data.orign_image + '","image":"' + data.image_thumb + '","is_goods":"0","content":"' + content + '","content_type":"image","avatar":"' + user_info.avatar + '","user_name":"' + user_info.name + '","room_id":' + seller_id + '} ';

    wx.sendSocketMessage({ data: chat_data });
    
    var t_msglist = this.data.msglist;
    var send_msg=JSON.parse(chat_data2);
    console.log(send_msg);
//    let that=this;
    wxParse.wxParse('msglist', 'html', send_msg.message, this);
    let msglist=this.data.msglist;
//    console.log(msglist,"22222");
     msglist.nodes[0].avatar=send_msg.avatar;
     msglist.nodes[0].content_type=send_msg.content_type;
     msglist.nodes[0].goods_image=send_msg.goods_image;
     msglist.nodes[0].goods_name=send_msg.goods_name;
     msglist.nodes[0].goods_price=send_msg.goods_price;
     msglist.nodes[0].image=send_msg.image;
     msglist.nodes[0].type=send_msg.type;
     msglist.nodes[0].sent=send_msg.sent;
     msglist.nodes[0].message=send_msg.message;
    t_msglist.push(msglist.nodes);
    //t_msglist.push(JSON.parse(chat_data2));
    console.log(t_msglist,"11111111");
    var toview = 'msg' + (t_msglist.length - 1);

    this.setData({
      msglist: t_msglist,
      toView: toview
    })

  },
  loaded: function () {
    
  },
  searchbtn:function(e){
    var sear_word = e.detail.value;
    this.setData({
      keyword: sear_word,
      goods: []
    });
    this.page = 1;
    this.getData();
  },
   socketmsg:function()
   {
    wx.closeSocket();
      var domain = util.getdomain();
      var self = this;
      var seller_id = this.data.seller_id;
      var user_info = this.data.member_info;
      console.log(user_info,"88888888888888888888888888888888");
     //wx.onSocketClose(function(res) {
        wx.connectSocket({
          url: 'ws://127.0.0.1:8080/ws',
          header: {
            'content-type': 'application/json'
          },
          method: "GET"
        })
  //})
    
      wx.onSocketOpen(function (res) {
     
        var login_data = '{ "type":"login","domain":"' + domain + '","avatar":"' + user_info.avatar + '","user_name":"' + user_info.name + '","send_type":"user_'+user_info.member_id+'_room_'+seller_id+'","uid":"' + user_info.member_id +'","room_id":' + seller_id+'} ';
        console.log(login_data);
       // ws.send(login_data);
       //util.getdomain() stringToJson
        wx.sendSocketMessage({
          data: login_data
        } );

        

      })
     
      wx.onSocketMessage(function (res) {

        var data = util.stringToJson(res.data);
      console.log(data,123456);
        switch (data.type) {
          // 服务端ping客户端
          case 'ping':
            var pong_data = '{"type":"pong"}';
            wx.sendSocketMessage({data:pong_data});
            break;
          case 'seller_sayto_client':
            self.on_seller_mes(data);
            break;
          case 'clientmsg_page'://加载分页
            self.on_clientpage(data);
            break;  
        } 

      })
      wx.onSocketError(function (res) {
        console.log('WebSocket连接打开失败，请检查！')
      })
   },
   inChange:function(event){
     var val = event.detail.value;
     this.setData({
       inpu_val: val
     })


   },
   sendmsgtoseller:function()
   {
     var text = this.data.inpu_val;
     if(text == '')
    {
       wx.showToast({
         title: '发送内容不能为空'
       })
       return false;
    }
    var user_info = this.data.member_info;
    var seller_id = this.data.seller_id;
    //content content
    var content = encodeURIComponent(text);

     var chat_data = '{ "type":"say","is_goods":"0","content":"' + content + '","content_type":"text","avatar":"' + user_info.avatar + '","uid":' + user_info.member_id+',"user_name":"' + user_info.name + '","room_id":' + seller_id + '} ';

     var chat_data_1 = '{ "type":"client_sayto_seller","message":"' + text + '","content_type":"text","avatar":"' + user_info.avatar + '","uid":"' + user_info.member_id+'","user_name":"' + user_info.name + '","room_id":' + seller_id + '} ';
    
    wx.sendSocketMessage({ data: chat_data });
    this.setData({
      inpu_val: ''
    })
    console.log(JSON.parse(chat_data_1),"44444444444");
    let t_msglist = this.data.msglist;
    let send_msg=JSON.parse(chat_data_1);
//    let that=this;
    wxParse.wxParse('msglist', 'html', send_msg.message, this);
    let msglist=this.data.msglist;
//    console.log(msglist,"22222");
     msglist.nodes[0].avatar=send_msg.avatar;
     msglist.nodes[0].content_type=send_msg.content_type;
     msglist.nodes[0].goods_image=send_msg.goods_image;
     msglist.nodes[0].goods_name=send_msg.goods_name;
     msglist.nodes[0].goods_price=send_msg.goods_price;
     msglist.nodes[0].image=send_msg.image;
     msglist.nodes[0].type=send_msg.type;
     msglist.nodes[0].sent=send_msg.sent;
     msglist.nodes[0].message=send_msg.message;
    t_msglist.push(msglist.nodes);
    //t_msglist.push(JSON.parse(chat_data_1) );

    var toview = 'msg' + (t_msglist.length - 1);

    this.setData({
      msglist: t_msglist,
      toView: toview
    })
   },
   on_seller_mes:function(data)
   {
       var t_msglist = this.data.msglist;
       
       data.message = decodeURIComponent(data.message);
       wxParse.wxParse('msglist', 'html', data.message, this);
        
        var msglist=this.data.msglist;
        msglist.nodes[0].avatar=data.avatar;
        msglist.nodes[0].content_type=data.content_type;
        msglist.nodes[0].goods_image=data.goods_image;
        msglist.nodes[0].goods_name=data.goods_name;
        msglist.nodes[0].goods_price=data.goods_price;
        msglist.nodes[0].image=data.image;
        msglist.nodes[0].type=data.type;
        msglist.nodes[0].sent=data.sent;
        msglist.nodes[0].no=t_msglist.length;
        msglist.nodes[0].message=data.message;
       t_msglist.push(msglist.nodes);
       
       console.log(t_msglist,"33333");
       var toview = 'msg' + (t_msglist.length-1);
       console.log(toview,"22222");
        getApp().globalData.s_num = getApp().globalData.s_num+1;
        
       this.setData({
         msglist: t_msglist,
         toView: toview
       })
   },
   on_clientpage:function(data){
     var cur_page = data.page;
     //var cur_page = this.data.cur_page;
     var can_page_load = this.data.can_page_load;
     console.log(cur_page,'blblbllb')
     if (!can_page_load)
     {
       this.setData({
         tips_more: '没有更多了'
       })
        return false;
     }

     if (data.data.length ==0)
     {
       this.setData({
         can_page_load: false
       })
        return false;
     }
     cur_page=cur_page;
     this.setData({
       cur_page: cur_page
     })
console.log(this.data.cur_page,123456789)
     var n_msglist = [];
     var t_msglist = this.data.msglist;
     data.data.reverse();
     for(var i in data.data)
     {
       var msg_tmp = JSON.parse(data.data[i]);
       msg_tmp.message = decodeURIComponent(msg_tmp.message);
       n_msglist.push(msg_tmp);
     }
     

     this.setData({
       msglist: n_msglist,
       //toView: toview
     })
     console.log(n_msglist,"33333333");
    let that=this;
    for (let i = 0; i < n_msglist.length; i++) {
        wxParse.wxParse('topic' + i, 'html', n_msglist[i].message, that);
        if (i === n_msglist.length - 1) {
          wxParse.wxParseTemArray("msglist",'topic', n_msglist.length, that)
        }
    }
    //console.log(this.data.msglist,"7777777777777777");
    var msglist=this.data.msglist;
    msglist.map((item,index,arr)=>{
        //console.log(item,"11111111");
        if(!arr[index][0]){
            arr[index][0]={};
            //console.log(arr,"99999999");
        }
        arr[index][0].name='abc';           //对应的时使用WxParse后的结构
        arr[index][0].no=index;
        //var aa=arr[index][0].avatar;
        arr[index][0].avatar=n_msglist[index].avatar;
        arr[index][0].content_type=n_msglist[index].content_type;
        arr[index][0].goods_image=n_msglist[index].goods_image;
        arr[index][0].goods_name=n_msglist[index].goods_name;
        arr[index][0].goods_price=n_msglist[index].goods_price;
        arr[index][0].image=n_msglist[index].image;
        arr[index][0].type=n_msglist[index].type;
        arr[index][0].sent=n_msglist[index].sent;
        //console.log(index,"555555555555555");
        //arr[index][0].message=item[0].text;

    });
    //console.log(msglist,"888888888888");
    for (var i in t_msglist) {
       msglist.push(t_msglist[i]);
     }
     var toview = 'msg' + (msglist.length-1);
     if (cur_page >1)
     {
       toview = 'msg0';
     }
    this.setData({
       msglist: msglist,
       toView: toview
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
   on_member_buy_msg:function(data){
     this.data.jarray.push(data);
   }
})