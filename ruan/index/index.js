var util = require('../utils/util.js');
var common=require('../public/public.js');
const app = getApp();
Page({
  data: {
    tr:{
      tfCount:0,
      trBg:"../image/index/trBg.jpg"
    },
    lwf:{
      circular:true,
      autoplay:true,
      duration:500,
      interval:2000,
      vertical:true,
      ffSwiper: [{ text: "【快讯】伟哥我小程序已达到1级" }, { text: "【快讯】惊喜！傻逼我小程序已达到3级" }]
    },
    su:{
      circular: true,
      autoplay: true,
      duration: 500,
      interval: 3000,
      vertical: false,
      title:"紧急情报",
      prompt:"别怕，我是有着十亿用户的人",
      swiper:[{
        arr:[
          {href:"www.baidu.com",name:"百度",gender:"女",time:new Date().toTimeString(),age:32,imgUrl:"../image/wx.png"},
          { href: "www.murenziwei.com", name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20,imgUrl: "../image/index/trBg.jpg" },
          { href: "www.murenziwei.com", name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20 }
        ]
      },{
          arr: [
            { href: "www.baidu.com", name: "魏威", gender: "女", time: new Date().toTimeString(), age: 2423232,imgUrl: "../image/wx.png" },
            { href: "www.murenziwei.com", name: "军哥", gender: "男", time: new Date().toTimeString(), age: 100, imgUrl: "../image/wx.png" },
            { href: "www.murenziwei.com", name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20 }
          ]
        },{
          arr: [
            { href: "www.baidu.com", name: "师弟", gender: "女", time: new Date().toTimeString(), age: 0, imgUrl: "../image/wx.png" },
            { href: "www.murenziwei.com", name: "henhen", gender: "男", time: new Date().toTimeString(), age: 2, imgUrl: "../image/wx.png" },
            { href: "www.murenziwei.com", name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20 }
          ]
        }]
    },
    pm:{
      title:"幸运玩家",
      prompt:"缘分来了，水都挡不住",
      arr:[{
        name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg",num:32324232423,title:"大家都别慌，我先逃？！"
      }, {
          name: "李伟", gender: "男", time: new Date().toTimeString(), age: 20, imgUrl: "../image/index/trBg.jpg", num: 32324232423, title: "大家都别慌，我先逃？！"
        }]
    },

  },
  onLoad: function () {
    this.setData({common:common});
    util.login();
    console.log(util.login(),"9999");
    wx.request({
      url: util.api()+'ruan.php?s=/Index/index.html',
      method: 'get',
      success: function (res) {
        console.log(res);


      }
    })

    wx.global=this;
    console.log('代码片段是一种迷你、可分享的小程序或小游戏项目，可用于分享小程序和小游戏的开发经验、展示组件和 API 的使用、复现开发问题和 Bug 等。可点击以下链接查看代码片段的详细文档：');
    console.log('https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html');
   
  },
  onReady: function(){
    
  }
})
