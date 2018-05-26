var {mongoose}=require('../db/mongoose.js');

var user=mongoose.model('user',{
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true
  },
  password:{
    type:String,
    default:'dvc'
  }
})

module.exports={
  user:user
}
