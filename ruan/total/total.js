// total/total.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lwp:{
       point:0,
       arrn:[{name:"离我最近"},{name:"最新发布"},{name:"助力热榜"}]
    },
    pm: {
      arr: [[{
        name: "李伟", gender: "男", date: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg", num: 32324232423, title: "古墓书中传奇？！"
      }, {
        name: "李伟", gender: "男", date: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg", num: 32324232423, title: "大家都别慌，我先逃？！"
      }],
        [{
          name: "李伟", gender: "男", date: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg", num: 32324232423, title: "我拥抱着爱，在每一次醒来？！"
        }],
        [{
          name: "李伟", gender: "男", date: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg", num: 32324232423, title: "我有一个梦，像雨后彩虹？！"
        }]
      ]
    }
  },
  arrNfn:function(ev){
    var obj=this.data.lwp;
    obj.point = ev.target.dataset.index;
    this.setData({lwp:obj});
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.global=this;
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})