var app=new Vue({
	el:"#page",
	data:{
		iftrue:true,
		iffalse:false,
		areaArr:["省份","城市"],
		selectCount:[-1,-1,-1],
		coCount:-1,
		/*身体内容部分*/
		informationArr:[{
				prop:"招标",
				title:"威有（东莞）网络技术有限公司",
				province:"广东",
				time:new Date().toDateString()
			
		}],
		/*底部弹窗部分*/
		bsdata:{
			show:true
		},
		/*侧边栏城市*/
		slidecitys:{
			show:false
		},
		areaobj:[
		],
		cityObj:[]
	},
	beforeCreate:function(){
		
	},
	created:function(){
		var that=this;
		$.ajax({
			url:"../../city.json",
			type:"GET",
			success:function(data){
				
				that.cityObj=[];
				that.cityObj[0]=data.data.cityList;
				console.log(that.cityObj,"请求成功");
			},
			error:function(err){
				console.log(err,"错误");
			}
		})
	},
	methods:{
		togglearea:function(){
			//开关
			if($("#areachoose").css("display")=="none"){
				//切换到省份
				this.coCount=0;
				$("#areachoose").fadeIn("linear");
				
			}else{
				//毁灭痕迹
				this.coCount=-1;
				$("#areachoose").fadeOut(100);
			}
		},
		optionfn:function(count){
			console.log(count,"共花费");
			if(count||count==0){
				this.coCount=count;
			}
			//显示下拉列表
			$("#areachoose").fadeIn("slow");
		},
		infornav:function(item){
			//条状详情页面
			window.location.assign("../BLusinessDetails/index.html");
		},
		closebottom:function(){
			//关闭底部弹窗
			this.bsdata.show=false;
		},
		areafn:function(){
			//打开地区检索
			this.slidecitys.show=!this.slidecitys.show;
			this.coCount=-1;
		},
		postsites:function(data,ii){
			//请求
			console.log(data,"我靠",ii);
			this.coCount=ii;
			
		},
		searchareafn:function(data,name){
			
			//省市区
			
			this.areaobj[this.coCount]=name;
			
			var sheng=this.cityObj[this.coCount];
			
			var childs=sheng[data].subLevelModelList;
			
			
			this.selectCount[this.coCount]=data;
			
			if(Array.isArray(childs)){
				if(childs.length){
					   //消除地区下一级的选取状态
					   this.areaobj[(this.coCount+1)]="";
						
					   this.selectCount[(this.coCount+1)]=-1;
			
					   //改变提醒坐标
					   
					   //改变下标
					   this.coCount++;
					   this.cityObj[this.coCount]=childs;
					   
				}
			}else{
				//消失下拉列表
				$("#areachoose").fadeOut(100);
				this.coCount=-1;
			}
			
		}
	}
})
