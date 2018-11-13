var util = require('../../utils/util.js');
Page({
  data:{
    navState: 0,
    address:{},
    ssvoucher_list:[],
    addressState:false,
 tips:'有什么想对商家说的可以写在这里哦~',
    goods:{},
    buy_type:'',
        pickname:'请选择自提点',
    ck_yupay:0,
    is_yue_open:0,
    comment:'',
    tab_index:1,
    total_free:0,
    is_ziti:0,
    pick_up_id:0,
    hide_quan:true,
    dispatching:'express',
    pick_up_arr:0,
    idcard:'',
    focus_name:false,
    seller_chose_id:0,
    focus_mobile:false,	
    seller_chose_store_id:0,
    voucher_id_arr:[],
	use_quan_list:[],
    can_sub : 1,
    pay_str:'立即支付',
    yupay:0,
    yu_money:0,
    ziti_name:'',
    add_mo:0,
    ziti_mobile:'',
    skustate:0
  },
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');

    //token = 'b6943e0ceb402080033ef419931216a9';
   
    wx.closeSocket();
   
    wx.request({
      url: util.api() + 'index.php?s=/Apicart/checkout/token/' + token + '/buy_type/' + options.type,
      success: function (res) {
        
        var addres = 0;
        //is_pin_over
        if (res.data.is_pin_over ==1)
        {
          wx.showToast({
            title: '您参与的参团已成团，您将新开一个团！',
          })
        }
        if (res.data.address != null)
        {
          addres = 1;
        } 
        
        var seller_chose_id = 0;
        var seller_chose_store_id = 0;
        var seller_goods = res.data.seller_goodss;
        
        for (var i in seller_goods) {
          if (seller_goods[i].show_voucher == 1) {
            seller_chose_id = seller_goods[i].chose_vouche.id;
            seller_chose_store_id = seller_goods[i].chose_vouche.store_id;
          }
        }

        if (addres==1){
          
          that.setData({
            address: {
              provinceName: res.data.address.province_name,
              cityName: res.data.address.city_name,
              countyName: res.data.address.country_name,
              detailInfo: res.data.address.address,
              telNumber: res.data.address.telephone,
              userName: res.data.address.name,
              idcard: res.data.address.idcard,
            },
            addressState: true,
            ziti_name: res.data.ziti_name,
            idcard: res.data.address.idcard,
            ziti_mobile: res.data.ziti_mobile,
            is_ziti: res.data.is_ziti,
            pick_up_arr: res.data.pick_up_arr,
            seller_goodss: res.data.seller_goodss,
            seller_chose_id: seller_chose_id,
            seller_chose_store_id: seller_chose_store_id,
            goods: res.data.goods,
            buy_type: res.data.buy_type,
            yupay: res.data.can_yupay,
            is_yue_open: res.data.is_yue_open,
            yu_money: res.data.yu_money,
            total_free: res.data.total_free
          })

         
        }else{
          that.setData({
            
            addressState: false,
            goods: res.data.goods,
            is_ziti: res.data.is_ziti,
            pick_up_arr: res.data.pick_up_arr,
            seller_goodss: res.data.seller_goodss,
            seller_chose_id: seller_chose_id,
            seller_chose_store_id: seller_chose_store_id,
            buy_type: res.data.buy_type,
            yupay: res.data.can_yupay,
            is_yue_open: res.data.is_yue_open,
            yu_money: res.data.yu_money,
	     ziti_name: res.data.ziti_name,
            ziti_mobile: res.data.ziti_mobile,
            total_free: res.data.total_free
          })
        }
      }
    })
  },
  ck_wxpays: function(){
    this.setData({
      ck_yupay: 0
    })
  },
  tabchange: function (e) {
    var index = e.currentTarget.dataset.index;
    if(index == 2)
    {
      this.setData({
        dispatching: 'pickup',
        tips:'',
        tab_index: index
      })
    }else {
     
      this.setData({
        dispatching: 'express',
        skustate: 0,
        tab_index: index,
        tips:'有什么想对商家说的可以写在这里哦~'
      })
      this.load_new_price(); 
    }

  },
  ck_yupays:function(){
    var yupay = this.data.yupay;
    if (yupay == 0)
    {
      wx.showToast({
        title: '余额不足',
      })
      return false;
    }
    var ck_yupay = this.data.ck_yupay;
    if (ck_yupay == 1)
    {
      this.setData({
        ck_yupay: 0
      })
    } else {
      this.setData({
        ck_yupay: 1
      })
    }
    
  },
  navShow: function () {
    this.setData({
      navState: 1
    })
  },
    click_hide_dialog:function()
  {
    this.setData({
      skustate: 0
    })
  },
  navHide: function () {
    this.setData({
      navState: 0
    })
  },
   load_new_price:function(){
    // dispatching:'express',
    var that = this;
    var token = wx.getStorageSync('token');
    var buy_type = this.data.buy_type;
    var dispatching = this.data.dispatching;
    wx.request({
      url: util.api() + 'index.php?s=/Apicart/checkout/token/' + token + '/buy_type/' + buy_type + '/dispatching/' + dispatching,
      success: function (res) {
        //addressState:true,dispatching
        var t_addressState = false;
       
        if (res.data.address != null || dispatching=='pickup') {
          t_addressState = true;
        }
        console.log(res.data.address);
        console.log(dispatching);
        console.log(t_addressState);
        if (res.data.address != null) {
          that.setData({
            address: {
              provinceName: res.data.address.province_name,
              cityName: res.data.address.city_name,
              countyName: res.data.address.country_name,
              detailInfo: res.data.address.address,
              telNumber: res.data.address.telephone,
              userName: res.data.address.name,
            },
            addressState: t_addressState,
            goods: res.data.goods,
            buy_type: res.data.buy_type,
            total_free: res.data.total_free
          })
        }else{
          that.setData({
            addressState: t_addressState,
            goods: res.data.goods,
            buy_type: res.data.buy_type,
            total_free: res.data.total_free
          })
        }

        

      }
    })
  },
  show_voucher: function (event){
    var that = this;
    var serller_id = event.currentTarget.dataset.seller_id;
	var chose_voucher_id = event.currentTarget.dataset.chose_voucher_id;
	
    var voucher_list = [];
    var seller_chose_id = chose_voucher_id;
    var seller_chose_store_id = this.data.seller_chose_store_id;
    var seller_goods = this.data.seller_goodss;
    for (var i in seller_goods)
    {
      
      var s_id = seller_goods[i].store_info.s_id;
      if (s_id == serller_id)
      {
        voucher_list = seller_goods[i].voucher_list;
        if (seller_chose_id == 0)
        {
          seller_chose_id = seller_goods[i].chose_vouche.id;
          seller_chose_store_id = seller_goods[i].chose_vouche.store_id;
        }  
      }
    }
    
    that.setData({
      ssvoucher_list: voucher_list,
      voucher_serller_id: serller_id,
      seller_chose_id: seller_chose_id,
      seller_chose_store_id: seller_chose_store_id,
      hide_quan:false
    })

// seller_goodss: res.data.seller_goodss,

  },
  close_voucher:function(){
    this.setData({
      hide_quan: true
    })
  },
  chose_voucher_id:function(event){
    var voucher_id = event.currentTarget.dataset.voucher_id;
    var seller_id = event.currentTarget.dataset.seller_id;
   
    //item.chose_vouche chose_vouche
	
	var seller_goodss = this.data.seller_goodss;
	
	var use_quan_list = [];
	
	var seller_chose_id = 0;
	var seller_chose_store_id = 0;
	
	for (var i in seller_goodss) {
	  if (seller_goodss[i].show_voucher == 1 && seller_goodss[i].store_info.s_id != seller_id) {
		
		seller_chose_id = seller_goodss[i].chose_vouche.id;
		seller_chose_store_id = seller_goodss[i].store_info.s_id;
		
		use_quan_list.push( seller_chose_store_id+'_'+seller_chose_id );
	  }
	}
	use_quan_list.push( seller_id+'_'+voucher_id )
	
	
	this.setData({
		use_quan_list:use_quan_list
	})
		
	//console.log(use_quan_list); this.data.use_quan_list
	
	var use_quan_str = "";
	use_quan_str = use_quan_list.join('@');
	
    var that = this;
    var token = wx.getStorageSync('token');
    var buy_type = that.data.buy_type;

    wx.request({
      url: util.api() + 'index.php?s=/Apicart/checkout/token/' + token + '/buy_type/' + buy_type + '/use_quan_str/' + use_quan_str,
      success: function (res) {

        var addres = 0;
        if (res.data.address != null) {
          addres = 1;
        }
        var seller_chose_id = 0;
        if (res.data.seller_goodss.show_voucher == 1) {
          seller_chose_id = res.data.seller_goodss.show_voucher.id
        }

        if (addres == 1) {

          that.setData({
            address: {
              provinceName: res.data.address.province_name,
              cityName: res.data.address.city_name,
              countyName: res.data.address.country_name,
              detailInfo: res.data.address.address,
              telNumber: res.data.address.telephone,
              userName: res.data.address.name,
            },
            addressState: true,
            seller_goodss: res.data.seller_goodss,
            seller_chose_id: voucher_id,
            seller_chose_store_id: seller_id,
            hide_quan: true,
            goods: res.data.goods,
            buy_type: res.data.buy_type,
            yupay: res.data.can_yupay,
            is_yue_open: res.data.is_yue_open,
            total_free: res.data.total_free
          })


        } else {
          that.setData({

            addressState: false,
            goods: res.data.goods,
            seller_goodss: res.data.seller_goodss,
            seller_chose_id: voucher_id,
            seller_chose_store_id: seller_id,
            hide_quan: true,
            buy_type: res.data.buy_type,
            yupay: res.data.can_yupay,
            is_yue_open: res.data.is_yue_open,
            total_free: res.data.total_free
          })
        }

      }
    })

    //voucher_id voucher_id_arr 
    
  },
  chooseZiti:function(){
    this.setData({
      skustate: 1,
      tips:'',
    })
  },
  bindNameInput: function (e){
    this.setData({
      ziti_name: e.detail.value
    })
  },
  bindMobileInput: function (e){
    this.setData({
      ziti_mobile: e.detail.value
    })
  },
  bindIdcardInput :function(e){
    this.setData({
      idcard: e.detail.value
    })
  },
  textarea_input: function (event){
    var val = event.detail.value;
    this.setData({
      comment: val
    })
  },
  chose_mendian:function(e){
    let men_id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    this.load_new_price();
    this.setData({
      pick_up_id: men_id,
      can_sub: 1,
      skustate:0,
      tips: '有什么想对商家说的可以写在这里哦~',
      dispatching:'pickup',
      addressState: true,
      pickname: name
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
            var buy_type = that.data.buy_type;
            wx.request({
              url: util.api() + 'index.php?s=/Apicart/checkout/token/' + token + '/buy_type/' + buy_type,
              success: function (res) {

                var seller_chose_id = 0;
                if (res.data.seller_goodss.show_voucher == 1) {
                  seller_chose_id = res.data.seller_goodss.show_voucher.id
                }

                that.setData({
                  address: {
                    provinceName: res.data.address.province_name,
                    cityName: res.data.address.city_name,
                    countyName: res.data.address.country_name,
                    detailInfo: res.data.address.address,
                    telNumber: res.data.address.telephone,
                    userName: res.data.address.name,
                  },
                  seller_chose_id: seller_chose_id,
                  seller_goodss: res.data.seller_goodss,
                  addressState: true,
                  goods: res.data.goods,
                  buy_type: res.data.buy_type,
                  yupay: res.data.can_yupay,
                  is_yue_open: res.data.is_yue_open,
                  total_free: res.data.total_free
                })

              }
            })

          }
        })

      }
    })
  },
  chooseAddress:function(){
    var add_mo = this.data.add_mo;
    var that = this;
    wx.getSetting({
      success: function (res) {

        var add_scope = res.authSetting;
        if (add_scope['scope.address'] || add_mo == 0) {
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
        that.setData({
          add_mo:1
        })

      }
    })
  },
  goLink: function (event) {
    let link = event.currentTarget.dataset.link;
    wx.redirectTo({
      url: link
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
    this.setOrder();

  },
  setOrder:function(){
    var that = this;
    var token = wx.getStorageSync('token');
    var addressState = this.data.addressState;
    var voucher_id = this.data.seller_chose_id;
   var is_ziti = this.data.is_ziti;
    var seller_chose_store_id = this.data.seller_chose_store_id;
    var ck_yupay = this.data.ck_yupay;
    var comment = this.data.comment;
    var can_sub = this.data.can_sub;
     var dispatching = this.data.dispatching;
     var idcard = this.data.idcard;

     if (is_ziti == 2)
    {
      addressState = true;
      dispatching = 'pickup';
    }else{
      //idcard
      console.log(idcard);
       if (idcard == '')
       {
         wx.showToast({
           title: '请填写身份证号',
           icon:'none'
         })
        return false;
       }

       var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if (reg.test(idcard) === false) {
          wx.showToast({
            title: '请输入与收件人姓名一致的身份证!',
            icon: 'none',
            duration: 1000,
            mask: true
          })
          return;
        }


    }
     
    if (can_sub != 1)
    {
      return false;
    }
    this.setData({
      can_sub:0
    })

    // addressState: false,
    if (!addressState)
    {
      wx.showToast({
        title: '请选择收货地址',
      })
      this.setData({
        can_sub: 1,
        pay_str:'立即支付'
      })
      return false;
    }
  // seller_chose_id: voucher_id,
    //seller_chose_store_id  quan_arr
	
	
	var seller_goodss = this.data.seller_goodss;
	
	var quan_arr = [];
	
	var seller_chose_id = 0;
	var seller_chose_store_id = 0;
	
	for (var i in seller_goodss) {
	  if (seller_goodss[i].show_voucher == 1 ) {
		
		seller_chose_id = seller_goodss[i].chose_vouche.id;
		seller_chose_store_id = seller_goodss[i].store_info.s_id;
		
		quan_arr.push( seller_chose_store_id+'_'+seller_chose_id );
	  }
	}
	
	
 var t_ziti_name = this.data.ziti_name;
    var t_ziti_mobile = this.data.ziti_mobile;
    
	var pick_up_id = that.data.pick_up_id;
    if (dispatching == 'pickup')
    {
      if (t_ziti_name == '')
      {
        this.setData({
          focus_name: true
        })
        wx.showToast({
          title: '请填写联系人',
        })
        return false;
      }
      if (t_ziti_mobile == '') {
        this.setData({
          focus_mobile: true
        })
        wx.showToast({
          title: '请填写联系方式',
        })
        return false;
      }
      if (pick_up_id == 0)
      {
        this.setData({
          skustate: 1
        })
        wx.showToast({
          title: '请选择自提点',
        })
        return false;
      }

    }
    this.setData({
      pay_str:'支付中..'
      })
    wx.request({
      url: util.api() + 'index.php?s=/Apicheckout/sub_order/token/' + token,
      data: {
        pay_method:'wxpay',
        quan_arr: quan_arr,
        buy_type: that.data.buy_type,
		pick_up_id: that.data.pick_up_id,
        dispatching: that.data.dispatching,
        ziti_name: t_ziti_name,
        comment: comment,
        idcard:idcard,
		    ziti_mobile: t_ziti_mobile,
        ck_yupay: ck_yupay
      },
      method: 'POST',
      success: function (res) {
        /*wx.redirectTo({
          url: '/pages/share/index?id=79'
        })
       */
      //has_yupay
        if(res.data.code == 35){
          wx.showToast({
            title: res.data.data,
            icon: 'none',
            duration: 2000
          })
          return;
        }

        if (res.data.has_yupay == 1)
        {
          var order_id = res.data.order_id;
          //buytype
          if (that.data.buy_type == 'pin') {
            wx.redirectTo({
              url: '/pages/share/index?id=' + res.data.order_id + '&is_show=1'
            })
          } else {
            wx.redirectTo({
              url: '/pages/order/orderju?id=' + res.data.order_all_id+'&is_show=1'
            })
          }

        }else{
          var order_id = res.data.order_id;
          wx.requestPayment({
            "appId": res.data.appId,
            "timeStamp": res.data.timeStamp,
            "nonceStr": res.data.nonceStr,
            "package": res.data.package,
            "signType": res.data.signType,
            "paySign": res.data.paySign,
            'success': function (wxres) {

              //buytype
              if (that.data.buy_type == 'pin') {
                wx.redirectTo({
                  url: '/pages/share/index?id=' + res.data.order_id +'&is_show=1'
                })
              } else {
                wx.redirectTo({
                  url: '/pages/order/orderju?id=' + res.data.order_all_id+'&is_show=1'
                })
              }

            },
            'fail': function (res2) {

              wx.redirectTo({
                url: '/pages/order/orderju?id=' + res.data.order_all_id
              })
            }
          })
        }

        
      }
    })
  }
})