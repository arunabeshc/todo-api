var {user}=require('../models/user');

var authenticate=(req,res,next)=>{
  var token=req.header('x-auth');

    user.findByToken(token).then((user)=>{
      if(!user){
        return Promise.reject();
      }
        //res.status(200).send(user);
        req.user=user;
        req.token=token;
        next();
    }).catch((e)=>{
        return  res.status(401).send(401,e);
    });
}

module.exports={authenticate};
