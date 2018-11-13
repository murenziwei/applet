// pages/pinduoduo/category.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	loadover:false,
	subcate:[],
  level:0,
  show_more_cate:false,
	cur_pid:0,
    cur_ppid:0,
	tablebar:2,
	hidetip: true,
    tip_html: '^_^已经到底了',
	 pageNum: 1,
    hasRefesh: false,
	list:[],
    LoadingComplete: true,
    isHidenotice: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that = this;
	var cur_pid = options.id;
	this.setData({
		cur_pid:cur_pid,
    cur_ppid:cur_pid
	})
    wx.showLoading({
    })
	
	wx.request({
      url: util.api() + 'index.php?s=/Apiindex/get_index_category',
      success: function (res) {
        console.log(res);
        that.setData({
          nav: res.data.data,
        })
      }
    })
	wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_subcategory/id/'+cur_pid,
      success: function (res) {
        if(res.data.code ==0)
        {
          that.setData({
            level: res.data.level,
            subcate: res.data.data,
          })
        }else{
          that.setData({
            level: res.data.level,
            subcate: res.data.data,
          })  
        }
      }
    })
	
	
	
	wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_category_goods/id/'+cur_pid,
      success: function (res) {
		  if(res.data.code ==0)
		  {
				that.setData({
				  list: res.data.data,
				  hidetip: true
				})
		  }else{
				that.setData({
				  LoadingComplete: false,
				  tip_html: '^_^已经到底了',
				  hidetip: true
				})
		  }
        
      }
    })
	
	
	wx.hideLoading();
    this.setData({ loadover:true})
  },
  show_more_cate:function(){
    this.setData({ show_more_cate:true})
  },
  hide_cate_d:function(){
    this.setData({ show_more_cate: false })
  },
  goLink: function (event){
    
    let url = event.currentTarget.dataset.link;

    wx.reLaunch({
      url: url
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
  common_godir_link:function(e){
    var url = e.currentTarget.dataset.link;
  
    var that = this;

    if (url == '/pages/index/index') {
      wx.reLaunch({
        url: url
      })
    } else
      
        this.nav_dir_go_link(url);
     
  },
  common_go_link:function (e) {
    var url = e.currentTarget.dataset.link;
    var id = e.currentTarget.dataset.id;
    var that = this;
    console.log(id);

    that.hide_cate_d();
    if (url == '/pages/index/index')
    {
      wx.reLaunch({
        url: url
      })
    }else
      if(this.data.level == 2)
      {
            that.setData({
              hasRefesh: false,
              cur_pid: id,
              list:[],
              pageNum:0,
              hidetip: false,
            });
        this.loadMore();
      }else{
        this.nav_dir_go_link(url);  
      }
      
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	this.loadMore();
  },
	loadMore: function () {

    let that = this;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
	  var cur_pid = that.data.cur_pid;
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/get_category_goods/id/'+cur_pid,
        data: {
          "page": that.data.pageNum + 1
        },
        success: function (res) {
          if (res.data.code == 0) {
           
            var list = that.data.list;
            var n_data = res.data.data;
            //list.push(n_data);

            //console.log(list);
            n_data.map(function (good) {
              list.push(good);
            });
            that.setData({
              list: list,
              pageNum: that.data.pageNum + 1,
              hasRefesh: false,
              hidetip: true
            });
          } else {
            that.setData({
              LoadingComplete: false,
              tip_html: '^_^已经到底了',
              hidetip: true
            });
          }

        }
      })
    }
  },
  goGoods_link:function(e){
    
    var goods_id = e.currentTarget.dataset.type;
    var url = "/pages/goods/index?id=" + goods_id;
    this.nav_dir_go_link(url);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})