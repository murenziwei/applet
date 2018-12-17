// pages/child/dataModifit/dataModifit.js
var util = require("../../../utils/util.js");
Page({
  /*
   页面的初始数据
   */
  /*个人介绍的方法*/
  imgerrorfn: function () {
    wx.that.setData({ "userO.img_self": "/image/icon7.png" })
  },
  taFn: function (ev) {
    var that = this;
    that.setData({
      textarea_active: !that.data.textarea_active
    });
  },
  sstFn: function (ev) {
    var that = this;
    var jointobj = that.data.userO;
    jointobj.show_self = ev.detail.value;
    that.setData({
      userO: jointobj,
      "showSelf.len":ev.detail.value.length
    });
  },
  cancelFn: function (ev) {
    var that = this;
    that.setData({ hiddenmodel: ev.detail.judge });
  },
  saveNextFn: function (ev) {
    var that = this;
    var exp = new RegExp(searchStr, "g");
    var token = wx.getStorageSync("token");
    var imgself=that.data.userO.img_self;
    
    var jointObj = that.data.userO;
    var judgeture=true;
    jointObj.token = token;
    console.log(jointObj)
    if(that.data.judgeimg){
      jointObj.img_self = that.data.judgeimg;
    }
        
        
    
    if (that.data.options.help) {
      jointObj.help = that.data.options.help;
    }
    jointObj.show_self = jointObj.show_self != 'null' ? jointObj.show_self : '本人懒，不介绍'
    wx.jointobj=jointObj;
    var keyarr = ["img_self", "real_name", "idno", "nation", "sex", "birthday", "mobile", "ancestors_city", "origin_previous","now_previous","id_img_self"],maxi=0;
    
    for(var vi=0;vi<=maxi;vi++){
      switch(keyarr[vi]){
        // 个人头像
        case "img_self":jointObj[keyarr[vi]]?
        (()=>{
          ++maxi;
          
          })():(()=>{
            wx.showToast({ title: "个人头像不能为空", icon: "none" });
            judgeture = false;
        })();break;
        // 真实姓名
        case "real_name": jointObj[keyarr[vi]] ?
          (() => {
            if(/^阮/.test(jointObj[keyarr[vi]])){
              ++maxi; 
              
            }else{
              wx.showToast({ title:"必须是阮姓用户才能实名",icon:"none"});
              judgeture = false;
            }
          })() : (() => {
            
            wx.showToast({ title: "用户名不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 身份证
        case "idno": jointObj[keyarr[vi]] ?
          (() => {
            if (jointObj[keyarr[vi]].length==18) {
              ++maxi; 
              
            } else {
              wx.showToast({ title: "必须18位数", icon: "none" });
              judgeture = false;
            }
          })() : (() => {
            
            wx.showToast({ title: "身份证不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 民族
        case "nation": jointObj[keyarr[vi]] ?
          (() => {
            ++maxi;
            
          })() : (() => {
            wx.showToast({ title: "民族不能为空", icon: "none" });
            judgeture = false;
          })(); break;  
        // 性别
        case "sex": jointObj[keyarr[vi]] ?
          (() => {
            if (jointObj[keyarr[vi]] == 1 || jointObj[keyarr[vi]] == 2) {
              ++maxi;
              
            } else {
              wx.showToast({ title: "性别未填", icon: "none", success: function () { judgeture = false; } });
            }
          })() : (() => {
            
          })(); break;
        // 生日
        case "birthday": jointObj[keyarr[vi]] ?
          (() => {
            ++maxi;
            
          })() : (() => {
            wx.showToast({ title: "生日不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 邮件
        /*case "email": jointObj[keyarr[vi]] ?
          (() => {
            if (/^\w+\@\w+\.\w/.test(jointObj[keyarr[vi]])) {
              ++maxi; console.log("对着", jointObj[keyarr[vi]]);
            } else {
              wx.showToast({ title: "邮件格式必须类似为xxx@xxx.xxx", icon: "none" });
              judgeture = false;
            }
          })() : (() => {
            wx.showToast({ title: "邮件不能为空", icon: "none" });
            judgeture = false;
          })(); break;*/
        // 手机
        case "mobile": jointObj[keyarr[vi]] ?
          (() => {
            if (/^\d+$/.test(jointObj[keyarr[vi]])) {
              ++maxi; 
              
            } else {
              wx.showToast({ title: "手机号必须为数字", icon: "none"});
              judgeture = false;
            }
          })() : (() => {
            wx.showToast({ title: "手机不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 祖籍
        case "ancestors_city": jointObj[keyarr[vi]] ?
          (() => {
              
              ++maxi; 
              
          })() : (() => {
            wx.showToast({ title: "祖籍不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 原籍
        case "origin_previous": jointObj[keyarr[vi]] ?
          (() => {

            ++maxi; 
            
          })() : (() => {
            wx.showToast({ title: "原籍不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 现住地址
        case "now_previous": jointObj[keyarr[vi]] ?
          (() => {
            ++maxi; 
            
          })() : (() => {
            wx.showToast({ title: "常住地不能为空", icon: "none" });
            judgeture = false;
          })(); break;
        // 身份证
        case "id_img_self": jointObj[keyarr[vi]] ?
          (() => {
           
           
            if (jointObj[keyarr[vi]]) {
              if(jointObj[keyarr[vi]][0]){
                if(!jointObj[keyarr[vi]][1]){
                  wx.showToast({ title: "身份证件反面不能为空", icon: "none" });
                  judgeture = false;
                }else{
                  ++maxi;
                }
              }else{
                wx.showToast({ title: "身份证件正面不能为空", icon: "none" });
                judgeture = false;
              }
              
            } else {
              wx.showToast({ title: "身份证件不能为空", icon: "none" });
              judgeture = false;
            }
          })() : (() => {
           
           

            wx.showToast({ title: "身份证件不能为空", icon: "none"});
            judgeture = false;
          })(); break;
        
        default:if(maxi<keyarr.length){++maxi;
        }
      }
    }
    console.log(jointObj.id_img_self,"避免");
    
   
    if(judgeture){
      //避免错误
      if (Array.isArray(jointObj.id_img_self)) {
        var searchStr = util.api();
        var exp = new RegExp(searchStr, "g");
        console.log(exp);
        var arrarr = jointObj.id_img_self.map(function (item, index) {
          return item.replace(exp, "/");
        });
        jointObj.id_img_self = arrarr.join(',');
        //替换掉util.api()
        console.log(jointObj.id_img_self, arrarr);
      }
      console.log(jointObj,"明佛那个");
      wx.request({
        url: util.api() + "ruan.php?s=/apicheck/edit_user.html",
        data: jointObj,
        success: function (res) {
         
         
          wx.showToast({
            title: res.data.msg ? res.data.msg : "保存失败…", icon: "none", success: function () {
              if (res.data.code) {
                wx.setStorage({
                  key: "is_bind",
                  data: 1
                })
                if (that.data.options.id || that.data.options.help) {
                  wx.reLaunch({ url: "../helpdata/helpdata" });
                } else {
                  wx.reLaunch({ url: "../../../personal/personal" });
                }
                jointObj.img_self = res.data.member_info.img_self;
                that.setData({ userO: jointObj });
              } else {
                jointObj.img_self = imgself;
              }
            }
          });

        },
        fail: function (err) {
          console.log(err, "上传错误");
        }
      });
    }else{
      jointObj.img_self = imgself;
    }
    
  },
  dateChange: function (ev) {
   
   
    var that = this;
    var jointobj = this.data.userO;
    jointobj.birthday = ev.detail.value;
    that.setData({ userO: jointobj });
  },
  sexChange: function (ev) {
   
   
    var that = this;
    var obj = that.data.userO;
    obj.sex = ev.detail.value == "0" ? "1" : (ev.detail.value == "1" ? "2" : "");
    that.setData({ userO: obj });
  },
  showinputmodelFn: function (ev) {
    var that = this;
    var indexI = ev.currentTarget.dataset.index;
    if(that.data.options.help){}else{
      if (that.data.options.idonImgNone == 1 && indexI == 'idno' || indexI == 'real_name') return
    }

    if (indexI == "ein" || indexI == "company_name" || indexI == "legal_rep") {
      var parentvalue = that.data.userO.enterprise_info ? that.data.userO.enterprise_info[indexI] : "";
    } else {
      var parentvalue = that.data.userO[indexI] ? that.data.userO[indexI] : "";
    }
    parentvalue = parentvalue ? parentvalue:"";
    that.setData({
      hiddenmodel: true,
      parentstr: ev.currentTarget.dataset.name,
      parentvalue: parentvalue,
      indexstr: indexI,
      parenttype: ev.currentTarget.dataset.inputtype,
      parentlength: ev.currentTarget.dataset.inputlength
    });
  },
  closeinputFn: function (ev) {
    var obj = this.data.userO;
    console.log(obj,"辛巴啦");
    
    if (ev.detail.name == 'ein' || ev.detail.name == 'company_name' || ev.detail.name == 'legal_rep') {
      obj.enterprise_info = obj.enterprise_info ? obj.enterprise_info : {};
      obj.enterprise_info[ev.detail.name] = ev.detail.valueinput

     
     
    } else {
      obj[ev.detail.name] = ev.detail.valueinput;
    }
    
   
   
    this.setData({ hiddenmodel: ev.detail.judge, userO: obj });
  },
  ancestorsFn: function (ev) {
    var that = this;

    var jointObj = that.data.userO;

    jointObj.ancestors_previous = ev.detail.value[0];
    jointObj.ancestors_city = ev.detail.value[1];
    jointObj.ancestors_town = ev.detail.value[2];
    this.setData({ userO: jointObj });
   
   

  },
  originFn: function (ev) {
    var that = this;

    var jointObj = that.data.userO;

    jointObj.origin_previous = ev.detail.value[0];
    jointObj.origin_city = ev.detail.value[1];
    jointObj.origin_town = ev.detail.value[2];
    this.setData({ userO: jointObj });
   
   

  },
  siteFn: function (ev) {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var jointObj = that.data.userO;
        jointObj.address = res;

        jointObj.now_previous = res.provinceName;

        jointObj.now_town = res.countyName;

        jointObj.now_city = res.cityName;
        jointObj.now_address = res.detailInfo;
       
       
        that.setData({ userO: jointObj });

      }
    });
   
   
  },
  modifyPic: function () {
    var that = this;
    console.log(wx.getStorageSync("token"))
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var jointObj = that.data.userO;
       
        jointObj.img_self = res.tempFilePaths ? res.tempFilePaths[0] : "";
        var uploadTask = wx.uploadFile({
          url: util.api() + "ruan.php?s=/Apievent/make_img",
          filePath: jointObj["img_self"],
          name: "file",
          formData: {
            token: wx.getStorageSync("token"),
            folder: "Public/wx/user"
          },
          success: function (ev) {
            
            
            try {
              var jsonJ = JSON.parse(ev.data);
              if(jsonJ.code){

              }
              wx.showToast({title:jsonJ.msg,icon:"none",success:function(){
                if(jsonJ.code){
                  wx.that.setData({ userO: jointObj,judgeimg: jsonJ.img_url ? jsonJ.img_url : "" });
                }
              }});
            } catch (err) {
              console.error("返回的数据格式不是json格式");
            }

          },
          fail: function (err) {
            // wx.showToast({ title: "图片上传失败", icon: "none" });
            console.log(err, "上传失败");
          }
        });

      }, 
      fail: function (err) {
        console.log(err, "上传失败");
      }
    });
  },
  delImg: function (ev) {
   
   

    var that = this;
    that.setData({ isTap: true });
    var iI = ev.currentTarget.dataset.index;
    wx.showModal({
      title: "删除照片", content: "是否删除", success: function (res) {
        if (res.confirm) {
          var wImgO = that.data.wImg;
          wImgO.tempFiles.splice(iI, 1);
          that.setData({ wImg: wImgO });
        }
        that.setData({ isTap: false });
      }
    })
  },
  previewI: function (ev) {
    console.log(this.data.userO);
    
    var imgSrc = ev.currentTarget.dataset.imgsrc;
    //返回一个新数组
    var arrImg=this.data.userO.id_img_self.map(function(item){return item;});
    wx.previewImage({ current: imgSrc, urls: arrImg, success: function (res) { console.log(res, "执行成功"); }, fail: function (err) { console.log(err, "执行失败"); } });
  },
  mhcUploadFn: function (e) {
    var that = this;
    var ind=e.currentTarget.dataset.index;
    console.log(ind,"号");
    var wImgO = that.data.wImg ? that.data.wImg : {};
    wImgO.tempFiles = wImgO.tempFiles ? wImgO.tempFiles : [];
    var sourceType = ["album", "camera"], sizeType = ["original", "compressed"];
    var obj = {
      count: 1,
      sizeType: "compressed",
      sourceType: sourceType[1],
      success: function (res) {
        var arrT = res.tempFilePaths;

        wx.showModal({
          title: "提示", content: "注意！身份证的"+(ind=="0"?"正面":"反面")+"要拍清晰！", success: function (res) {
            if (res.confirm) {
              wx.showLoading({
                title: '请稍等…',
              })
              var idImgList=[];
              wx.uploadFile({
                url: util.api() + "ruan.php?s=/Apievent/make_img",
                filePath: arrT[0],
                name: "file",
                formData: {
                  token: wx.getStorageSync("token"),
                  folder: "Public/wx/user"
                },
                success: function (ev) {
                  try {
                    console.log(arrT[0],"什么东西");
                    var jsonJ = JSON.parse(ev.data);

                    console.log(jsonJ)

                    var iis=that.data.userO.id_img_self;
                   
                    if (jsonJ.code) {
                      if (Array.isArray(iis)) {
                        iis[ind] = jsonJ.img_url;
                        wImgO.tempFiles[ind]=arrT[0];
                      }
                    }
                    console.log(that.data.userO.id_img_self,"什么东西");
                    that.setData({ wImg: wImgO, "userO.id_img_self": iis });
                    //关闭加载
                    wx.hideLoading();

                  } catch (err) {
                    console.error("返回的数据格式不是json格式");
                    //关闭加载
                    wx.hideLoading();
                  }

                },
                fail: function (err) {
                  // wx.showToast({ title: "图片上传失败", icon: "none" });
                  console.log(err, "上传失败");
                  //关闭加载
                  wx.hideLoading();
                }
              });
            }
          }
        });
      },
      fail: function (err) {
        console.log(err, "错误");
      }
    };
    wx.chooseImage(obj);
  },
  imgConfirm: function (ev) {
    var that = this;
    var judge = true;
    var reaultO = this.data.autonym;
    var x = reaultO.name.split("")
   
   
    for (var i in reaultO) {
      if (i === "name") {
        if (!reaultO[i]) {
          wx.showToast({ title: "姓名不可为空", icon: "none" });
          judge = false;
          break;
        } else if (x[0] !== '阮') {
          wx.showToast({ title: "必须阮姓用户才能实名", icon: "none" });
          judge = false;
          break;
        }
      }
      if (i === "identity") {
        var vaL = reaultO[i];

       
       
        if (vaL.length !== 18) {
          wx.showToast({ title: "请输入18位", icon: "none" });
          judge = false;
          break;
        }
      }
    }
    if (judge) {
      var token = wx.getStorageSync('token');
     
     
      wx.request({
        url: util.api() + 'ruan.php?s=/Apicheck/idno_bind_user',
        data: {
          'token': token,
          'idno': reaultO.identity,
          'name': reaultO.name
        },
        method: 'get',
        success: function (res) {
         
         console.log(res,"出现的傻逼");
         
          if (res.data.msg == '已被实名'){
            wx.showToast({title: '资料已被实名，请重新输入', icon: "none"});
            return
          }

          if (res.data.msg == '用户实名审核中') {
            wx.showToast({ title: res.data.msg , icon: "none" });
            return
          }
          if (res.data.code) {
            wx.showToast({
              title: res.data.msg, icon: "none", success: function () {
                wx.setStorage({
                  key: "is_bind",
                  data: 1
                });
                that.setData({ imgHidden: true, userO:res.data.member_info});
                
              }
            });
          } else {
            wx.showToast({
              title: res.data.msg, icon: "none", success: function () {
                that.setData({ imgHidden: true, userO: { idno: that.data.autonym.identity, real_name: that.data.autonym.name } })
              }

            });
          }
        },
        fail: function () {
          console.log("yan");
          wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
        }
      })
    }
   
   
  },
  imgCancel: function (ev) {
    this.setData({ imgHidden: true });
    // wx.navigateBack();
    wx.navigateTo({ url: "../../../mine/mine" });
  },
  imgModal: function (ev) {
    var imgSrc = ev.currentTarget.dataset.imgsrc;
    this.setData({ modalImg: imgSrc, imgHidden: false });
  },
  autonymNameFn: function (ev) {
   
   
    var obj = this.data.autonym;
    obj.name = ev.detail.value;
    this.setData({ autonym: obj });
  },
  autonymIdentityFn: function (ev) {
    var obj = this.data.autonym;
    obj.identity = ev.detail.value;
    this.setData({ autonym: obj });
  },
  data: {
    token: wx.getStorageSync("token"),
    textarea_active: false,
    parentstr: "请填写某某",
    parentvalue: "",
    hiddenmodel: false,
    isTap: false,
    imgHidden: true,
    sexarr: ["男", "女"],
    autonym: {
      name: '',
      identity: ''
    },
    datam: {
      imgO: {
        name: "个人头像",
        src: "../../../image/wx.png"
      },
      nameO: {
        name: "用户账号",
        value: "无"
      },
      userO: {
        name: "用户昵称",
        value: "无"
      },
      ageO: {
        name: "性别"
      },
      cardO: {
        name: "我的名片二维码",
        icon: "icon-weibiaoti--"
      }
    },
    userO: { enterprise_info: {} ,id_img_self:[]},
    showSelf: {
      placeholder: "30个字以内",
      max: 30,
      len: 0
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  
    wx.that = this;
    var that = this;
    that.setData({ loadshow: true, options: options });

    var token = wx.getStorageSync("token");

    if (options.help) {

    } else {
      var userObj = wx.getStorageSync("userinfo");
      var isBind = wx.getStorageSync("is_bind");
      if (isBind) {
        //请求一次
        this.setData({ imgHidden: true });
        wx.request({
          url: util.api() + 'ruan.php?s=/Apicheck/idno_bind_user',
          data: {
            'token': token,
            "id": options.id,
            "help": options.id ? 1 : 0
          },
          method: 'get',
          success: function (res) {
            if (res.data.code) {
              var enterprise_info={};
              //接收用户信息
              var resultUser=res.data.member_info;
              if (resultUser.enterprise_info != "undefined" && resultUser.enterprise_info!="") {

                enterprise_info = JSON.parse(resultUser.enterprise_info)

              }
              console.log(resultUser.id_img_self,"尼玛？");
              if (!resultUser.id_img_self){
                that.setData({
                  'options.idonImgNone' : 0
                });
              }
              
              if (resultUser.show_self == "undefined") {
                resultUser.show_self = "本人懒，不介绍";
              }

              var arrArr=resultUser.id_img_self.map(function(item){
                return item;
              });
              

              that.setData({
                imgHidden: true, userO: resultUser,
                'userO.enterprise_info': enterprise_info,
                judgeimg: resultUser.img_self.replace(util.api(), "/"),
                idImgSelf:arrArr,
                "wImg.tempFiles":arrArr
              });
             
             
              //更新相关个人介绍的数据
              if(resultUser.show_self){
                
                var ss=wx.that.data.showSelf;
                //更新字数
                ss["len"]=resultUser.show_self.length;
                wx.that.setData({showSelf:ss});
              }
            }
          },
          fail: function () {
            wx.showToast({ title: "请求失败", icon: 0, duration: 1000 });
          }
        })
        //根据接收过来的数据判断
      } else {
        this.setData({ imgHidden: false });
      }
      var datamO = this.data.datam;
      //修改datam的子集imgO
      datamO.imgO.src = userObj.avatarUrl;
      //修改datam的子集userO
      datamO.userO.value = userObj.nickName;
      //修改datam的子集ageO
      datamO.ageO.value = userObj.gender;
      this.setData({ datam: datamO });
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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

  },

})