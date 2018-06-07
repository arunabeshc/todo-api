app.post('/users',(req,res)=>{
  //console.log(req.body);

  var body=_.pick(req.body,['email','password']);

  var users=new user({
    email:body.email,
    password:body.password
  });



  users.save().then(()=>{
    //res.send(200,`data saved successfully ,${JSON.stringify(doc,undefined,2)}`);

    return users.generateAuthToken();

  }).then((token)=>{
    res.header('x-auth',token).status(200).send(users);
  }).catch((e)=>{
    res.send(400,`the fuck !! ${e}`);
  });
});
