var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_search:true,
	isHidenotice: true,
	cur_view_id:0,
  cur_cate:'',
	tablebar:5,
    jarray:[],
    s_num: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var s_num = getApp().globalData.s_num;
    console.log(s_num,"我一开始就加载进来了")
    this.setData({ s_num: s_num });
	var that = this;
	
	//search
	wx.request({
      url: util.api() + 'index.php?s=/Apigoods/search',
      success: function (res) {
        console.log(res.data.data.length );
        that.setData({
          list: res.data.data,
          s_count: res.data.data.length - 1
        })
      }
    })  
	  
    var res = wx.getSystemInfoSync();
    var del_height = res.windowHeight - 45-58;
    this.setData({
      del_height: del_height
    })
	this.socketmsg();
	
  },
  goLink: function (event){
    let url = event.currentTarget.dataset.link;
    wx.redirectTo({
      url: url
    })
    
  },
  scroll : function(e){
    var _list_length = this.data.list.length;
    var that = this;

    var is_next = false;
    for (var i = 0; i < _list_length;i++)
    {
      var query = wx.createSelectorQuery()
      query.select('#cate_'+i).boundingClientRect()
      query.selectViewport().scrollOffset()
      query.exec(function (res) {
        //console.log(res);
        that.setData({ cur_cate: res[0].id})
        //cur_cate = res[0].id;
       // console.log('cate_'+i+':===');
        //console.log(res[0].top);
        if (res[0].top > 7 && res[0].top < 60)
        {
          is_next = false;
          that.show_cur_cate(res[0].id);
        }
       
        
        //console.log(res[0].id);
        //res[0].top       // #the-id节点的上边界坐标
        //res[1].scrollTop // 显示区域的竖直滚动位置
      })
    }
   
  },
  tolower:function(e)
  {
    var that = this;
    var _list_length = this.data.list.length-1;
    var query = wx.createSelectorQuery()
    query.select('#cate_' + _list_length).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      that.setData({ cur_cate: res[0].id })
      if (res[0].top > 7 && res[0].top < 60) {
        
        that.show_cur_cate(res[0].id);
      }
    })
  },
  toupper:function(e){
    var that = this;
    var query = wx.createSelectorQuery()
    query.select('#cate_0').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      //console.log(res);
      that.setData({ cur_cate: res[0].id })
      //cur_cate = res[0].id;
      // console.log('cate_'+i+':===');
      //console.log(res[0].top);
      if (res[0].top > 7 && res[0].top < 60) {
       
        that.show_cur_cate(res[0].id);
      }


      //console.log(res[0].id);
      //res[0].top       // #the-id节点的上边界坐标
      //res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },
  show_cur_cate:function(b)
  {
    //change_nav: function (nav_id)
    var _list_length = this.data.list.length;
    var that = this;
    var tp_cate = '';
    var is_next = false;
    for (var i = 0; i < _list_length; i++) {
      tp_cate = 'cate_' + i;
      if (b == tp_cate)
      {
        that.change_nav( i);
        break;
      }
    }
    console.log(b);
  },
  serach_form_event:function(event)
  {
	  var keyword = event.detail.value;
	  this.nav_dir_go_link('/pages/goods/searchcategory?keyword=' + keyword);
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
        console.log(member_id,"888888888888");
    if(member_id){
        var login_data = '{ "type":"membre_login","uid":"'+member_id+'","tip_list":"user_'+member_id+'","domain":"' + domain + '"} ';
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
  noticego: function (e) {
    var orderid = e.currentTarget.dataset.orderid;


    var pages_all = getCurrentPages();
    this.nav_dir_go_link('/pages/share/index?id=' + orderid);

   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  common_go_link:function (e) {
    var url = e.currentTarget.dataset.link;
    this.nav_dir_go_link(url);
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  show_search_func:function(){
    var show_search = this.data.show_search;
    if (show_search)
    {
      this.setData({
        show_search: false
      });
    }else {
      this.setData({
        show_search: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },
  change_cate:function(e){
    
    var cate_id = 'cate_' +e.currentTarget.dataset.cate_id;
	
    this.setData({
	  cur_view_id : e.currentTarget.dataset.cate_id,
      del_view_id: cate_id
    })
  },
  change_nav: function (nav_id) {

    this.setData({
      cur_view_id: nav_id
    })
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