// pages/goods/bargain.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'x0',
    order : ['x0', 'x1', 'x2', 'x3', 'x4'],
    scoll_animate:true,
    tip_html: '^_^已经到底了',
    is_hiden_kan:true,
    kan_rules_str:'',
    list: [],
    skustate: 0,
    goods_id: 0,
    options: [],
    address_list:[],
    address_id:0,
    goods_image: {},
    pageNum: 1,
    is_login: false,
    hasRefesh: false,
    hidetip: true,
    hide_address:true,
    LoadingComplete: true,
    share_title: '',
    idcard: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    util.check_login().then((resolve)=>{
      if (resolve){
        this.setData({ is_login: true })
      }
    })
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_addata',
      data: {
        "type": 'wepro_bargain_ad',
      },
      success: function (res) {
        that.setData({
          slide: res.data.data,
        })
      }
    })
    setTimeout(function () {
      that.scrolls()
    }, 1000)


    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_bargain_pintuan',
      success: function (res) {

        if (res.data.code == 0) {
          that.setData({
            list: res.data.data,
            success_order_list: res.data.success_order_list,
            kan_rules_str: res.data.kan_rules_str,
            hidetip: true
          })
        } else {
          that.setData({
            success_order_list: res.data.success_order_list,
            kan_rules_str: res.data.kan_rules_str,
          }) 
        }

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
  hide_guize_box: function () {
    this.setData({ is_hiden_guize: true });
    this.setData({ is_hiden_kan: true });
  },
  goOrderfrom_bt: function (e) {
    var goods_id = e.detail.target.dataset.type;

    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
        console.log(res);
      }
    })
    this.setData({ is_hiden_kan: false });
  },
  hide_address: function(){
    this.setData({hide_address:true})
  },
  
   
  imageLoad: function (e) {
    var imageSize = util.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
  go_bargain_me:function(){
    wx.redirectTo({
      url: '/pages/goods/bargain_me'
    })
  },
  go_bargain_index: function () {
    wx.redirectTo({
      url: '/pages/goods/bargain'
    })
  },
  goOrderfrom: function (e) {
    var from_id = e.detail.formId;
    var token = wx.getStorageSync('token');

    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_member_form_id/token/' + token + '/from_id/' + from_id,
      success: function (res) {
        console.log(res);
      }
    })
    this.goOrder();

  },
  loadMore: function () {

    let that = this;
    if (!that.data.hasRefesh) {
      that.setData({
        hasRefesh: true,
        hidetip: false
      });
      wx.request({
        url: util.api() + 'index.php?s=/Apiindex/load_index_bargain_pintuan',
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
              hasRefesh: true,
              hidetip: true
            });
            
            /**
           
             */
          }
        }
      })
    } else {
      
    }
  },
  bindGetUserInfo: function (e) {
    var id = e.currentTarget.dataset.type;
    util.login('/pages/goods/bargain');
    this.setData({ is_login: true })
  },
  kan_handler: function(e){

    if (!util.check_login()) {
      util.login('/pages/goods/bargain');
      return false;
    }	
    var goods_id = e.currentTarget.dataset.goods_id;
    var s_data = this.data.list;
    var cur_data = [];
    var that = this;
    this.setData({ goods_id: goods_id, sku:''})
    

    for(var i in s_data)
    {
      if( s_data[i].goods_id == goods_id)
      {
        cur_data = s_data[i];
      }
    }

    if (cur_data.options.list.length > 0) {
      let list = cur_data.options.list;
      let arr = [];
      for (let i = 0; i < list.length; i++) {
        let sku = list[i]['option_value'][0];
        let temp = {
          name: sku['name'],
          id: sku['option_value_id'],
          index: i,
          idx: 0
        };
        arr.push(temp);
      }
      //把单价剔除出来begin

      var id = '';
      for (let i = 0; i < arr.length; i++) {
        if (i == arr.length - 1) {
          id = id + arr[i]['id'];
        } else {
          id = id + arr[i]['id'] + "_";
        }
      }


      var that = this;
      wx.request({
        url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + cur_data.goods_id + '/sku_str/' + id,
        success: function (res) {

          var goods = {};
          goods.quantity = res.data.data.value.quantity;
          goods.image_thumb = res.data.data.value.image;
          goods.danprice = res.data.data.value.dan_price;


          that.setData({
            goods: goods,
            skudanprice: goods.danprice
          })
          that.setData({
            skupin_price: res.data.data.value.pin_price,
            sku_str:id
          })

          


        }
      })

      //end
      that.setData({
        sku: arr,
        goods_id: goods_id,
        options: cur_data.options,
        skustate: 1
      })
    } else {
      that.goOrder();
    }

  },
  closeSku :function ()
  {
    this.setData({ skustate: 0})
  },
  chose_address_detai:function(e){

    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(this.data.idcard) === false) {
      wx.showToast({
        title: '请输入与收件人姓名一致的身份证!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    console.log(this.data.idcard)
    
    var address_id = e.currentTarget.dataset.address_id;
    // let quan_id = e.currentTarget.dataset.address_id;
    console.log(address_id);
    this.setData({address_id:address_id});
    this.do_kang();
    //begin kanjiang 

  },
  idcardInput: function (e) {
    this.setData({ idcard: e.detail.value });
  },
  do_kang:function(){
    console.log(this.data.goods_id);
    console.log(this.data.address_id);
    console.log(this.data.sku_str);
    this.setData({ hide_address: true })

    var token = wx.getStorageSync('token');
    //get_user_goods_qrcode token
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_user_goods_qrcode/token/' + token,
      data: { goods_id: this.data.goods_id, address_id: this.data.address_id, sku_str: this.data.sku_str, idcard: this.data.idcard},
      method: 'POST',
      success: function (msg) {
        
        if (msg.data.code == 0) {
          var url = "/pages/goods/bargain_detail?id=" + msg.data.id;
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
        }else {
          wx.showToast({
            title: msg.data.data,
            icon: 'none',
            duration: 3000,
            mask: true
          })
        }

      }
    })


  },
  chooseAddress: function () {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (reg.test(this.data.idcard) === false) {
      wx.showToast({
        title: '请输入与收件人姓名一致的身份证!',
        icon: 'none',
        duration: 1000,
        mask: true
      })
      return;
    }
    var add_mo = this.data.add_mo;
    var that = this;
    wx.getSetting({
      success: function (res) {
        that.setData({ hide_address: true })
        var add_scope = res.authSetting;

        if (add_scope['scope.address'] || add_scope['scope.userInfo']) {
          that.load_wx_add();
        } else {
          wx.openSetting({
            success: function (res) {

              var add_scope = res.authSetting;
              if (add_scope['scope.address']) {
                that.load_wx_add();
              }

            }
          })
        }
      }
    })
  },
  load_wx_add: function () {
    var that = this;

    wx.chooseAddress({
      success: function (res) {
        var token = wx.getStorageSync('token');
        wx.request({
          url: util.api() + 'index.php?s=/Apicheckout/add_weixinaddress/token/' + token,
          data: res,
          method: 'POST',
          success: function (msg) {
            if (msg.data.code == 0) {
              that.setData({ address_id: msg.data.address_id });
              console.log(msg.data.address_id);
              //do something
              that.do_kang();
            }

          }
        })

      }
    })
  },
  goOrder: function (){
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_user_addresslist/token/' + token,
      success: function (res) {
        if(res.data.code == 0)
        {
          console.log(res.data.data);
          that.setData({
            address_list: res.data.data,
          })
        }
      }
    })

    this.setData({
      skustate:0,
      hide_address:false
    })
  },
  upper: function (e) {
    console.log(e)
  },
  lower: function (e) {
    console.log(e)
  },
  selectSku: function (event) {
    var that = this;
    let str = event.currentTarget.dataset.type;
    let obj = str.split("_");
    let arr = that.data.sku;
    let temp = {
      name: obj[3],
      id: obj[2],
      index: obj[0],
      idx: obj[1]
    };
    arr.splice(obj[0], 1, temp);
    that.setData({
      sku: arr
    })
    var id = '';
    for (let i = 0; i < arr.length; i++) {
      if (i == arr.length - 1) {
        id = id + arr[i]['id'];
      } else {
        id = id + arr[i]['id'] + "_";
      }
    }
    wx.request({
      url: util.api() + 'index.php?s=/Apigoods/get_goods_option_data/id/' + that.data.goods_id + '/sku_str/' + id,
      success: function (res) {
      
        var goods = {};
        goods.quantity = res.data.data.value.quantity;
        goods.image_thumb = res.data.data.value.image;
        goods.danprice = res.data.data.value.dan_price;

        
        that.setData({
          goods: goods,
          skudanprice: goods.danprice
        })
        that.setData({
          skupin_price: res.data.data.value.pin_price,
          sku_str:id
        })
      }
    })
  },
  scrolls: function (e) {
    var that = this;
    for (var i = 0; i < this.data.order.length; ++i) {
      if (this.data.order[i] === this.data.toView) {
        if(i == this.data.order.length - 1)
        {
          i = -1;
          that.setData({ scoll_animate:false})
        }else{
          that.setData({ scoll_animate: true })
        }
        this.setData({
          toView: this.data.order[i + 1]
        })
        break
      }
    }
    setTimeout(function () {
      that.scrolls()
    }, 2000)
  },
  tap: function (e) {
    
  },
  goBannlinc: function (event) {
    let url = event.currentTarget.dataset.url;
    if (url == '/pages/index/webview') {
      var id = event.currentTarget.dataset.id;
      url = url + '?id=' + id;
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
      return false;
    }
    //console.log(pages_all.length);
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
    console.log(23);
    this.loadMore();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var share_title = this.data.share_title;

    var share_id = wx.getStorageSync('member_id');

    var share_path = 'pages/goods/bargain?share_id=' + share_id;

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