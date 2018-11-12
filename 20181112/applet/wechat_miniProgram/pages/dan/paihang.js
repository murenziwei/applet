//index.js
var util = require('../../utils/util.js');
Page({
  data: {
    nav: {},
    hidetip: true,
    tablebar: 2,
    menuindex: 0,
    slide: {},
    ad: {},
    indicatorDots: false,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    list: [],
    pageNum: 1,
    gid: '',
    showguess: true,
    hasRefesh: false,
    LoadingComplete: true
  },
  onLoad: function () {
    var that = this;

    that.setData({
      hidetip: false
    })
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/orderby/seller_count/',
      success: function (res) {
        that.setData({
          list: res.data.data,
          hidetip: true
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
          ad: res.data.data,
        })
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
  goLink: function (e) {
    var link = e.currentTarget.dataset.link;
    wx.reLaunch({
      url: link,
    })

    

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
    let that = this;
    let vid = event.currentTarget.dataset.id;
    let gid = event.currentTarget.dataset.navid;
    this.setData({
      menuindex: vid,
      hidetip: true
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/',
      data: {
        "gid": gid,
      },
      success: function (res) {
        if (res.data.code == 1) {

          that.setData({
            list: '',
            pageNum: 1,
            LoadingComplete: false,
            gid: gid,
            hidetip: false
          })
        } else {
          console.log(99);
          that.setData({
            list: res.data.data,
            pageNum: 1,
            gid: gid,
            hidetip: false
          })
        }
      }
    })
  },
  loadMore: function () {
    let that = this;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/orderby/seller_count/',
        data: {
          "page": that.data.pageNum + 1,
          "gid": that.data.gid
        },
        success: function (res) {
          if (res.data.code == 0) {
            let list = that.data.list.concat(res.data.data);
            that.setData({
              list: list,
              pageNum: that.data.pageNum + 1,
              hasRefesh: false,
              hidetip: true
            });
          } else {
            
            that.setData({
              LoadingComplete: false,
              hidetip: true
            });
          }
        }
      })
    }
  },
  loadGuess: function () {

    let that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/store_id/1/per_page/4/is_index_show/0/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {

        if (res.data.data.length > 0) {
          that.setData({
            showguess: false,
            guessdata: res.data.data
          });
        }
      }
    })

  },
  onShareAppMessage: function (res) {
    return {
      title: "排行",
      path: 'pages/dan/paihang',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
