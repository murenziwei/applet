// pages/car/car.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allselect: false,
    allnum: 0,
    allcount: "0.00",
	tablebar:6,
    recount: "0.00",
    carts: [],
    s_num:0
  },
  //编辑点击事件处理函数
  edit: function (e) {
    var index = parseInt(e.target.dataset.index);
    this.data.carts[index].caredit = "none";
    this.data.carts[index].finish = "inline";
    for (var i = 0; i < this.data.carts[index].shopcarts.length; i++) {
      this.data.carts[index].shopcarts[i].edit = "none";
      this.data.carts[index].shopcarts[i].finish = "inline";
      this.data.carts[index].shopcarts[i].description = "onedit-description";
      this.data.carts[index].shopcarts[i].cartype = "block";
    }
    this.setData({
      carts: this.data.carts
    })

  }, //完成点击事件处理函数
  finish: function (e) {
    var index = parseInt(e.target.dataset.index);
    this.data.carts[index].caredit = "inline";
    this.data.carts[index].finish = "none";
    for (var i = 0; i < this.data.carts[index].shopcarts.length; i++) {
      this.data.carts[index].shopcarts[i].edit = "inline";
      this.data.carts[index].shopcarts[i].finish = "none";
      this.data.carts[index].shopcarts[i].description = "description";
      this.data.carts[index].shopcarts[i].cartype = "inline";
    }
    this.setData({
      carts: this.data.carts
    })
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
  goLink: function (event) {
    let url = event.currentTarget.dataset.link;
    var pages_all = getCurrentPages();
    wx.reLaunch({
      url: url
    })
  },
  //店铺点击选择事件
  shopselect: function (e) {
    var index = parseInt(e.target.dataset.index);
    var allselect = this.data.allselect;
    var isselect = this.data.carts[index].isselect;
    var allnum = 0;
    var allcount = 0.00;
    var count = 0.00;
    if (isselect == true) {//店铺为选中状态
      this.data.carts[index].isselect = false;
      allselect = false;
      for (var i = 0; i < this.data.carts[index].shopcarts.length; i++) {//循环商店下商品，改成不选中
        if (this.data.carts[index].shopcarts[i].isselect == true) {
          this.data.carts[index].shopcarts[i].isselect = false;
          allnum = parseInt( allnum ) + parseInt( this.data.carts[index].shopcarts[i].goodsnum );
          this.data.carts[index].goodstypeselect = this.data.carts[index].goodstypeselect - 1;
        }

      }
      allnum = this.data.allnum - allnum;//去除不选中商店的产品数量
      allcount = parseFloat(this.data.allcount) - parseFloat(this.data.carts[index].count);
      this.data.carts[index].count = "0.00";
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    } else {
      var addcount = 0.00;
      this.data.carts[index].isselect = true;
      for (var i = 0; i < this.data.carts[index].shopcarts.length; i++) {
        if (this.data.carts[index].shopcarts[i].isselect == false) {
          this.data.carts[index].shopcarts[i].isselect = true;
          this.data.carts[index].goodstypeselect = this.data.carts[index].goodstypeselect + 1;
          allnum = parseInt(allnum) + parseInt( this.data.carts[index].shopcarts[i].goodsnum );
          addcount = addcount + parseFloat(this.data.carts[index].shopcarts[i].currntprice) * this.data.carts[index].shopcarts[i].goodsnum;
        }
        count = count + parseFloat(this.data.carts[index].shopcarts[i].currntprice) * this.data.carts[index].shopcarts[i].goodsnum;
      }
      allnum = this.data.allnum + allnum;
      allcount = parseFloat(this.data.allcount) + addcount;
      this.data.carts[index].count = count.toFixed(2);
      var flag = 1;
      for (var i in this.data.carts){
     // for (var i = 0; i < this.data.carts.length; i++) {//是否是全部选中
        for (var j = 0; j < this.data.carts[i].shopcarts.length; j++)
          if (this.data.carts[i].shopcarts[j].isselect == false)
            flag = 0;
      }
      if (flag == 1) {//是全部选中
        allselect = true;
      }
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    }
    this.go_record();
  },

  //点击商品选中事件函数
  goodsselect: function (e) {

    var parentid = parseInt(e.target.dataset.parentid);
    var index = parseInt(e.target.dataset.index);
    var allselect = this.data.allselect;
    var isselect = this.data.carts[parentid].shopcarts[index].isselect;
    console.log(isselect);

    if (isselect == true) {//商品选中状态
      this.data.carts[parentid].shopcarts[index].isselect = false;
      if (allselect)
        allselect = false;

      this.data.carts[parentid].goodstypeselect = parseInt( this.data.carts[parentid].goodstypeselect) - 1;
      

      if (this.data.carts[parentid].goodstypeselect <= 0) {//选中商品为0
        this.data.carts[parentid].isselect = false;
      }
      var allnum = parseInt(this.data.allnum) - parseInt(this.data.carts[parentid].shopcarts[index].goodsnum);
      var allcount = parseFloat(this.data.allcount) - parseFloat(this.data.carts[parentid].shopcarts[index].currntprice) * this.data.carts[parentid].shopcarts[index].goodsnum;
      var count = parseFloat(this.data.carts[parentid].count) - parseFloat(this.data.carts[parentid].shopcarts[index].currntprice) * this.data.carts[parentid].shopcarts[index].goodsnum;
      this.data.carts[parentid].count = count.toFixed(2);
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    } else {//商品为非选中状态
      this.data.carts[parentid].shopcarts[index].isselect = true;
      this.data.carts[parentid].goodstypeselect = parseInt( this.data.carts[parentid].goodstypeselect) + 1;

      

      if (this.data.carts[parentid].goodstypeselect > 0) {//选中商品个数大于0
        this.data.carts[parentid].isselect = true;
      }
      console.log(this.data.carts);
      var flag = 1;
      //for (var i = 0; i < this.data.carts.length; i++) {//判断是否是全部选中
      for (var i in this.data.carts){

        console.log('in');
        for (var j = 0; j < this.data.carts[i].shopcarts.length; j++)
         
          if (this.data.carts[i].shopcarts[j].isselect == false)
            flag = 0;
      }
     // console.log(flag);

      if (flag == 1) {//全部商品选中
        allselect = true;
      }
      var allnum = parseInt(this.data.allnum) + parseInt(this.data.carts[parentid].shopcarts[index].goodsnum);
      var allcount = parseFloat(this.data.allcount) + parseFloat(this.data.carts[parentid].shopcarts[index].currntprice) * this.data.carts[parentid].shopcarts[index].goodsnum;
      var count = parseFloat(this.data.carts[parentid].count) + parseFloat(this.data.carts[parentid].shopcarts[index].currntprice) * this.data.carts[parentid].shopcarts[index].goodsnum;
      this.data.carts[parentid].count = count.toFixed(2);
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    }
    this.go_record();
  },

  //全部选中事件函数
  allselect: function (e) {
    
    var allselect = this.data.allselect;
    var carts = this.data.carts;
   
    if (allselect) {//点击前为全部选中状态
      allselect = false;
      var allnum = 0;
      var allcount = 0.00;

      for (var i in  this.data.carts) {
        this.data.carts[i].count = "0.00";
        this.data.carts[i].isselect = false;
        this.data.carts[i].goodstypeselect = 0;
        for (var j in this.data.carts[i].shopcarts)
          this.data.carts[i].shopcarts[j].isselect = false;
      }
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    } else {//点击前为不全部选址状态
      allselect = true;
      var allnum = 0;
      var allcount = 0.00;

      for (var i in  this.data.carts) {
        var count = 0;
        this.data.carts[i].isselect = true;
        this.data.carts[i].goodstypeselect = this.data.carts[i].shopcarts.length;
        for (var j in this.data.carts[i].shopcarts) {
          count = count + parseFloat(this.data.carts[i].shopcarts[j].currntprice) * parseFloat(this.data.carts[i].shopcarts[j].goodsnum);
          allnum = parseInt(allnum) + parseInt(this.data.carts[i].shopcarts[j].goodsnum);
          this.data.carts[i].shopcarts[j].isselect = true;
        }
        this.data.carts[i].count = count.toFixed(2);
        allcount = allcount + count;
      }
      //console.log(this.data.carts);

      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2),
        allselect: allselect
      });
    }
    this.go_record();
  },

  //减少商品数量函数
  regoodsnum: function (e) {
    var parentid = parseInt(e.target.dataset.parentid);
    var index = parseInt(e.target.dataset.index);
    var that = this;
    console.log(index);
    console.log(parentid);
    var goodsnum = this.data.carts[parentid].shopcarts[index].goodsnum;
    if (goodsnum == 1) {//减少前商品数量为1
      wx.showModal({
        title: '提示',
        content: '确定删除这件商品吗？',
        confirmColor: '#FF0000',
        success: function (res) {
          if (res.confirm) {
            var del_car_keys = that.data.carts[parentid].shopcarts[index].key;

            if (that.data.carts[parentid].shopcarts[index].isselect == true) {//商品为选中状态
              var allnum = that.data.allnum - 1;
              var allcount = parseFloat(that.data.allcount) - parseFloat(that.data.carts[parentid].shopcarts[index].currntprice);
              var count = parseFloat(that.data.carts[parentid].count) - parseFloat(that.data.carts[parentid].shopcarts[index].currntprice);
              that.data.carts[parentid].count = count.toFixed(2);
              that.data.carts[parentid].goodstype = that.data.carts[parentid].goodstype - 1;
              that.data.carts[parentid].goodstypeselect = that.data.carts[parentid].goodstypeselect - 1
              if (that.data.carts[parentid].goodstype == 0) {//购物车商店商品类别为0，去掉这个商店
                that.data.carts.splice(parentid, 1)
              } else {//不为0，去掉这个商品
                that.data.carts[parentid].shopcarts.splice(index, 1);
              }
              that.setData({
                carts: that.data.carts,
                allnum: allnum,
                allcount: allcount.toFixed(2),
              });
            } else {//商品为非选中状态
              that.data.carts[parentid].goodstype = that.data.carts[parentid].goodstype - 1;
              if (that.data.carts[parentid].goodstype == 0) {
                that.data.carts.splice(parentid, 1)
              } else {
                that.data.carts[parentid].shopcarts.splice(index, 1);
              }
              that.setData({
                carts: that.data.carts
              });
            }
            that.del_car_goods(del_car_keys);

          }
        }
      })
    } else {//减少前商品的数量不为1
      if (this.data.carts[parentid].shopcarts[index].isselect == true) {//商品为选中状态
        var allnum = parseInt( this.data.allnum ) - 1;
        var allcount = parseFloat(this.data.allcount) - parseFloat(this.data.carts[parentid].shopcarts[index].currntprice);
        var count = parseFloat(this.data.carts[parentid].count) - parseFloat(this.data.carts[parentid].shopcarts[index].currntprice);
        that.data.carts[parentid].count = count.toFixed(2);
        this.data.carts[parentid].shopcarts[index].goodsnum = this.data.carts[parentid].shopcarts[index].goodsnum - 1;
        this.setData({
          carts: this.data.carts,
          allnum: allnum,
          allcount: allcount.toFixed(2),
        });
      } else {//商品为非选中状态
        this.data.carts[parentid].shopcarts[index].goodsnum =  parseInt( this.data.carts[parentid].shopcarts[index].goodsnum) - 1;
        this.setData({
          carts: this.data.carts
        });
      }

    }
    that.go_record();
  },

  //添加商品数量函数
  addgoodsnum: function (e) {
    var parentid = parseInt(e.target.dataset.parentid);
    var index = parseInt(e.target.dataset.index);
    var that = this;

    var max_quantity = parseInt(this.data.carts[parentid].shopcarts[index].max_quantity);
   

    if (this.data.carts[parentid].shopcarts[index].isselect == true) {//商品为选中状态
      var allnum = parseInt( this.data.allnum ) + 1;
      var allcount = parseFloat(this.data.allcount) + parseFloat(this.data.carts[parentid].shopcarts[index].currntprice);
      var count = parseFloat(this.data.carts[parentid].count) + parseFloat(this.data.carts[parentid].shopcarts[index].currntprice);
      that.data.carts[parentid].count = count.toFixed(2);

      if (this.data.carts[parentid].shopcarts[index].goodsnum < max_quantity)
      {
        this.data.carts[parentid].shopcarts[index].goodsnum = parseInt( this.data.carts[parentid].shopcarts[index].goodsnum ) + 1;
      } else{
        this.data.carts[parentid].shopcarts[index].goodsnum = max_quantity;
        allnum--;
        var msg = '最多购买' + max_quantity+'个';
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
		 return false;
      }
    
      this.setData({
        carts: this.data.carts,
        allnum: allnum,
        allcount: allcount.toFixed(2)
      });
    } else {//商品为非选中状态
      
      if (parseInt(this.data.carts[parentid].shopcarts[index].goodsnum) < max_quantity)
      {
        this.data.carts[parentid].shopcarts[index].goodsnum = parseInt(this.data.carts[parentid].shopcarts[index].goodsnum) + 1;
      }else {
		var msg = '最多购买' + max_quantity+'个';
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
		 return false;
	  }
      this.setData({
        carts: this.data.carts
      });
    }
   
    that.go_record();
  },


  //删除商品函数
  delgoods: function (e) {
    var parentid = parseInt(e.target.dataset.parentid);
    var index = parseInt(e.target.dataset.index);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定删除这件商品吗？',
      confirmColor: '#FF0000',
      success: function (res) {
        if (res.confirm) {
         
          var del_car_keys = that.data.carts[parentid].shopcarts[index].key;
        

          if (that.data.carts[parentid].shopcarts[index].isselect == true) {//商品为选中状态

            var allnum = parseInt(that.data.allnum) - parseInt(that.data.carts[parentid].shopcarts[index].goodsnum);
            var allcount = parseFloat(that.data.allcount) - parseFloat(that.data.carts[parentid].shopcarts[index].currntprice) * that.data.carts[parentid].shopcarts[index].goodsnum;
            var count = parseFloat(that.data.carts[parentid].count) - parseFloat(that.data.carts[parentid].shopcarts[index].currntprice) * that.data.carts[parentid].shopcarts[index].goodsnum;
            that.data.carts[parentid].count = count.toFixed(2);
            that.data.carts[parentid].goodstype = that.data.carts[parentid].goodstype - 1;
            that.data.carts[parentid].goodstypeselect = that.data.carts[parentid].goodstypeselect - 1
            if (that.data.carts[parentid].goodstype == 0) {
              console.log(that.data.carts);

              console.log(parentid);
              //that.data.carts.splice(parentid, 1)
              that.data.carts[parentid].shopcarts.splice(index, 1);
            } else {
              that.data.carts[parentid].shopcarts.splice(index, 1);
            }
            var num = 0;
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].shopcarts.length; j++) {
                num = num + that.data.carts[i].shopcarts[j].goodsnum;
              }
            }
            if (allnum == num)
              that.data.allselect = true;
            that.setData({
              carts: that.data.carts,
              allnum: allnum,
              allcount: allcount.toFixed(2),
              allselect: that.data.allselect
            });
          } else {//商品为选中状态
            that.data.carts[parentid].goodstype = that.data.carts[parentid].goodstype - 1;
            if (that.data.carts[parentid].goodstype == 0) {
            //  that.data.carts.splice(parentid, 1)
              that.data.carts[parentid].shopcarts.splice(index, 1);
            } else {
              that.data.carts[parentid].shopcarts.splice(index, 1);
            }
            var num = 0;
            for (var i = 0; i < that.data.carts.length; i++) {
              for (var j = 0; j < that.data.carts[i].shopcarts.length; j++) {
                num = num + that.data.carts[i].shopcarts[j].goodsnum;
              }
            }
            if (that.data.allnum == num)
              that.data.allselect = true;
            that.setData({
              carts: that.data.carts,
              allselect: that.data.allselect
            });
          }

          //that.data.carts.splice(parentid, 1);
          //console.log(that.data.carts[parentid].shopcarts[index].key );
          if(that.data.carts[parentid].shopcarts.length == 0)
          {
            delete that.data.carts[parentid];
            if (Object.keys(that.data.carts).length == 0)
            {
              that.setData({
                carts: []
              });
            }
          }
          //删除商品
          that.del_car_goods(del_car_keys);
        }
      }
    })

    this.go_record();  
  },
  del_car_goods:function(carkey){

    var token = wx.getStorageSync('token');
    

    wx.request({
      url: util.api() + 'index.php?s=/Apicart/del_car_goods/token/' + token,
      data: { carkey: carkey},
      method: 'POST',
      success: function (msg) {

      }
      })

  },
  //清空失效商品函数
  clearlose: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空失效商品吗？',
      confirmColor: '#FF0000',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            loselist: []
          });
        }
      }
    })
  },
  //记录购物车状态值，为了下次进来还是和上次一样
  go_record:function(){
    var token = wx.getStorageSync('token');
    var keys_arr = [];
    var all_keys_arr = [];

    var allnum = this.data.allnum;
  
    
      var carts = this.data.carts;

      for (var i in carts) {
        for (var j in carts[i]['shopcarts']) {
          if (carts[i]['shopcarts'][j]['isselect']) {
            keys_arr.push(carts[i]['shopcarts'][j]['key']);
          }

          all_keys_arr.push(carts[i]['shopcarts'][j]['key'] + '_' + carts[i]['shopcarts'][j]['goodsnum']);
        }
      }

      wx.request({
        url: util.api() + 'index.php?s=/Apicart/checkout_flushall/token/' + token,
        data: { car_key: keys_arr, all_keys_arr: all_keys_arr },
        method: 'POST',
        success: function (msg) {

          if (msg.data.code == 0) {
           
          } else {

            wx.showToast({
              title: msg.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })


    
  },

  //结算跳转页面函数
  toorder: function () {
    var token = wx.getStorageSync('token');
    var keys_arr = [];
    var all_keys_arr = [];

    var allnum = this.data.allnum;
    if (allnum > 0) {
      var carts = this.data.carts;

      for (var i in carts) {
        for (var j in carts[i]['shopcarts'])
        {
          if (carts[i]['shopcarts'][j]['isselect'])
          {
            keys_arr.push( carts[i]['shopcarts'][j]['key'] );
          }

          all_keys_arr.push(carts[i]['shopcarts'][j]['key'] + '_' + carts[i]['shopcarts'][j]['goodsnum'] );
        }
      }

      wx.request({
        url: util.api() + 'index.php?s=/Apicart/checkout_flushall/token/' + token,
        data: { car_key: keys_arr, all_keys_arr: all_keys_arr},
        method: 'POST',
        success: function (msg) {
         
          if(msg.data.code == 0)
          {
            
			var pages_all = getCurrentPages();
			if (pages_all.length > 3) {
			  wx.redirectTo({
				url: '/pages/buy/index?type=dan'
			  })
			} else {
			  wx.navigateTo({
				url: '/pages/buy/index?type=dan'
			  })
			}
          }else
          {
            
            wx.showToast({
              title: msg.data.msg,
              icon: 'none',
              duration: 2000
            })
          }
        }
      })
      

    } else {
      wx.showModal({
        title: '提示',
        content: '请选择您要购买的商品',
        confirmColor: '#FF0000',
        success: function (res) {
          if (res.confirm) {

          }
        }
      })
    }
    


  },
  goindex:function(){
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var s_num = getApp().globalData.s_num;
    console.log(s_num,"我一开始就加载进来了")
    this.setData({ s_num: s_num });
    wx.setNavigationBarTitle({
      title: '购物车'
    });
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: '#f7f7f7',
    }
    );
    var allnum = 0;
    var allcount = 0.00;

    var that = this;

    //show_cart_goods 
    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apicart/show_cart_goods/token/' + token + '/buy_type/dan',
      success: function (res) {
        console.log(res);
        if (res.data.code == 0) {
          //un login carts
          that.setData({
            carts: res.data.carts
          })

          that.xuan_func();
        } 
      }
    })

    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiindex/load_index_pintuan/per_page/4/is_index_show/1/orderby/rand',
      data: {
        "page": 1
      },
      success: function (res) {

        if (res.data.code == 1) {

          that.setData({
            showguess: false
          });

        } else {
          if (res.data.data.length > 0) {
            that.setData({
              showguess: true,
              guessdata: res.data.data
            });
          }
        }
      }
    })
    this.socketmsg();
  },
  xuan_func:function(){
    var allnum =0;
    var allcount = 0

    var flag = 1;
    var allselect = false;
    for (var i in this.data.carts)
     {
      var count = 0;
      this.data.carts[i].goodstypeselect = 0;
      this.data.carts[i].goodstype = this.data.carts[i].shopcarts.length;
     

      for (var j = 0; j < this.data.carts[i].shopcarts.length; j++) {
        if (this.data.carts[i].shopcarts[j].isselect == false)
          flag = 0;

        if (this.data.carts[i].shopcarts[j].isselect)
        {
          count = count + parseFloat(this.data.carts[i].shopcarts[j].currntprice) * parseFloat(this.data.carts[i].shopcarts[j].goodsnum);
          this.data.carts[i].goodstypeselect++;
          allnum = parseInt(allnum) + parseInt(this.data.carts[i].shopcarts[j].goodsnum);

        }
        

      }
      this.data.carts[i].count = count.toFixed(2);
      allcount = allcount + count;
    }
    console.log(flag);
    if (flag == 1) {//是全部选中
      allselect = true;
    }

 
    this.setData({
      allselect: allselect,
      allnum: allnum,
      allcount: allcount.toFixed(2),
      carts: this.data.carts
    });

  },
  socketmsg: function () {
    wx.closeSocket();
    var domain = util.getdomain();
    var self = this;
    wx.connectSocket({
      url: 'ws://127.0.0.1:8080/ws',
      header: {
        'content-type': 'application/json'
      },
      method: "GET"
    })
    wx.onSocketOpen(function (res) {
        var member_id = wx.getStorageSync('member_id');
        console.log(member_id,"888888888888");
    if(member_id){
        var login_data = '{ "type":"membre_login","uid":"'+member_id+'","tip_list":"user_'+member_id+'","domain":"' + domain + '"} ';
    }else{
      var login_data = '{ "type":"membre_login","domain":"' + domain + '"} ';
  }
      wx.sendSocketMessage({
        data: login_data
      });

    })

    wx.onSocketMessage(function (res) {

      var data = util.stringToJson(res.data);
      console.log(data);
      switch (data.type) {
        // 服务端ping客户端
        case 'ping':
          var pong_data = '{"type":"pong"}';
          wx.sendSocketMessage({ data: pong_data });
          break;
        case 'unread_to_clien':
          getApp().globalData.s_num=data.unread_count;
          console.log(data.unread_count,"unread_to_clien");
          self.setData({
            s_num: data.unread_count,
          });
            break;
      }


    })
    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})