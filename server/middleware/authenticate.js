var {user}=require('../models/user');

var authenticate=(req,res,next)=>{
  var token=req.header('x-auth');
  console.log('token is ',token);
    user.findByToken(token).then((user)=>{
      if(!user){
        return Promise.reject();
        console.log('not found rejected !!');
      }
        //res.status(200).send(user);
        console.log(user.email);
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>{
        return  res.status(401).send(401,e);
    });
}

module.exports={authenticate};
