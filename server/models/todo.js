var {mongoose}=require('../db/mongoose.js');

var todo=mongoose.model('todo',{
  text:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  completed:{
    type:Boolean,
    default:false,
    required:true
  },
  completedAt:{
    type:Number,
    default:null
  }
});

module.exports={todo}
