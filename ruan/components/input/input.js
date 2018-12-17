// components/input/input.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    titlestr:{
      type:String
    },
    valuestr:{
      type:String,
      data:""
    },
    valueindex:{
      type:String
    },
    typestr:{
      type:String
    },
    lengthstr:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    inputFn:function(ev){
      this.setData({
        valuestr:ev.detail.value
      });
    },
    saveFn:function(){
      var that=this;

      this.triggerEvent("inputemit",{judge:false,valueinput:that.data.valuestr,name:that.data.valueindex});
    },
    cancelFn:function(){
      var that=this;
      this.triggerEvent("cancelemit",{
        judge:false
      });
    }
  }
})
