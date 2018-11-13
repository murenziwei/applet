// pages/order/refund.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xarray: ['点击选择退款理由', '商品有质量问题', '没有收到货', '商品少发漏发发错', '商品与描述不一致', '收到商品时有划痕或破损', '质疑假货', '其他'],
    index: 0,
    refund_type:0,
    refund_money:0,
    refund_imgs:[],
    mobile:'',
    refund_thumb_imgs:[],
    refund_miaoshu:'',
    order_id:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //get_order_money
    var order_id = options.id;
    this.setData({
      order_id: order_id
    })
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/get_order_money/token/' + token + '/order_id/' + order_id,
      success: function (res) {
        if (res.data.code == 3) {
          //un login
        } else if (res.data.code ==1) {
          //

          //code goods_image
          that.setData({
            total_money: res.data.total
          })
        }
      }
    })

  },
  bindPickerChange: function (e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  choseImg: function () {
    var self = this;
    var refund_imgs = this.data.refund_imgs;
    if (refund_imgs.length >=3 )
    {
      wx.showToast({
        title: '最多三张图片',
        icon: 'success',
        duration: 1000
      })
      return false;
    }

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;

        wx.showLoading({
          title: '上传中',
        })

        wx.uploadFile({
          url: util.api() + "/index.php?s=/Apigoods/upload_image", //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'name': tempFilePaths[0]
          },
          header: {
            'content-type': 'multipart/form-data'
          },
          success: function (res) {
            wx.hideLoading();
            var data = JSON.parse(res.data);

            var image_thumb = data.image_thumb;
            var orign_image = data.image_o;
            var new_img = self.data.refund_imgs;

            var new_thumb_img = self.data.refund_thumb_imgs;
            new_img.push(orign_image);
            new_thumb_img.push(image_thumb);


            self.setData({
              refund_thumb_imgs: new_thumb_img,
              refund_imgs: new_img
            })
            //https://mall.shiziyu888.com/Uploads/image/cache/goods/2017-11-28/5a1d30ca7c627-300x300.png
            // https://mall.shiziyu888.com/Uploads/image/goods/2017-11-28/5a1d30ca7c627.png

            //do something

          }
        })
      }
    })
  },
  chose_type: function (event){
    let stype = event.currentTarget.dataset.rel;
    this.setData({
      refund_type: stype
    })
  },
  cancle_img: function (event){
    let sr = event.currentTarget.dataset.sr;
    var j =0;
    var refund_imgs = this.data.refund_imgs;
    var refund_thumb_imgs = this.data.refund_thumb_imgs;

    var new_refund_imgs = [];
    var new_refund_thumb_imgs = [];
    

    for (var i in refund_thumb_imgs)
    {

      if (refund_thumb_imgs[i] == sr)
      {
        console.log('find');
        j = i;
      }else{
        new_refund_thumb_imgs.push(refund_thumb_imgs[i]);
      }
    }

    for (var i in refund_imgs)
    {
      if(i != j)
      {
        new_refund_imgs.push(refund_imgs[i]);
      }
    }
    this.setData({
      refund_thumb_imgs: new_refund_thumb_imgs,
      refund_imgs: new_refund_imgs
    })
    console.log(new_refund_thumb_imgs.length);
    console.log(new_refund_imgs.length);
  },
  refund_money_input: function (event){
    var content = event.detail.value;
    //pinjia_text
    this.setData({
      refund_money: content
    })
  },
  wenti_input: function (event){
    var content = event.detail.value;
    //pinjia_text
    this.setData({
      refund_miaoshu: content
    })
  },
  mobile_input: function (event){
    var content = event.detail.value;
    //pinjia_text
    this.setData({
      mobile: content
    })
  },
  sub_refund:function(){
/**
    xarray: ['请选择退款理由', '商品有质量问题', '没有收到货', '商品少发漏发发错', '商品与描述不一致', '收到商品时有划痕或破损', '质疑假货', '其他'],
      index: 0,
        refund_type:0,
          refund_money:0,
            refund_imgs:[],
              refund_thumb_imgs:[],
                refund_miaoshu:'',
 */ 
    if (this.data.refund_type == 0)
    {
        wx.showToast({
          title: '请选择退款类型',
          icon: 'success',
          duration: 1000
        })
        return false;
    }
    if (this.data.refund_money <= 0) {
      wx.showToast({
        title: '请填写退款金额',
        icon: 'success',
        duration: 1000
      })
      return false;
    }
    
    if (this.data.index == 0) {
      wx.showToast({
        title: '请选择退款原因',
        icon: 'success',
        duration: 1000
      })
      return false;
    }
    var rfund_name = this.data.xarray[this.data.index];
    if (this.data.refund_miaoshu == '') {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'success',
        duration: 1000
      })
      return false;
    }
    if (this.data.refund_imgs <= 0) {
      wx.showToast({
        title: '请上传图片',
        icon: 'success',
        duration: 1000
      })
      return false;
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'success',
        duration: 1000
      })
      return false;
    }
    var that = this;

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
    if (!myreg.test(this.data.mobile)) {
      wx.showToast({
        title: '请填写正确手机号',
        icon: 'success',
        duration: 1000
      })
      return false;
    } 

    var token = wx.getStorageSync('token');
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/refund_sub/token/' + token,
      data: { order_id: that.data.order_id, complaint_type: that.data.refund_type, complaint_images: that.data.refund_imgs, complaint_desc: that.data.refund_miaoshu, complaint_mobile: that.data.mobile, complaint_reason: rfund_name, complaint_money: that.data.refund_money },
      method: 'POST',
      success: function (msg) {
        wx.hideLoading();
        if (msg.data.code == 3) {
          wx.showToast({
            title: '未登录',
            icon: 'loading',
            duration: 1000
          })
        }
        else if(msg.data.code == 0)
        {
       
          wx.showToast({
            title: msg.data.msg,
            icon: 'success',
            duration: 1000
          })
          return ;
        }
         else {

          
          wx.showToast({
            title: '申请成功',
            icon: 'success',
            duration: 1000,
            success: function (res) {
              wx.redirectTo({
                url: "/pages/order/order?id=" + that.data.order_id
              })
            }
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})