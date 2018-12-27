var app=new Vue({
	el:"#page",
	data:{
		alertinfo:{
			val:"",
			show:false
		},
		codeshow:{show:true,val:"获取校验码"},
		second:30,
		productvalue:"",
		iftrue:true,
		iffalse:false,
		areaArr:["省份","城市"],
		selectCount:[-1,-1,-1],
		coCount:-1,
		/*身体内容部分*/
		informationArr:[{
				title:"你好",
				progress:{
					max:6,
					value:3
				}
			},{
				title:"我好",
				progress:{
					max:4,
					value:3
				}
		}],
		/*底部弹窗部分*/
		bsdata:{
			show:false
		},
		/*侧边栏城市*/
		slidecitys:{
			show:false
		},
		areaobj:[
			
		],
		cityObj:[],
		/*省市区灰屏*/
		ssqtrue:true,
		checkarr:["dongguan"],
		/*表单参数*/
		formobj:{
			tname:{},
			tphone:{},
			tcode:{},
			tarea:{},
			taddress:{},
			tbrand:{},
			treferral:{val:""},
			tcheckbox:{}
		}
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
	beforeMount:function(){
		
	},
	methods:{
		icfn:function(e){
			console.log(this.formobj,"难道说？");
			
		},
		closealert:function(){
			this.alertinfo.show=false;
		},
		savefn:function(){
			$("#myAlert").modal("show");
			
			var alertobj;
			var that=this;
			//获取参数对象
			var jointObj=this.formobj;
			//是否提交表单的变量
			var judgeture=true;
			
			//常住地区
			jointObj.tarea.val=this.areaobj.filter(function(item){
				if(item){return item;}
			});
			
			//销售地区
			jointObj.tcheckbox.val=this.checkarr;

			var keyarr = ["tname", "tphone", "tcode", "tarea", "taddress", "tbrand", "treferral", "tcheckbox"],maxi=0;
            
		    for(var vi=0;vi<=maxi;vi++){
		      console.log(vi,keyarr[vi],jointObj[keyarr[vi]].val);
		      switch(keyarr[vi]){
		        // 真实姓名
		        case "tname":jointObj[keyarr[vi]].val?
		        (()=>{
		          ++maxi;
		          })():(()=>{
		            alertobj={val:"真实姓名不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 手机号
		        case "tphone":jointObj[keyarr[vi]].val?
		        (()=>{
		          var tel=Number(jointObj[keyarr[vi]].val);
		          if(/^1\d{10}$/.test(tel)){
		          	++maxi;
		          }else{
		          	alertobj={val:"手机号首位必须为1，而且是11位数字",show:true};
		            judgeture = false;
		            return;
		          }
		          })():(()=>{
		            alertobj={val:"手机号不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 校验码
		        case "tcode":jointObj[keyarr[vi]].val?
		        (()=>{
		          ++maxi;
		          })():(()=>{
		            alertobj={val:"校验码不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 常住地区
		        case "tarea":jointObj[keyarr[vi]].val?
		        (()=>{
		              var areaArr=jointObj[keyarr[vi]].val;
			          if(areaArr.length){
			          	++maxi;
			          }else{
			          	alertobj={val:"常住地区不能为空",show:true};
			            judgeture = false;
			            return;
			          }
		          })():(()=>{
		            alertobj={val:"常住地区不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 销售品牌
		        case "tbrand":jointObj[keyarr[vi]].val?
		        (()=>{
		          ++maxi;
		          })():(()=>{
		            alertobj={val:"销售品牌不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 主营产品
		        case "treferral":jointObj[keyarr[vi]].val?
		        (()=>{
		        	var tbs=jointObj[keyarr[vi]].val.length;
		        	if(tbs>=20&&tbs<=200){
		        		++maxi;
		        	}else{
		        		alertobj={val:"主营产品介绍字数不少于20，不高于200",show:true};
			            judgeture = false;
			            return;
		        	}
		          })():(()=>{
		            alertobj={val:"主营产品介绍不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        // 销售地区
		        case "tcheckbox":jointObj[keyarr[vi]].val?
		        (()=>{
		              var areaArr=jointObj[keyarr[vi]].val;
			          if(areaArr.length){
			          	++maxi;
			          }else{
			          	alertobj={val:"销售地区未选",show:true};
			            judgeture = false;
			            return;
			          }
		          })():(()=>{
		            alertobj={val:"销售地区不能为空",show:true};
		            judgeture = false;
		            return;
		        })();break;
		        default:if(maxi<keyarr.length){
		        	++maxi;
		        }
		      }
		    }
		    console.log(alertobj,"提示信息");
		    if(judgeture){
		    	
		    }else{
		    	this.alertinfo=alertobj;
		    	$("#myAlert").modal("show");
		    	//点击提示框外就取消提示框
		    	/*$("#page").one("click",()=>{
					this.closealert();
				})*/
		    }
		    return false;
		},
		codefn:function(){
			console.log("奇怪了，",this.codeshow);
			var resultR=this.formobj.tphone.val;
			resultR?
	        (()=>{
	          var tel=Number(resultR);
	          if(/^1\d{10}$/.test(tel)){
	          	//发送一个请求
//			$.ajax({
//				url:"",
//				type:"POST",
//				success:function(data){
//					console.log(data,"请求成功");
//				},
//				error:function(err){
//					console.log(err,"请求错误");
//				}
//			})
            var that=this;
            this.codeshow.show=false;
            var secondcode=window.setInterval(function(){
            	that.second--;
            	if(that.second<=0){
            		window.clearInterval(secondcode);
            		that.codeshow.show=true;
            		that.codeshow.val="重新获取校验码"
            		that.second=30;
            	}
            },1000)
	          }else{
	          	this.alertinfo={val:"手机号首位必须为1，而且是11位数字",show:true};
	            $("#myAlert").modal("show");
	          }
	          })():(()=>{
	            this.alertinfo={val:"手机号不能为空",show:true};
	            $("#myAlert").modal("show");
	          
	        })();
			
		},
		togglearea:function(){
			//开关
			if($("#areachoose").css("display")=="none"){
				//切换到省份
				this.coCount=0;
				$("#areachoose").fadeIn("linear");
				this.ssqtrue=true;
				$("#page").one("click",()=>{
					//切换到省份
					this.coCount=-1;
					$("#areachoose").fadeOut(100);
					this.ssqtrue=false;
				})
				
			}else{
				//毁灭痕迹
				this.coCount=-1;
				$("#areachoose").fadeOut(100);
				this.ssqtrue=false;
				
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
});
