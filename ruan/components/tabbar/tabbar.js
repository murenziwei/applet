// components/tabbar/tabbar.js
const tabBar = {
  "color": "black",
  "selectedColor": "#1afa29",
  "borderStyle": "4rpx solid #ccc",
  "backgroundColor": "#fff",
  "list": [
    // {
    //   "pagePath": "../map/map",
    //   "text": "主页",
    //   "icon": "icon-tubiao115"
    // },
    {
      "pagePath": "../total/total",
      "text": "寻亲",
      "icon": "icon-quanbu-copy"
    },
    // {
    //   "pagePath": "../refer/refer",
    //   "text": "消息",
    //   "icon": "icon-unie609"
    // },
    {
      "pagePath": "../mine/mine",
      "text": "我的",
      "icon": "icon-wode"
    }
  ]
}
Component({
  /**
   * 组件的属性列表
   */
  created:function(){
  },
  properties: {
    tabbarIndex:{
      type:Number,
      value:0
    }
  },
  ready:function(){
  },
  /**
   * 组件的初始数据
   */
  data: {
    tabBar:tabBar
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tabNav:function(ev){
      var navHref=ev.currentTarget.dataset.url;
      wx.redirectTo({url:navHref});
    }
  }
})
