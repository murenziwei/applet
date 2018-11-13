
function getdomain() {
  var api = 'www.shellsbuy_online.com';
  return api;
}
function api() {
  var api = 'http://www.shellsbuy_online.com/';
  return api;
}

function stringToJson(data) {
  return JSON.parse(data);
}
function jsonToString(data) {
  return JSON.stringify(data);
}
function cutstr(str, len) {
  var str_length = 0;
  var str_len = 0;
  var str_cut = "";
  str_len = str.length;
  for (var i = 0; i < str_len; i++) {
    var a = str.charAt(i);
    str_length++;
    if (escape(a).length > 4) {
      //中文字符的长度经编码之后大于4  
      str_length++;
    }
    str_cut = str_cut.concat(a);
    if (str_length >= len) {
      str_cut = str_cut.concat("...");
      return str_cut;
    }
  }
  //如果给定字符串小于指定长度，则返回源字符串；  
  if (str_length < len) {
    return str;
  }
}
function getLength(str) {
  ///<summary>获得字符串实际长度，中文2，英文1</summary>
  ///<param name="str">要获得长度的字符串</param>
  var realLength = 0, len = str.length, charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) realLength += 1;
    else realLength += 2;
  }
  return realLength;
}
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function check_login() {
  var prom = require("./prom.js");
  var token = wx.getStorageSync('token');
  var member_id = wx.getStorageSync('member_id');
  var Prom = new Promise(function (resolve, reject) {

    wx.request({
      url: api() + 'index.php?s=/Apiuser/appVerification/token/' + token,
      success: function (res) {
        member_id = res.data.data;
        if (token && member_id != undefined && member_id.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    })
  })
  return Prom;

}

function login(s_link) {
  var share_id = wx.getStorageSync('share_id');
  if (share_id == undefined) {
    share_id = '0';
  }

  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: api() + 'index.php?s=/Apicheckout/applogin/code/' + res.code,
          success: function (res) {
            wx.setStorage({
              key: "token",
              data: res.data.token
            })
            wx.getUserInfo({
              success: function (msg) {
                var userInfo = msg.userInfo
                wx.setStorage({
                  key: "userInfo",
                  data: userInfo
                })
                wx.request({
                  url: api() + 'index.php?s=/Apicheckout/applogin_do/token/' + res.data.token,
                  method: 'POST',
                  data: {
                    share_id: share_id,
                    userinfo: msg.userInfo,
                    encrypteddata: msg.encryptedData,
                    iv: msg.iv
                  },
                  success: function (res) {

                    wx.setStorage({
                      key: "member_id",
                      data: res.data.member_id
                    })

                    wx.showToast({
                      title: '登录成功',
                      icon: 'success',
                      duration: 2000,
                      success: function () {
                        //s_link
                        if (s_link.length <= 0) {

                        } else {
                          wx.redirectTo({
                            url: s_link
                          })
                        }
                      }
                    })
                  }
                })
              },
              fail: function (msg) {
                console.log(msg);
              }
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  })
}
function imageUtil(e) {
  var imageSize = {};
  var originalWidth = e.detail.width;//图片原始宽  
  var originalHeight = e.detail.height;//图片原始高  
  var originalScale = originalHeight / originalWidth;//图片高宽比  
  console.log('originalWidth: ' + originalWidth)
  console.log('originalHeight: ' + originalHeight)
  //获取屏幕宽高  
  wx.getSystemInfo({
    success: function (res) {
      var windowWidth = res.windowWidth;
      var windowHeight = res.windowHeight;
      var windowscale = windowHeight / windowWidth;//屏幕高宽比  
      console.log('windowWidth: ' + windowWidth)
      console.log('windowHeight: ' + windowHeight)
      if (originalScale < windowscale) {//图片高宽比小于屏幕高宽比  
        //图片缩放后的宽为屏幕宽  
        imageSize.imageWidth = windowWidth;
        imageSize.imageHeight = (windowWidth * originalHeight) / originalWidth;
      } else {//图片高宽比大于屏幕高宽比  
        //图片缩放后的高为屏幕高  
        imageSize.imageHeight = windowHeight;
        imageSize.imageWidth = (windowHeight * originalWidth) / originalHeight;
      }

    }
  })
  console.log('缩放后的宽: ' + imageSize.imageWidth)
  console.log('缩放后的高: ' + imageSize.imageHeight)
  return imageSize;
}  
module.exports = {
  formatTime: formatTime,
  api: api,
  cutstr: cutstr,
  check_login: check_login,
  login: login,
  imageUtil: imageUtil,
  getLength: getLength,
  getdomain: getdomain,
  jsonToString: jsonToString,
  stringToJson: stringToJson
}
