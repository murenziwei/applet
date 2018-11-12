//index.js
var util = require('../../utils/util.js');
Page({
  data: {
    nav: {},
    hidetip:true,
    tablebar:2,
    menuindex: 0,
    list: {},
    share_title:'',
    pageNum: 1,
    hasRefesh:false,
    LoadingComplete:true
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/get_index_category',
      success: function (res) {
        that.setData({
          nav: res.data.data,
        })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata/type/newman_wepro_head',
      success: function (res) {
        that.setData({
          slide_newman_ad: res.data.data,
        })
      }
    })
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/type/newman/is_index_show/2',
      success: function (res) {
        that.setData({
          list: res.data.data,
          hidetip:true
        })
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/index_share',
      success: function (res) {
        that.setData({
          share_title: res.data.title,
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
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: url
    })
  },
  goGoods: function (event) {
    let id = event.currentTarget.dataset.type;

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
  goBannlinc: function (event) {
    let url = event.currentTarget.dataset.url;
    if (url == '') {
      url = '/pages/index/index';
    }

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
  choiceMenu: function (event) {//分类
    let vid = event.currentTarget.dataset.id;
    this.setData({
      menuindex: vid
    })
  },
  loadMore: function () {
    let that = this;
    if (!that.data.hasRefesh){
      that.setData({
        hasRefesh: true,
        hidetip:false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/type/newman/is_index_show/2',
        data: {
          "page": that.data.pageNum + 1,
        },
        success: function (res) {
          if(res.data.code == 1)
          {
            that.setData({
              LoadingComplete: false,
              hidetip: true
            });
          }else {
            let list = that.data.list.concat(res.data.data);
            that.setData({
              list: list,
              pageNum: that.data.pageNum + 1,
              hasRefesh: false,
              hidetip: true
            });
          }
          
        }
      })
    }
  },
  onReachBottom: function () {

    this.loadMore();

  }, 
  onShareAppMessage: function (res) {
    var share_title = this.data.share_title;

    var share_id = wx.getStorageSync('member_id');
    var share_path = 'pages/index/one?share_id=' + share_id;

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
