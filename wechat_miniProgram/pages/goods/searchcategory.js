// pages/pinduoduo/category.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
	theme_type:'',
	loadover:false,
	subcate:[],
	cur_pid:0,
  cur_price_index:0,
  show_price_search:false,
  search_min_price:0,
  search_max_price:0,
  sort:'',
	hidetip: true,
  tip_html: '^_^已经到底了',
  cur_type: 'default',
	 pageNum: 1,
   keyword: '',
    hasRefesh: false,
    list: [],
    LoadingComplete: true,
    isHidenotice: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that = this;
	var keyword = options.keyword;
  if(keyword == undefined)
  {
    keyword = '';
  }else{
    this.setData({
      keyword: keyword
    })
  }
	
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
      url: util.api() + 'index.php?s=/Apigoods/get_category_keyword_goods/keyword/' + keyword,
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
  bindKeyInput: function (e) {
    this.setData({
      keyword: e.detail.value
    })
  },
  bindKeyInputmin: function (e) {
    this.setData({
      search_min_price: e.detail.value
    })
  },
  bindKeyInputmax: function (e) {
    this.setData({
      search_max_price: e.detail.value
    })
  },
  clear_input:function(){
    this.setData({
      keyword: ''
    }) 
  },
  go_sort_by: function (event){
    let type = event.currentTarget.dataset.type;
    var s_sort = '';
    if (type =='price')
    {
      s_sort = this.data.sort;
      if (s_sort == 'desc')
      {
        s_sort = 'asc';
      } else if (s_sort == 'asc'){
        s_sort = 'desc';
      }else{
        s_sort = 'asc';
      }
    } 
    
    this.setData({
      cur_type: type,
      sort: s_sort,
      list: [],
      hasRefesh: false,
      hidetip: true,
      pageNum: 0 
    })
    this.loadMore();
  },
  chose_price: function (event){
    let price_index = event.currentTarget.dataset.price_index;
    let min_price = event.currentTarget.dataset.min_price;
    let max_price = event.currentTarget.dataset.max_price;

    if (this.data.cur_price_index == price_index)
    {
      this.setData({
        cur_price_index:0
      })
    }else{
      this.setData({
        cur_price_index: price_index,
        search_min_price: min_price,
        search_max_price: max_price,
        list: [],
        hasRefesh: false,
        hidetip: true,
        pageNum: 0
      })
      this.loadMore();
    }

    
  },
  searchbtn: function (e) {
    console.log(12);
    this.setData({
      list:[],
      hasRefesh: false,
      hidetip: true,
      pageNum: 0 
    })
    this.loadMore();
  },
  nav_dir_go_link: function (url) {
    wx.navigateTo({
      url: url,
      fail: function () {
        wx.redirectTo({
          url: url
        })
      }
    })
  },
  show_price_search_do:function(){
    this.setData({
      show_price_search:true
    })
  },
  hide_search:function(){
    this.setData({
      show_price_search: false
    })
  },
  go_search:function(){
    this.hide_search();
    this.setData({
      list: [],
      hasRefesh: false,
      hidetip: true,
      pageNum: 0
    })
    this.loadMore();
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
  common_go_link: function (e) {
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
      var keyword = that.data.keyword;
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/get_category_keyword_goods/keyword/' + keyword,
        data: {
          "page": that.data.pageNum + 1,
          "cur_price_index": that.data.cur_price_index,
          "cur_type": that.data.cur_type,
          "sort": that.data.sort,
          "search_min_price": that.data.search_min_price,
          "search_max_price": that.data.search_max_price,
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
  goGoods_link: function (e) {

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