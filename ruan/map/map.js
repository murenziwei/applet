Page({
  //获取省份的方法
  getProvince(province,fn){
    var url = 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + province.latitude + ',' + province.longitude + '&key=' + wx.that.data.key + '';
    
    wx.request({
      url: url,
      success: function (res) {
        //只有status为0，才进入
        if(res.data.status==0){
          var add = res.data.result.address_component
          wx.that.setData({ "poiobj.province": add.province });
          if (typeof fn == "function") {
            fn();
          }
        }
      },
      fail: function () {
        wx.showToast({ title: "获取地址失败", icon: 0, duration: 1000 });
      }
    })
  },
  //视野发生改变，根据中心坐标获取该省范围内的某一经纬度
  mousefn(poiindex,poiture){
    wx.getSetting({success:res=>{
      if(res.authSetting["scope.userLocation"]){
        //province
        var province = wx.that.data.poiobj.province;
        //获取markers
        var markers = wx.that.data.markers;
        //获取省份所属的对象
        var poisObj = wx.that.data.pois;
        //获取所需某地址的队列
        var tar = poisObj[poiindex];
        if (tar.length) {
          //取name为想要的省份
          var listLen = 0, len = tar.length;
          for (var i = 0; i <= listLen; i++) {
            if (i < len) {
              if (tar[i].name == province) {
                var markers = wx.that.data.markers;
                //更新中心坐标
                markers[0].latitude = poiture.latitude;
                markers[0].longitude = poiture.longitude;
                var dn = poiture.dn;
                var people = tar[i].nums;
                //markers的callout的content
                if (people > 888) {
                  var calloutStr = dn + "省份为" + province + "的已超过888人";
                } else {
                  var calloutStr = province + "：" + people + "人（" + dn + "省份）";
                }

                //设置新添加的markers子集的id
                var idItem = markers.length;
                //仿地标
                //自己位置的周围
                //自身地标周围的随机纬度
                var latitude = poiture.latitude + Math.pow(-1, Math.round(Math.random())) * 0.1 * Math.random().toFixed(5);
                //自身地标周围的随机经度
                var longitude = poiture.longitude + Math.pow(-1, Math.round(Math.random())) * 0.1 * Math.random().toFixed(5);
                //随机地标

                var mItem = {
                  id: idItem,
                  latitude: latitude,
                  longitude: longitude,
                  title: province,
                  iconPath: poiture.img,
                  width: 26,
                  height: 26,
                  zIndex: 999,
                  callout: {
                    content: calloutStr,
                    color: "#fff",
                    fontSize: 16,
                    textAlign: "center",
                    padding: 8,
                    bgColor: poiture.color,
                    borderColor: poiture.color,
                    display: "ALWAYS"
                  }
                }
                markers.push(mItem);
                //删除该组子集
                tar.splice(i, 1);
                poisObj[poiindex] = tar;
                //更新makers标记点对象
                wx.that.setData({ markers: markers, pois: poisObj });
              } else {
                ++listLen;
              }
            }
          }
        }
      }
    }})
  },
  seekingrelativesFn(ev){
    //跳转寻亲页面
    wx.reLaunch({url:"/total/total"});
  },
  movetoFn:function(ev){
    //将中心坐标移动到自身坐标
    this.mapCtx.moveToLocation();
  },
  regionchangeFn:function(ev){
   this.mapCtx.getCenterLocation({
      success:(res)=>{
        //更新省份
        if(ev.type=="end"){
          //translateMarker是移动marker
          this.mapCtx.translateMarker({
            markerId: 0,
            destination: {
              latitude: res.latitude,
              longitude: res.longitude
            },
            duration: 100,
            animationEnd: ()=> {
              var markers = wx.that.data.markers;
              markers[0].latitude = res.latitude;
              markers[0].longitude = res.longitude;
              //更新数据
              wx.that.setData({
                markers: markers
              });
              wx.that.getProvince({ latitude: res.latitude, longitude: res.longitude },
                () => {
                  //拖动地图，检测经过的省份是否在原籍数组中找到，若有，增加关于此省的POI
                  wx.that.mousefn("ancestral", { dn: "原籍", latitude: res.latitude, longitude: res.longitude, color:"#E64340",img:"/image/location_red.png"});
                  //拖动地图，检测经过的省份是否在祖籍数组中找到，若有，增加关于此省的POI
                  wx.that.mousefn("original", { dn: "祖籍", latitude: res.latitude, longitude: res.longitude, color: "#1AAD19", img: "/image/location_green.png" });
                  //拖动地图，检测经过的省份是否在常住地数组中找到，若有，增加关于此省的POI
                  wx.that.mousefn("obode", { dn: "常住地", latitude: res.latitude, longitude: res.longitude, color: "#1296db", img: "/image/location_blue.png" });
                }
              );
            }
            ,
            fail: function (err) {

              console.log(err, "怎么回事？");
            }
          })
          
          
        }
        
      },
      fail:function(err){
        console.log("犯了啥错？",err);
      }
    })

  },
  addressfn(obj) {
    wx.getSetting({success:res=>{
      if(res.authSetting["scope.userLocation"]){
        /*
    obj的格式{
      url,
      img
    }
    */
        //参数
        var poiture = wx.that.data.poiobj;
        //更新类型
        poiture.type = obj.type;
        var markers = wx.that.data.markers;
        this.mapCtx.getCenterLocation({
          success: (res) => {
            //中心地址=>res
            //更新中心坐标点
            markers[0].latitude = res.latitude;
            markers[0].longitude = res.longitude;
            //打开加载状态
            wx.showLoading({ title: "正在加载" });
            wx.request({
              url: wx.util.api() + obj.url,
              data: poiture,
              success: function (tag) {
                if (tag.data.code) {
                  var list = tag.data.list, typeaddress = Number(poiture.type);
                  var decideName = "", dn = "", dncolor = "";
                  switch (typeaddress) {
                    case 0: decideName = "ancestral"; dn = "原籍"; dncolor = "#E64340"; break;
                    case 1: decideName = "original"; dn = "祖籍"; dncolor = "#1AAD19"; break;
                    case 2: decideName = "obode"; dn = "常住地"; dncolor = "#1296db"; break;
                  }
                  var poisObj = wx.that.data.pois;

                  //取name为想要的省份

                  var listLen = 0, len = list.length;
                  for (var i = 0; i <= listLen; i++) {
                    if (i < len) {
                      //避免'name' of undefined错误
                      if (list[i]) {
                        if (list[i].name == poiture.province) {
                          //人数
                          var people = list[i].nums;
                          //markers的callout的content
                          if (people > 888) {
                            var calloutStr = dn + "省份为" + list[i].name + "的已超过888人";
                          } else {
                            var calloutStr = list[i].name + "：" + people + "人（" + dn + "省份）";
                          }

                          var objMarkers = [];
                          objMarkers[0] = markers[0];
                          //设置新添加的markers子集的id
                          var idItem = objMarkers.length;
                          //仿地标
                          //自己位置的周围
                          //自身地标周围的随机纬度
                          var latitude = res.latitude + Math.pow(-1, Math.round(Math.random())) * 0.1 * Math.random().toFixed(5);
                          //自身地标周围的随机经度
                          var longitude = res.longitude + Math.pow(-1, Math.round(Math.random())) * 0.1 * Math.random().toFixed(5);
                          //随机地标

                          var mItem = {
                            id: idItem,
                            latitude: latitude,
                            longitude: longitude,
                            iconPath: obj.img,
                            title: list[i].name,
                            width: 26,
                            height: 26,
                            zIndex: 999,
                            callout: {
                              content: calloutStr,
                              color: "#fff",
                              fontSize: 16,
                              textAlign: "center",
                              padding: 8,
                              display: "ALWAYS",
                              bgColor: dncolor,
                              borderColor: dncolor
                            }
                          }
                          objMarkers.push(mItem);
                          //poi好了，删除该子集
                          list.splice(i, 1);
                          poisObj[decideName] = list;

                          //更新makers标记点对象
                          wx.that.setData({ markers: objMarkers, pois: poisObj });
                          //关闭加载状态
                          wx.hideLoading();
                        } else {
                          ++listLen;
                        }
                      }

                      if (listLen == len) {
                        //关闭加载状态
                        wx.hideLoading();
                      }
                    }
                  }

                } else {
                  //关闭加载状态
                  wx.hideLoading();
                }
              },
              fail: function (err) {
                console.log(err, "请求失败");
                //关闭加载状态
                wx.hideLoading();
              }
            });



          },
          fail: function (err) {
            console.log("犯了啥错？");
          },

        })
      }else{
        wx.getLocation({complete:res=>{
          if (res.errMsg =="getLocation:ok"){
            wx.reLaunch({
              url: '/map/map',
            })
          }
        }});
      }
    }})
    
    
  },
  ancestralFn:function(ev){
    //原籍请求
    this.addressfn({ img: "/image/location_red.png", type: 0, url:"ruan.php?s=/apicheck/get_user_distribution"});    
  },
  originalFn:function(ev){
    //祖籍请求
    this.addressfn({ img: "/image/location_green.png", type: 1, url: "ruan.php?s=/apicheck/get_user_distribution"});
  },
  obodeFn:function(ev){
    //常住地请求
    this.addressfn({ img: "/image/location_blue.png", type: 2, url: "ruan.php?s=/apicheck/get_user_distribution"});
  },
  markerFn:function(ev){
    console.log(ev,"错误");
  },
  data: {
    key:"4TVBZ-EC4K4-MBCUW-XQGZN-6DCS5-V7F4F",
    scale:8,
    circles:[
    ],
    poiobj:{
      token:wx.getStorageSync("token")
    },
    pois:{
      ancestral:[],
      original:[],
      obode:[]
    }
  },
  onLoad: function () {
    wx.getSetting({success:res=>{
      if(!res.authSetting["scope.userLocation"]){
        wx.showModal({
          content: '你未开启GPS，大部分定位的功能没有反应，是否返回？',
          success:function(res){
            if(res.confirm){
              wx.navigateBack();
            }
          }
        })
      }
    }})
    wx.that=this;
    wx.that.setData({
      markers: [
        {
          id: 0,
          iconPath: "/image/location.png",
          width: 24,
          height: 24,
          zIndex: 999,
          callout: {
            content: "中心坐标",
            color: "#262",
            fontSize: 12,
            textAlign: "center",
            padding: 6
          }
        }
      ]
    });
    //是否允许获取自身的位置
    wx.getLocation({
      success:function(res){
       wx.that.setData({
         mylocation:res,
         latitude: res.latitude, 
         longitude: res.longitude,
         markers: [
           {
             id: 0,
             latitude: res.latitude,
             longitude: res.longitude,
             iconPath: "/image/location.png",
             width: 24,
             height: 24,
             zIndex: 999,
             callout: {
               content: "中心坐标",
               color: "#262",
               fontSize: 12,
               textAlign: "center",
               padding: 6
             }
           }
         ]
       });
        //获取省份
        wx.that.getProvince({latitude:res.latitude,longitude:res.longitude});
      }
  }); 
  },
  onReady: function (e) {
    this.mapCtx = wx.createMapContext('myMap');
    console.log(this.mapCtx);
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },
  scaleFn:function(ev){
    
    if(this.data.scale<=18){
      if(ev.currentTarget.dataset.scale=="add"){
        this.setData({scale:++this.data.scale})
      }
    }
    if(this.data.scale>=5){
      if(ev.currentTarget.dataset.scale=="less"){
        this.setData({scale:--this.data.scale})
      }
    }
    console.log(wx.that.data.scale);
  }
})
