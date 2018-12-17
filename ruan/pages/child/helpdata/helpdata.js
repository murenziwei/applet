// pages/child/myIssue/myIssue.js
var util = require("../../../utils/util.js");
Page({
  /*
   * 页面的初始数据
   */
  imgerrfn: function (tar) {
    console.log(tar);
    var changeI = tar.currentTarget.dataset.index;
    var issue = wx.that.data.cs.issueObj;
    console.log(issue);
    issue[changeI].img_self = "../../../image/icon7.png";
    wx.that.setData({
      "cs.issueObj": issue
    })
  },
  navtar: function (ev) {
    console.log(ev, "跳转");
    var idT = ev.currentTarget.dataset.id;
    var urlT = "../dataModifit/dataModifit?id=" + idT;
    wx.navigateTo({ url: urlT });
  },

  gateTo(ev) {
    var tUrl = "../maillistDetails/maillistDetails?id=" + ev.currentTarget.dataset.id;
    wx.navigateTo({ url: tUrl });
  },
  data: {
    token: wx.getStorageSync("token"),
    scrollhidden: true,
    shload: true,
    page: 1,
    size: 10,
    cs: {
      issueObj: []
    }
  },
  lazyload: function (ev) {
    var that = this;
    var jointobj = that.data.cs;
    if (that.data.shload) {
      //拉到底时触发请求
      wx.request({
        data: {
          token: that.data.token,
          page: that.data.page + 1,
          size: that.data.size
        },
        url: util.api() + "ruan.php?s=/apicheck/user_event_list",
        success: function (res) {
          console.log(res, "成功");
          var joint = that.data.cs;

          if (res.data.list ? res.data.list.length > 0 : 0) {
            //...可以打散数组
            joint.issueObj.push(...res.data.list);
            that.setData({ cs: joint, shload: true, page: that.data.page + 1 });
          } else {
            that.setData({ shload: false });
          }
        },
        fail: function (res) {
          that.setData({ shload: false });
          console.log(res, "错误");
        }
      });
      that.setData({ cs: jointobj });
    }
  },
  delIssue: function (ev) {
    var that = this;
    var token = wx.getStorageSync("token");
    var did = ev.currentTarget.dataset.id;
    var dindex = ev.currentTarget.dataset.index;
    console.log(ev);
    console.log(did, token, "删除需要的参数");
    wx.showModal({
      title: "删除发布", content: "是否删除此发布", success: function (data) {
        console.log(data);
        if (data.confirm) {
          wx.request({
            url: util.api() + "ruan.php?s=/apicheck/del_event",
            data: {
              token: token,
              id: did
            },
            success: function (res) {
              if (res.data.code) {
                wx.showToast({
                  title: "删除成功", icon: "none", success: function () {
                    var jointobj = that.data.cs;
                    jointobj.issueObj.splice(dindex, 1);
                    console.log(jointobj);
                    that.setData({ cs: jointobj });
                  }
                });
              }
              console.log(res, "删除发布请求回来的数据");
            },
            fail: function (res) {
              console.log("删除失败");
            }
          });
        }
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  tiaozhuan: function () {
    wx.navigateTo({ url: "../dataModifit/dataModifit?help=1" });
  },
  onLoad: function (options) {
    wx.that = this;
    var that = this;
    // 显出加载状态
    that.setData({ loadshow: true, shload: true });
    var token = wx.getStorageSync("token");
    var isBind = wx.getStorageSync("is_bind");
    if (isBind) {
      wx.request({
        data: {
          token: token,
          page: that.data.page,
          size: that.data.size
        },
        url: util.api() + "ruan.php?s=/apicheck/help_name_list",
        success: function (res) {
          console.log(res,"帮助数组");
          if(res.data.code){
            var jointobj = that.data.cs;
            jointobj.issueObj = res.data.list;
            that.setData({ cs: jointobj, c_a_u: res.data.could_add_user});
            console.log(that.data.cs);
            if (res.data.list.length < that.data.size) {
              that.setData({ shload: false });
            }
          }
        },
        fail: function (res) {
          that.setData({ shload: false });
        }
      });
    } else {
      wx.showModal({
        title: "未实名", content: "你未实名，请实名！是否实名", success: function (data) {
          if (data.confirm) {
            wx.navigateTo({ url: "../dataModifit/dataModifit" });
          } else {
            wx.navigateBack();
          }
        }
      });
    }
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //渲染完成后取消加载状态
    var that = this;
    that.setData({ loadshow: false });

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