// pages/order/comment.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id : 0,
    goods_id :0,
    order_goods:[],
    miaoshu_no:0,
    price_no : 0,
    zhiliang_no:0,
    pinjia_text:'',
    thumb_img:[],
    image:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var token = wx.getStorageSync('token');
    var order_id = options.id;
    this.setData({
      order_id: order_id
    })
    
    wx.request({
      url: util.api() + 'index.php?s=/Apiuser/order_comment/token/' + token + '/order_id/' + order_id,
      success: function (res) {
        if(res.data.code ==3)
        {
          //un login
        }else if(res.data.code == 0)
        {
          //
          
          //code goods_image
          that.setData({
            goods_id: res.data.goods_id,
            order_goods: res.data.order_goods,
            goods_image: res.data.goods_image
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
  textinput: function (event){
    //event.detail = { value, cursor }，
    var content = event.detail.value;
    //pinjia_text
    this.setData({
      pinjia_text: content
    })

  },
  sub_comment:function(){
      var order_id = this.data.order_id;
      var goods_id = this.data.goods_id;
      var miaoshu_no = this.data.miaoshu_no;
      var price_no = this.data.price_no;
      var zhiliang_no = this.data.zhiliang_no;
      var pinjia_text = this.data.pinjia_text;
      var image = this.data.image;
      
      if (pinjia_text == '')
      {
        wx.showToast({
          title: '请填写评价内容',
          icon: 'success',
          duration: 1000
        })
        return false;
      }
      wx.showLoading({
        title: '评论中',
      })
      var token = wx.getStorageSync('token');
      wx.request({
        url: util.api() + 'index.php?s=/Apiuser/sub_comment/token/' + token,
        data: { order_id: order_id, goods_id: goods_id, cur_rel: miaoshu_no, cur2_rel: price_no, cur3_rel: zhiliang_no, comment_content: pinjia_text, imgs: image},
        method: 'POST',
        success: function (msg) {
          wx.hideLoading();
          if(msg.data.code == 3)
          {
            wx.showToast({
              title: '未登录',
              icon: 'loading',
              duration: 1000
            })
          }else{
           
            wx.showToast({
              title: '评价成功',
              icon: 'success',
              duration: 1000,
              success:function(res){
              
                wx.redirectTo({
                  url: "/pages/order/index?order_status=11"
                })
              }
            })
          }

        }
      })
      

  },
  choseStar: function(event){
    let stype = event.currentTarget.dataset.stype;
    let sval = event.currentTarget.dataset.sval;
    if (stype == 'miaoshu_no')
    {
      this.setData({
        miaoshu_no: sval
      })
    } else if (stype == 'price_no')
    {
      this.setData({
        price_no: sval
      })
    } else if (stype == 'zhiliang_no')
    {
      this.setData({
        zhiliang_no: sval
      })
    }

  },
  choseImg: function () {
    var self = this;
   
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
            var new_img = self.data.image;
            
            var new_thumb_img = self.data.thumb_img;
            new_img.push(orign_image);
            new_thumb_img.push(image_thumb);

            console.log(new_thumb_img);
            console.log(new_img);

            self.setData({
              thumb_img: new_thumb_img,
              image: new_img
            })
            //https://mall.shiziyu888.com/Uploads/image/cache/goods/2017-11-28/5a1d30ca7c627-300x300.png
            // https://mall.shiziyu888.com/Uploads/image/goods/2017-11-28/5a1d30ca7c627.png

            //do something
            
          }
        })
      }
    })
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