//index.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tablebar: 4,
    is_login: true,
    add_mo: 0,
    is_yue_open:0,
	is_open_commiss:0,
    inputValue:0,
    getfocus:false,
    showguess:true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    var token = wx.getStorageSync('token');
    console.log(util.check_login())
    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }else{
        this.setData({ is_login: false })
        
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_user_info/token/' + token,
      method: 'get',
      success: function (res) {
       
        that.setData({
          member_info: res.data.data,
          is_yue_open: res.data.is_yue_open,
		  is_open_commiss: res.data.is_open_commiss
        });
      }
    })
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/per_page/12/is_index_show/1/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {
        if(res.data.code ==0)
        {
          if (res.data.data.length > 0) {
            that.setData({
              showguess: false,
              guessdata: res.data.data
            });
          }
        }
    
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  close_win: function () {
    this.setData({ is_login: true });
  },
  bindGetUserInfo: function (e) {
    util.login('/pages/dan/me');
  },
  choseWeixinAddress: function()
  {
    var that = this;
    var add_mo = this.data.add_mo;

    wx.getSetting({
      success: function(res){
        
        var add_scope = res.authSetting;
        if (add_scope['scope.address'] || add_mo == 0)
        {
          that.load_wx_add();
        }else{
          wx.openSetting({
            success: function(res)  {
              
              var add_scope = res.authSetting;
              if (add_scope['scope.address']) {
                that.load_wx_add();
              }
              
            }
          })
        }
        that.setData({
          add_mo: 1
        })
        
      }    
    })
    
    
  },

  bindKeyInput:function(e)
  {
    console.log(e);
  },
  charge_form:function(){
    this.setData({
      showModal: true
    })
    console.log(12);
  },
  shenqing_tuan:function()
  {
    //申请成功
    var token = wx.getStorageSync('token');
   
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/apply/token/' + token,
      method: 'get',
      success: function (res) {
        
        if(res.data.code ==0)
        {
          wx.showToast({
            title: '申请成功',
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon:'none'
          })
        }
      }
    })
  },
  load_wx_add:function(){
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var token = wx.getStorageSync('token');
        wx.request({
          url: util.api() + 'index.php?s=/Apicheckout/add_weixinaddress/token/' + token,
          data: res,
          method: 'POST',
          success: function (msg) {
            console.log(msg.data);
          }
        })
        that.setData({
          address: res,
          addressState: true
        })
      }
    })
  },
  goLink: function (event) {
    let link = event.currentTarget.dataset.link;
    wx.reLaunch({
      url: link
    })
  },
  goLink2: function (event) {
    let link = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    if (pages_all.length > 3) {
      wx.redirectTo({
        url: link
      })
    } else {
      wx.navigateTo({
        url: link
      })
    }


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },
  inputChange:function(e){
    console.log(e.detail.value);
    this.setData({
      inputValue: e.detail.value
    })
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    //
    var money = parseFloat( this.data.inputValue );
    
    if (money <= 0)
    {
      wx.showToast({
        title: '请填写充值金额',
        icon: 'success',
        duration: 2000
      })
      this.setData({
        getfocus: true
      })

    }else {
      this.hideModal();
      var that = this;
      var token = wx.getStorageSync('token');
      
      wx.request({
        url: util.api() + 'index.php?s=/Apicheckout/wxcharge/token/' + token + '/money/' + money,
        success: function (res) {
          wx.requestPayment({
            "appId": res.data.appId,
            "timeStamp": res.data.timeStamp,
            "nonceStr": res.data.nonceStr,
            "package": res.data.package,
            "signType": res.data.signType,
            "paySign": res.data.paySign,
            'success': function (wxres) {

              var pages_all = getCurrentPages();
              if (pages_all.length > 3) {
                wx.redirectTo({
                  url: '/pages/dan/me'
                })
              } else {
                wx.navigateTo({
                  url: '/pages/dan/me'
                })
              }

            },
            'fail': function (res) {
              console.log(res);
            }
          })
        }
      })

    }
    
  }
})