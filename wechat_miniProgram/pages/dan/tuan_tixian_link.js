var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasRefesh: false,
    LoadingComplete:true,
    list: [],
    state: -1,
    pageNum: 0,
    info:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var token = wx.getStorageSync('token');
    var that = this;

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_tixian_info/token/' + token,
      method: 'get',
      success: function (res) {
        if (res.data.code == 0) {
          that.setData({
            info: res.data.data
          })
        }

      }
    })
    this.loaddata();
  },
  loaddata: function () {
    let that = this;
    var token = wx.getStorageSync('token');
    var state = this.data.state;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiuser/tixian_record/token/' + token + '/state/' + state,
        data: {
          "page": that.data.pageNum + 1,
          is_index_show: 2
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
              hasRefesh: true,
              tip_html: '^_^没有更多了',
              hidetip: true
            });

          }
        }
      })
    }

  },
  tixian_money:function(e){
    var value = e.detail.value;
    this.setData({
      tixian_money: value
    })
  },
  shenqing:function(){
    var tixian_money = parseFloat(this.data.tixian_money);
    var info = this.data.info;
    var that = this;

    if (tixian_money > parseFloat(info.money))
    {
    
      wx.showToast({
        title: '最多可提现'+info.money+'元',
        icon:'none',
      })
      return false;
    }
    //tixian_sub
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/tixian_sub/token/' + token,
      data: {
        "money": tixian_money
      },
      method: 'POST',
      success: function (res) {

        if (res.data.code == 0) {
          info.money = parseFloat(info.money) - tixian_money;
            that.setData({
              info:info
            })
            wx.showToast({
              title: '申请成功，等待审核',
            })
        }else{
          wx.showToast({
            title: res.data.msg,
          })
        }
      }
    })

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
    this.loaddata();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})