const {mongoose}=require('../db/mongoose.js');
const validator=require('validator');
const jwt=require('jsonwebtoken');
const _=require('lodash');
const bcrypt=require('bcryptjs');

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

userSchema.pre('save',function(next){
  var user=this;
  if(user.isModified('password')){


    bcrypt.genSalt(10,(err,salt)=>{

        bcrypt.hash(user.password,salt,(err,hash)=>{
          console.log('generating salt');
          console.log(hash);

          user.password=hash;
          next();

        })

    })



  }else{
    next();
  }

});

userSchema.methods.removeToken=function(token){
  var user=this;
  return user.update({
    $pull: {
      tokens: {
        token: token
      }
    }
  })

  return _.pick(userObject,['_id','email']);
}

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

userSchema.statics.findByToken=function(token) {
  var user = this;
  var decoded;
  try{
    decoded=jwt.verify(token,'abc123');
    console.log('decoded is ',decoded);


  }catch(e){
    // var promise=new Promise((resolve,reject)=>{
    //   reject();
    // })
    // return promise;

    return Promise.reject('cannot decode sorry :( !!');
  }

  return user.findOne({
    '_id' : decoded._id,
    'tokens.token': token,
    'tokens.access': decoded.access
  });
}

userSchema.statics.findByCredentials=function(email,password) {
  var user = this;

return user.findOne({
  'email': email
}).then((user)=>{

  if(!user){
      return Promise.reject("user does not exist");
  }
  else{
      console.log('email exists !!');
      return new Promise((resolve,reject)=>{
        bcrypt.compare(password,user.password,(err,res)=>{
          if(!err){
            resolve(user);
              console.log('password matches !!');
          }
          else{
            reject();
          }
        });
      })
  }
});
};




var user=mongoose.model('user',userSchema);

module.exports={
  user:user
}
