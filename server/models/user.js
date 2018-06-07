const {mongoose}=require('../db/mongoose.js');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');

var userSchema=new mongoose.Schema({
  email:{
    type:String,
    required:true,
    minlength:1,
    trim:true,
    unique:true,
    validate: {
      validator: (value) => {
        return validator.isEmail(value);
      }
      ,
      message: `{value} is not a valid email`
    }
  },
  password:{
    type:String,
    required: true,
    minLength: 6
  },
  tokens:[{
    access: {
      type:String,
      required:true
    },
    token: {
      type:String,
      required:true
    }
  }]
});

userSchema.methods.toJSON=function(){
  var user=this;
  var userObject=user.toObject();

  return _.pick(userObject,['_id','email']);
}

userSchema.methods.generateAuthToken=function() {
  var user = this;
  var access='auth';
  var token=jwt.sign({_id: user._id.toHexString(), access},'abc123');

  user.tokens=user.tokens.concat([{access,token}]);

  return user.save().then(()=>{
    return token;
  })
};

var user=mongoose.model('user',userSchema);

module.exports={
  user:user
}
