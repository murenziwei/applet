//index.js
//获取应用实例
const app = getApp()
var util=require("../../../utils/util.js");
Page({
  data: {
    height: '',
    token: wx.getStorageSync("token"),
    page: 1,
    size: 3,
    information: [],
    inputValue: null
  },
  totalFn: function (e) {
    console.log(e);
    var tUrl = "../details/details?id=" + e.currentTarget.dataset.index;
    wx.navigateTo({ url: tUrl });
  },
  lower() {
    wx.showLoading({ //期间为了显示效果可以添加一个过度的弹出框提示“加载中”  
      title: '加载中',
      icon: 'loading',
    });
    wx.request({
      url: util.api()+'ruan.php?s=/Apievent/get_event',
      data: {
        token: this.data.token,
        page: this.data.page,
        size: this.data.size
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res,"早饭")
        if (res.data.list.length > 0) {
          for (var i = 0; i < res.data.list.length; i++) {
            res.data.list[i
            ].date_missing = this.toDate(res.data.list[i
            ].date_missing)
          }
          // console.log(res.data)
          var arr = this.data.information.concat(res.data.list)
          this.setData({
            information: arr,
            page: this.data.page + 1,
          })
          wx.hideLoading();
        } else {

          wx.showToast({
            title: '没有更多数据',
            duration: 2000,
            icon: "none"
          });
          setTimeout(_ => {
            wx.hideToast();
          },
            1500)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: util.api()+'ruan.php?s=/Apievent/get_event',
      data: {
        token: this.data.token,
        page: this.data.page,
        size: this.data.size
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res);
        for (var i = 0; i < res.data.list.length; i++) {
          res.data.list[i
          ].date_missing = this.toDate(res.data.list[i
          ].date_missing)
        }

        this.setData({
          information: res.data.list,
          page: this.data.page + 1,
        })
      }
    })

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight
        })
      }
    })
  },

  clearInputEvent: function (res) {
    this.setData({
      'inputValue': ''
    })
  },


  toDate(number) {
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D)
  }
})
