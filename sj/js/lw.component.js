/*依赖Vue.js*/
var nameComponent=Vue.component("name-conponent",{
	template:`
	<div v-if="(modalstatus=='close')" class="modal fade"  id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
	        <div class="modal-content">
	            <div class="modal-header">
	                <h4 class="modal-title text-info" id="myModalLabel">{{nameMust.title}}</h4>
	            </div>
	            <div class="modal-body text-primary">
	            	{{nameMust.content}}
	            <div class="m-flex-img" v-if="nameMust">
	
	                <img v-bind:src="nameMust.leftimg" class="mf-img"/>
	
	
	                <img v-bind:src="nameMust.rightimg" class="mf-img"/>
	
	            </div>
	            </div>
	            <div class="modal-footer">
	                <a type="button" class="btn btn-danger lw-btn" href="../BLregister/index.html" target="_blank">完善资料</a>
	            </div>
	        </div>
	    </div>
	</div>
	`,
	props:["modalshow"],
	data:function(){
		return {
			modalstatus:window.localStorage.ms,
			nameMust:{
				title:"通知",
				content:"【中华人名共和国网络完全法】要求：用户必须提供真实身份信息。不提供真实身份信息的，网络运营者不得为其提供相关服务。",
				leftimg:"../../img/BLxinxibu.jpg",
				rightimg:"../../img/BLjingcha.jpg"
			}
	    }
	},
	mounted:function(){
		console.log();
		$("#myModal").modal("show");
	}
})

/*身份弹窗*/
var idcardComponent=Vue.component("idcard-conponent",{
	template:`
	<div  class="modal fade"  id="myIdCard" tabindex="-1" role="dialog" aria-labelledby="myIdCard" aria-hidden="true" data-backdrop="static">
		<div class="modal-dialog">
	        <div class="modal-content idcard-content">
	            <div class="modal-header idcard-header">
	                <h4 class="modal-title idcard-title">{{nameMust.title}}</h4>
	            </div>
	            <div class="modal-body idcard-body">
	            	{{nameMust.content}}
	            </div>
	            <div class="modal-footer idcard-footer">
	                <a type="button" class="idcard-btn" href="../idcard/idcard.html" target="_self">前去认证</a>
	            </div>
	        </div>
	    </div>
	</div>
	`,
	data:function(){
		return {
			modalstatus:window.localStorage.ms,
			nameMust:{
				title:"身份认证",
				content:"请先完成身份认证"
			}
	    }
	},
	mounted:function(){
		$("#myIdCard").modal("show");
	}
})
/*提示弹窗*/
var alertComponent=Vue.component("alert-conponent",{
	props:["infodatas"],
	template:`
	<div  class="modal fade"  id="myAlert" tabindex="-1" role="dialog" aria-labelledby="myAlert">
		<div class="modal-dialog">
	        <div class="modal-content idcard-content">
	            <div class="modal-header idcard-header">
	                <h4 class="modal-title idcard-title">{{infodatas.val}}</h4>
	            </div>
	            <div class="modal-footer idcard-footer">
	                <a data-dismiss="modal" class="idcard-btn">确认</a>
	            </div>
	        </div>
	    </div>
	</div>
	`,
	
	data:function(){
		return {
			modalstatus:window.localStorage.ms,
			nameMust:{
				title:"身份认证",
				content:"请先完成身份认证"
			}
	    }
	},
	mounted:function(){
		
		console.log(this);
		
	}
})

/*底部导航*/
var myTabbar=Vue.component("my-tabbar",{
	props:["tabac"],
	template:`
	<div class="tabbar-fixed" >
	      <slot></slot>
		  <div class="tabbar" v-if="!(tabac=='hide')">
		   <template v-for="(ite,ind) in tabarr">
		    <a class="tabbar-item" v-bind:href="ite.href" target="_blank" v-bind:style="{color:ind==$attrs.tabactive?'red':''}">
				<div v-bind:class="ite.icon"></div>
				<div class="t-i-bottomtext">{{ite.name}}</div>
			</a>
		   </template>
		  </div>
	</div>
	`,
	data:function(){
		return {
			tabarr:[
			{href:"../informationList/informationIndex.html",icon:{
				"glyphicon-alert":true,
				"glyphicon":true,
				"t-i-icon":true
			},name:"询盘商机"},
			{href:"../inretrieval/inretrieval.html",icon:{
				"glyphicon-alert":true,
				"glyphicon":true,
				"t-i-icon":true
			},name:"地区检索"},
			{href:"../BLdeal/index.html",icon:{
				"glyphicon-alert":true,
				"glyphicon":true,
				"t-i-icon":true
			},name:"成交案例"}
			]
		}
	},
	mounted:function(){
		console.log(this,"组件");
	}
})
