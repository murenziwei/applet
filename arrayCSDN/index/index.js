//index.js

Page({
  splicechange: function (res) {
    console.log(res, "无所谓？");
    var deI = res.detail.value;
    var resultArr = wx.that.data.slicearr;
    var rv = wx.that.data.splicevalue;

    if (resultArr ? resultArr.length : false) {
      var spI = resultArr.indexOf(rv);
      wx.that.setData({ spI: spI });
      if (deI == 0) {
        //删除
        if (spI <= -1) {
          wx.showToast({ title: "没有找到该子集", icon: "none" });
        } else {
          wx.showModal({
            content: "是否删除值为'" + resultArr[spI] + "'这个子集？", success: function (res) {
              if (res.confirm) {
                console.log(spI, '奇怪');
                resultArr.splice(Number(spI), 1);
                console.log(resultArr);
                wx.that.setData({ slicearr: resultArr });
              }
            }
          });
        }
      } else if (deI == 1) {
        //增加
        wx.that.setData({
          arrHidden: false,
          arrtitle: "子集添加在" + spI + "位置处",
          indexvalue: "splice",
          inputvalue: rv
        })
      }
    } else {
      wx.showToast({ title: "请用slice产生下面的数组", icon: "none" });
    }

  },
  sliceFn: function (res) {
    var rv = wx.that.data.radiovalue;
    var resultArr = wx.that.data.arrtest;
    var jI = resultArr.indexOf(rv);
    if (jI <= -1) {
      wx.showToast({ title: "没有找到该子集", icon: "none" });
    } else {
      var newArr = resultArr.slice(jI);
      wx.that.setData({
        slicearr: newArr
      })
    }
    console.log(rv);
  },
  lastindexofFn: function (res) {
    var rv = wx.that.data.radiovalue;
    var resultArr = wx.that.data.arrtest;
    var jI = resultArr.lastIndexOf(rv);
    wx.that.setData({ jI: jI });
    if (jI <= -1) {
      wx.showToast({ title: "没有找到该子集", icon: "none" });
    } else {
      wx.that.setData({
        arrHidden: false,
        arrtitle: "用lastIndexOf来修改数组",
        indexvalue: "lastIndexOf",
        inputvalue: rv
      })
    }
  },
  indexofFn: function (res) {
    var rv = wx.that.data.radiovalue;
    var resultArr = wx.that.data.arrtest;
    var jI = resultArr.indexOf(rv);
    wx.that.setData({ jI: jI });
    if (jI <= -1) {
      wx.showToast({ title: "没有找到该子集", icon: "none" });
    } else {
      wx.that.setData({
        arrHidden: false,
        arrtitle: "用indexOf来修改数组",
        indexvalue: "indexOf",
        inputvalue: rv
      })
    }
  },
  radioFn: function (ev) {

    console.log(ev);
    var ii = wx.that.data.radiovalue;
    wx.that.data[ev.currentTarget.dataset.index] = ev.detail.value;
  },
  getchange: function (tar) {
    var ia = wx.that.data.indexofarr ? wx.that.data.indexofarr : [];
    var index = tar.currentTarget.dataset.index;
    console.log(tar);
    console.log(ia);
    if (ia.indexOf(index) == -1) {
      ia.push(index);
      wx.that.setData({ indexofarr: ia });
    } else {
      ia.splice(ia.indexOf(index), 1);
      wx.that.setData({ indexofarr: ia });
    }
    console.log(ia.indexOf(index) > -1);
  },
  arrCancel: function () {
    wx.that.setData({ arrHidden: true });
  },
  arrConfirm: function () {
    var arr = wx.that.data.arrtest;
    var ci = wx.that.data.indexvalue;
    var val = wx.that.data.inputvalue;
    switch (ci) {
      case "push": ;
      case "unshift": ;
      case "pop": ;
      case "shift": (() => {
        arr[ci](val);
        wx.that.setData({ arrHidden: true, arrtest: arr });
      })(); break;
      case "lastIndexOf": ;
      case "indexOf": (() => {
        arr[wx.that.data.jI] = val;
        wx.that.setData({ arrHidden: true, arrtest: arr, radiovalue: val });
      })(); break;
      case "splice": (() => {
        var sarr = wx.that.data.slicearr;
        console.log();
        sarr.splice(wx.that.data.spI, 0, val);
        wx.that.setData({ arrHidden: true, slicearr: sarr, splicevalue: val });
      })(); break;
    }
  },
  changeinput: function (re) {
    console.log(re);
    wx.that.setData({ inputvalue: re.detail.value });
  },
  pushFn: function () {
    wx.that.setData({
      arrHidden: false,
      arrtitle: "在尾部添加元素",
      indexvalue: "push"
    })
  },
  unshiftFn: function () {
    wx.that.setData({
      arrHidden: false,
      arrtitle: "在首部添加元素",
      indexvalue: "unshift"
    })
  },
  popFn: function () {
    wx.showModal({
      title: "删除数组尾部的子集", success: function (re) {
        if (re.confirm) {
          var arr = wx.that.data.arrtest;
          arr.pop();
          wx.that.setData({ arrtest: arr });
        }
      }
    });
  },
  shiftFn: function () {
    wx.showModal({
      title: "删除数组首部的子集", success: function (re) {
        if (re.confirm) {
          var arr = wx.that.data.arrtest;
          arr.shift();
          wx.that.setData({ arrtest: arr });
        }
      }
    });
  },
  data: {
    splicearr: ["删除", "增加"],
    arrHidden: true,
    arrtest: ["好", "扎在那个", "好"]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.that = this;
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
