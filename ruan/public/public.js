const tabBar ={
  "color": "black",
  "selectedColor": "#1afa29",
  "borderStyle": "4rpx solid #ccc",
  "backgroundColor": "#fff",
  "list": [
    {
      "pagePath": "../index/index",
      "iconPath": "../image/tabBar/index.png",
      "text": "主页",
      "selectedIconPath": "image/tabBar/index_selected.png",
      "icon":"icon-kuaijin"
        },
    {
      "pagePath": "../total/total",
      "iconPath": "../image/tabBar/total.png",
      "text": "全部",
      "selectedIconPath": "image/tabBar/total_selected.png",
      "icon": "icon-kuaijin"
        },
    {
      "pagePath": "../pages/pact/pact",
      "iconPath": "../image/tabBar/issue.png",
      "text": "发布",
      "selectedIconPath": "image/tabBar/issue.png",
      "icon": "icon-kuaijin"
        },
    {
      "pagePath": "../refer/refer",
      "iconPath": "../image/tabBar/refer.png",
      "text": "咨询",
      "selectedIconPath": "image/tabBar/refer_selected.png",
      "icon": "icon-kuaijin"
        },
    {
      "pagePath": "../mine/mine",
      "iconPath": "../image/tabBar/mine.png",
      "text": "我的",
      "selectedIconPath": "image/tabBar/mine_selected.png",
      "icon": "icon-kuaijin"
        }
  ]
}
module.exports={
  tabBar:tabBar
}