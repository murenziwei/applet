var app=new Vue({
	el:"#page",
	data:{
		idcard:{
			progress:{
				val:"待认证",
				name:"认证进度"
			},
			idcpic:{
				name:"身份证照",
				info:"（正反面及手持自拍照，共3张）"
			},
			imgs:[],
			max:3,
			notice:"*请上传清晰彩色完整的原件照片，身份证各项信息及头像清晰可见容易识别；证件必须真实拍摄，不能使用复印件，图片大小不超过4M"
		},
		html:{
			title:"完善身份"
		},
        imgData: {
            accept: 'image/gif, image/jpeg, image/png, image/jpg',
		},
		/*底部弹窗部分*/
		bsdata:{
			show:false
		},
		/*表单参数*/
		formobj:{
			
		}
	},
	created:function(){
		
	},
	beforeMount:function(){
		
	},
	mounted:function(){
	
	},
	methods:{
		add_img(event){  
	            let reader =new FileReader();
	            let img1=event.target.files[0];
	            let type=img1.type;//文件的类型，判断是否是图片
	            let size=img1.size;//文件的大小，判断图片的大小
	            if(this.imgData.accept.indexOf(type) == -1){
	                alert('请选择我们支持的图片格式！');
	                return false;
	            }
	            if(size>3145728){
	                alert('请选择3M以内的图片！');
	                return false;
	            }
	            var uri = ''
	            let form = new FormData(); 
	            form.append('file',img1,img1.name);
	            console.log(form,"说不中",img1,img1.name);
	            if(img1.name){
	            this.idcard.imgs.push(window.URL.createObjectURL(img1));	
	            }
	            
//	            this.$http.post('/file/upload',form,{
//	                headers:{'Content-Type':'multipart/form-data'}
//	            }).then(response => {
//	                console.log(response.data)
//	                uri = response.data.url
//	                reader.readAsDataURL(img1);
//	                var that=this;
//	                reader.onloadend=function(){
//	                    that.imgs.push(uri);
//	                }
//	            }).catch(error => {
//	                alert('上传图片出错！');
//	            })    
		}
	}
});
