// components/accredit.js
Component({
  /*进入页面节点树执行*/
  created:function(){
    
  },
  /*组件布局完成后执行*/
  ready:function(){
    wx.that = this;
    var that = this;
    wx.getUserInfo({
      success: function () {
        that.setData({ showModalStatus:false});
      },
      fail: function () {
        that.setData({ showModalStatus: true });
      }
    });
    this.showM();
  },
  /**
   * 组件的属性列表
   */
  properties: {
    navurl:{
      type:"String"
    },
    navtitle:{
      type:"String"
    },
    navcontent:{
      type:"String"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closePlug:function(){
      // 点击灰屏关闭弹窗
      this.setData({showModalStatus:false});
    },
    openPlug:function(){
      // 防止触发事件被关闭
    },
    getUserInfo:function(e){
      // 判断用户是否授权
      var that=this,judge=e.detail.userInfo;


      // 如果未授权，跳出授权弹窗
      if(judge){
        wx.showToast({title:"授权成功",success:function(){

          that.setData({showModalStatus:false});
          wx.reLaunch({url:"../../mine"});
          try{
            wx.reLaunch({url:wx.that.data.navurl})
          }catch(err){

            wx.reLaunch({url:"../../index"});
          }
        }});
      }else{
        wx.showToast({title:"未授权",icon:"none"});
      }
    },
    mmm:function(res){
      this.setData({showModalStatus:false});
      
    },
    showM: function () {
      
      this.animationModel();
    },
    warnCancel: function () {
      this.setData({ showModalStatus: false, aniData: null, warnAni: null });
    },
    warnConfirm: function (res) {
      
    },
    animationModel: function (dataT) {
      var ani = wx.createAnimation({
        timingFunction: "linear",
        delay: 0,
        duration: 200
      });
      var warnAni = wx.createAnimation({
        timingFunction: "linear",
        delay: 0,
        duration: 200
      });
      warnAni.opacity(1).step();
      ani.translateY(0).translateY(200).step();
      this.setData({
        aniData: ani.export(),
        warnAni: warnAni.export()
      });
    }
  }
})
