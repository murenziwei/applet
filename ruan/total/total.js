var util = require('../utils/util.js');

Page({
  showCityFn:function(ev){
    this.setData({showCity:true});
  },
  resultCityFn:function(ev){
    console.log(ev.detail.name)
    this.setData({ showCity: false, chooseCity: ev.detail.name, inputValue: ev.detail.name});
    this.search()
  },
  myParentFn:function(res){
    console.log(res);
  },
  issueFn:function(ev){
    if(ev.detail.errMsg==="getUserInfo:ok"){
      wx.navigateTo({url:"../issue/issue"});
    }else{
      wx.showToast({title:"授权失败",icon:"none",success:function(res){console.log("弹窗完成",res)}});
    }
  },
  totalFn:function(e){
    console.log(e);
    var isBind = wx.getStorageSync('is_bind');
    // if (isBind !== 1) {
    //   return wx.showModal({
    //     title: '提示',
    //     content: '你还未实名,点击确认前往实名认证',
    //     success(res) {
    //       if (res.confirm) {//用户点击确定
    //         wx.navigateTo({ url: '../pages/child/dataModifit/dataModifit' });
    //       } else if (res.cancel) {//用户点击取消

    //       }
    //     }
    //   })
    //   return
    // }
    var tUrl="../pages/child/details/details?id="+e.currentTarget.dataset.index;
    wx.navigateTo({url:tUrl});
  },
  showM:function(){
    this.setData({ showModalStatus: true});
    this.animationModel();
  },
  warnCancel:function(){
    this.setData({ showModalStatus: false, aniData: null, warnAni:null});
  },
  warnConfirm:function(){
    console.log();
  },
  animationModel:function(dataT){
    var ani=wx.createAnimation({
      timingFunction:"linear",
      delay:0,
      duration:200
    });
    var warnAni=wx.createAnimation({
      timingFunction:"linear",
      delay:0,
      duration:200
    });
    warnAni.opacity(1).step();
    ani.opacity(0).translateY(0).opacity(1).translateY(50).step();
    this.setData({
      aniData:ani.export(),
      warnAni:warnAni.export()
    });
  },
  //搜索
  search(es) {
    if (!this.data.inputValue) return;
    this.setData({
      'lwp.point':0,
      typeNum: 0,
      page: 1,
      loadshow: true
    })
    wx.request({
      url: this.data.url,
      data: {
        token: wx.getStorageSync("token"),
        type: this.data.typeNum,
        addr_name: this.data.inputValue,
        page: this.data.page,
        size: this.data.size,
      },
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log(res,"拥抱");
        if(res.data.code){
          if (res.data.list.length > 0) {
            this.setData({
              'pm.arr': res.data.list,
              page: this.data.page + 1,
            })
          } else {
            this.setData({
              'pm.arr': [],
            })
          }
        }
        this.setData({ loadshow: false });
      }
    })
  },

  //清空input
  clearInputEvent: function (res) {
    // //测试搜索
    // this.search()
    // return
    //输入框清空内容恢复默认
    this.setData({
      inputValue: null,
      page: 1
    })
    //输入框清空内容重新获取
    // wx.request({
    //   url: this.data.url,
    //   data: {
    //     token: this.data.token,
    //     page: this.data.page,
    //     size: this.data.size,
    //     type: this.data.typeNum,
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: (res) => {
    //     console.log(res);
    //     this.setData({
    //       'pm.arr': res.data.list,
    //       page: this.data.page + 1,
    //     })
    //   }
    // })
  },

  //设置datainputVal
  setInpVal(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  /**
   * 页面的初始数据
   */
  data: {
    near:'广东省东莞市',
    key:'4TVBZ-EC4K4-MBCUW-XQGZN-6DCS5-V7F4F',
    showCity:false,
    yearA: ["按常住地查询", "按原籍查询", "按祖籍查询", "按姓名查询"],
    showModalStatus: false,
    typeNum:1,//1离我最近2new最新发布3助力热榜
    token : wx.getStorageSync('token'),
    page:1,
    size:2,
    url: util.api() + "ruan.php?s=/Apicheck/users",
    information: [],
    inputValue: null,
    lwp:{
       point:0,
      arrn: [{ tk: "1", name: "离我最近" }] /*[{ tk: "0", name: "全部" },{ tk: "1", name: "离我最近" }, { tk: "2", name: "最新发布" }, { tk: "3", name: "助力热榜" }]*/
    },
    pm: {
      arr: []
    }
  },
  arrNfn:function(ev){
    var index=ev.currentTarget.dataset.index;
    var getNowCity = wx.getStorageSync("$city_choose_history");
    if(getNowCity[0]){
      this.setData({chooseCity:getNowCity[0].name})
    }
    this.setData({
      typeNum: index,
      page:1,
      inputValue: null
    })
    var iI=ev.currentTarget.dataset.indexi;
    console.log(iI)
    var token = wx.getStorageSync('token');
    var near = this.data.near;
    var data = {
      'token': token,
      'type': index,
      'size': this.data.size,
      'page': this.data.page,
    };
    switch (this.data.typeNum) {
      //如果离我最近
      case '1':
        data.near = near
        break;
      //如果最新发布
      case '2':
        
        break;
      default:
       
    }
    wx.request({
      url: util.api() + 'ruan.php?s=/Apicheck/users.html',
      data: data,
      method: 'get',
      success: function (res) {
        
        var obj = wx.global.data.pm ? wx.global.data.pm:{};
        var lwpObj = wx.global.data.lwp ? wx.global.data.lwp:{};
        lwpObj.point=iI;
        obj.arr = res.data.list;

        wx.global.setData({
          pm: obj,
          lwp:lwpObj,
          page: wx.global.data.page + 1
        });
       

      },
      fail: function () {
        console.log("yan");
        wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //开启加载
    wx.showLoading({
      title: '加载中',
    });
    var that=this;
    var token = wx.getStorageSync('token');
    that.setData({loadshow:true});
    wx.global=this;

  
    
    //获取当前经纬度
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        //http://apis.map.qq.com/ws/geocoder/v1/?location=39.984154,116.307490&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77
        wx.request({
          url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + res.latitude + ',' + res.longitude + '&key=' + that.data.key + '',
          success: function (res) {
            var add = res.data.result.address_component
            that.setData({
              near: add.province + add.city
            })
            console.log(that.data.near);
            

          },
          fail: function () {
            wx.showToast({ title: "获取地址失败", icon: 0, duration: 1000 });
            //关闭加载
            wx.hideLoading();
          }

        })
      },
      complete:function(res){
        console.log(res);
        var data = {
          'token': wx.getStorageSync("token"),
          'type': that.data.typeNum,
          'size': that.data.size,
          'page': that.data.page,
          'near': that.data.near
        };

        wx.request({
          url: util.api() + 'ruan.php?s=/Apicheck/users.html',
          data: data,
          method: 'get',
          success: function (res) {
            console.log(res,"没有？");
            var obj = wx.global.data.pm;
            obj.arr = res.data.list;
            if (!res.data.list || res.data.list.length == 0) {
              return wx.showToast({ title: "没有更多数据", icon: 'none', duration: 1000 });
            }
            wx.global.setData({
              pm: obj,
              page: that.data.page + 1
            });
            //关闭加载
            wx.hideLoading();
          },
          fail: function () {
            wx.showToast({ title: "请求失败", icon: 'none', duration: 1000 });
            //关闭加载
            wx.hideLoading();
          }
        })
       
      }
    })


    //
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that=this;
    that.setData({loadshow:false});
    var selectobj = wx.createSelectorQuery().selectAll(".plt-img").boundingClientRect((ret) => {
      
      ret.forEach((item, index) => {
        console.log(item, index);
      })
    });
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
    //上拉加载
    var token = wx.getStorageSync('token');

    var that = this 
    //从接口获取数据
    var data = {
      'token': token,
      'type': that.data.typeNum,
      'size': that.data.size,
      'page': that.data.page,
    };
    //如果离我最近
    if (this.data.typeNum == 1){
      data.near = that.data.near
      //如果搜索
    } else if (that.data.inputValue){
      data.addr_name = that.data.inputValue//如果全部数据
    } 
    wx.request({
      url: util.api() + 'ruan.php?s=/Apicheck/users',
      data: data,
      method: 'get',
      success: function (res) {
        if (!res.data.list || res.data.list.length == 0) {
          return wx.showToast({ title: "没有更多数据", icon: 'none', duration: 1000 });
        }
        var obj = that.data.pm;
        obj.arr.push(...res.data.list);
        that.setData({
          pm: obj
        });
      },
      fail: function () {
        console.log("yan");
        wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
      }
    })
    this.setData({
      page: this.data.page + 1
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  showImg() {

    let group = this.data.group

    let height = this.data.height  // 页面的可视高度



    wx.createSelectorQuery().selectAll('.ptl-img').boundingClientRect((ret) => {

      ret.forEach((item, index) => {
          console.log(item);
        if (item.top <= height) {
          //判断是否在显示范围内

          group[index].show = true // 根据下标改变状态

        }

      })

      this.setData({

        group

      })

    }).exec()



  },
  ssfn:function(){console.log("你可以不服啊");},
  /*监听滚动事件*/
  onPageScroll:function(res){
    
  }

})