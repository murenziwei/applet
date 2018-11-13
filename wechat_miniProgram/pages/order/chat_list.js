// pages/pinduoduo/chat_list.js
var util = require('../../utils/util.js');
var wxParse = require('../../wxParse/wxParse.js');
function go_new(that)
{
	that.socketmsg();
	/**
	setTimeout(function () {
		go_new(that);
  }, 5000)
  **/
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
	member_info:{},
	tablebar:7,
	list:[],
  s_num:0,
  prolist:[],
  pageNum: 1,
  indexpageNum: 1,
  gid: 0,
  hasRefesh: false,
  putonghasRefesh: false,
  LoadingComplete: true,
  isHidenotice: true,
  is_return:1,//是否是返回上一页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s_num = getApp().globalData.s_num;
    this.setData({
      s_num: s_num
    });
	var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_user_info/token/' + token,
      method: 'get',
      success: function (res) {
        that.setData({
          member_info: res.data.data
        });
        //that.socketmsg();
		go_new(that)
        }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/wepro_index_goods',
      data: {
        "page":  1,
        "gid": that.data.gid
      },
      success: function (res) {
        console.log(res,"res");
        if (res.data.code == 0) {
          let prolist = that.data.prolist.concat(res.data.list);
          console.log(prolist,"xiao");

          that.setData({
            prolist: prolist
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

	
  },
  loadPutongMore: function () {
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
    
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      
    }
    that.loadPutongMore();
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
   goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    wx.reLaunch({
      url: url
    })
  },
	socketmsg:function()
   {
     wx.closeSocket();
     
	 wx.onSocketClose(function(res) {
            wx.connectSocket({
        url: 'ws://127.0.0.1:8080/ws',
            header: {
              'content-type': 'application/json'
            },
            method: "GET"
          })
	})
	wx.connectSocket({
        url: 'ws://127.0.0.1:8080/ws',
        header: {
          'content-type': 'application/json'
        },
        method: "GET"
      })
      var domain = util.getdomain();
      var self = this;
		//console.log('ggg');
      var user_info = this.data.member_info;
      
      var is_in = 0;
            wx.onSocketOpen(function (res) {
     
                var login_data = '{ "type":"clientMsgSellerList","domain":"' + domain + '","tip_list":"user_'+user_info.member_id+'","uid":"' + user_info.member_id +'"} ';
                console.log('socket lianjie');
                        console.log(login_data);
                        is_in = 1;

               // ws.send(login_data);
               //util.getdomain() stringToJson
                wx.sendSocketMessage({
                  data: login_data
                } );



              })
		
		if(is_in == 0 )
		{
			
			var login_data = '{ "type":"clientMsgSellerList","domain":"' + domain + '","tip_list":"user_'+user_info.member_id+'","uid":"' + user_info.member_id +'"} ';
			console.log('login data');		
			console.log(login_data);
			
			wx.sendSocketMessage({
			  data: login_data
			} );
		}
      wx.onSocketMessage(function (res) {

		
        var data = util.stringToJson(res.data);
       console.log(data,"这里");
        switch (data.type) {
          // 服务端ping客户端
          case 'ping':
            var pong_data = '{"type":"pong"}';
            wx.sendSocketMessage({data:pong_data});
			if(is_in == 0)
			{
				is_in = 1;
				
				var login_data = '{ "type":"clientMsgSellerList","domain":"' + domain + '","tip_list":"user_'+user_info.member_id+'","uid":"' + user_info.member_id +'"} ';
				 wx.sendSocketMessage({
				  data: login_data
				} );
			}
			
            break;
          case 'unread_to_clien':
            getApp().globalData.s_num=data.unread_count;
            self.setData({
              s_num: data.unread_count
            }) 
            break;
          case 'member_client_list':
            var s_dat = data.data;
            console.log(s_dat, "383838");
            var t_list = self.data.list;
          for(var i in s_dat)
          {
//            s_dat[i] = JSON.parse(s_dat[i]);
            //decodeURIComponent
            s_dat[i].message = decodeURIComponent(s_dat[i].message) ;
            //wxParse.wxParse('icnolist', 'html', s_dat[i].message, self,5);
            //ss_dat.push(s_dat[i].message);
          }
          self.setData({
            list:s_dat
          })
            //
          //处理图片表情--------------------
            let that = self;
            console.log(self, "555555555555555555");
          for (let i = 0; i < s_dat.length; i++) {
            wxParse.wxParse('topic' + i, 'html', s_dat[i].message, that);
            if (i === s_dat.length - 1) {
              wxParse.wxParseTemArray("list", 'topic', s_dat.length, that)
            }
          }
                console.log(self.data.list,"7777777777777777");
          var list = self.data.list;
          list.map((item, index, arr) => {
            //console.log(item,"11111111");
            if (!arr[index][0]) {
              arr[index][0] = {};
              //console.log(arr,"99999999");
            }
            arr[index][0].name = 'abc';           //对应的时使用WxParse后的结构
            arr[index][0].no = index;
            //var aa=arr[index][0].avatar;
            arr[index][0].avatar = s_dat[index].avatar;
            arr[index][0].content_type = s_dat[index].content_type;
            arr[index][0].goods_image = s_dat[index].goods_image;
            arr[index][0].goods_name = s_dat[index].goods_name;
            arr[index][0].goods_price = s_dat[index].goods_price;
            arr[index][0].image = s_dat[index].image;
            arr[index][0].type = s_dat[index].type;
            arr[index][0].sent = s_dat[index].sent;
            arr[index][0].from = s_dat[index].from;
            arr[index][0].unread_count = s_dat[index].unread_count;
            arr[index][0].user_name = s_dat[index].user_name;
            //console.log(index,"555555555555555");
            //arr[index][0].message=item[0].text;

          });
          console.log(list,"//////////////////////");
//          for (var i in t_list) {
//            list.push(t_list[i]);
//          }
          that.setData({
            list: list
          })
            console.log(that.data.list, "888888888888");
          //处理图片表情--------------------
                
                //self.on_seller_mes(data);
                break; 
            } 

      })
      wx.onSocketError(function (res) {
        console.log('WebSocket连接打开失败，请检查！')
      })
   },
   nav_dir_go_link:function(url){
    wx.navigateTo({
      url: url,
      fail: function () {
        wx.redirectTo({
          url: url
        })
      }
    })
  },
  gokefu: function (event) {
    let id = event.currentTarget.dataset.s_id;
    wx.closeSocket();
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
	//this.nav_dir_go_link('/pages/im/index?id=' + id);
	
   
  },
  common_go_link:function (e) {
    var url = e.currentTarget.dataset.link;
    this.nav_dir_go_link(url);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      //this.onLoad();
  console.log("onshow_chat");
  var is_return=this.data.is_return;
  if(is_return==2){
    this.setData({
      s_num: 0,
      is_return:1
    }) 
    var list=this.data.list;
    console.log(list,"88888888888888888888888888888888888888");
    for(var i=0;i<list.length;i++){
        if(list[i][0]['from']==getApp().globalData.store_id){
            list[i][0]['unread_count']=0;
        }
    }
    this.setData({
      list: list
    }) 
  //  console.log(this.data.list)
//    var domain = util.getdomain();
//        var self = this;
//      //console.log('ggg');
//        var user_info = this.data.member_info;
//        var login_data = '{ "type":"clientMsgSellerList","domain":"' + domain + '","tip_list":"user_'+user_info.member_id+'","uid":"' + user_info.member_id +'"} ';
//                          console.log('login data');		
//                          console.log(login_data);
//
//                          wx.sendSocketMessage({
//                            data: login_data
//                          } );
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      console.log("onHide_chat");
      this.setData({
        is_return: 2
      }) 
      //getApp().globalData.store_id
      console.log("is_return:"+getApp().globalData.store_id)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})