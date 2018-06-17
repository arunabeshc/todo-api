require('./config/config');

const _=require('lodash');

const express=require('express');
const bodyparser=require('body-parser');

const {ObjectID}=require('mongodb');

var {mongoose}=require('./db/mongoose');
var {user}=require('./models/user');
var {todo}=require('./models/todo');
var {authenticate}=require('./middleware/authenticate');

const port=process.env.PORT;

var app=express();

app.use(bodyparser.json());

app.post('/todos',authenticate,(req,res)=>{
  //console.log(req.body);

  var todos=new todo({
    text:req.body.text,
    completed:req.body.completed,
    completedAt:req.body.completedAt
  });


  todos.save().then((doc)=>{
    //res.send(200,`data saved successfully ,${JSON.stringify(doc,undefined,2)}`);
    res.send(200,doc);
  },(e)=>{
    res.send(400,e);
  });
});

app.get('/todos',(req,res)=>{
  todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.send(e);
  })
})

app.get('/todos/:id',(req,res)=>{
  var id=req.params.id;

  if(!ObjectID.isValid(id)){
    return res.send(404,'Invalid ID');
  }

  todo.findById(id).then((todo)=>{
    if(!todo){
        return res.send(404);
    }else{
    return res.send({todo});
  }
}).catch((e)=>{
  res.send(400);
});

});

app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id;

  if(!ObjectID.isValid(id)){
    return res.send(404,'Invalid ID');
  }

  todo.findByIdAndRemove(id).then((todo)=>{
    if(!todo){
        return res.send(404);
    }else{
    return res.send(200,{todo});
  }
}).catch((e)=>{
  res.send(400);
});
});

app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text','completed']);

  if(!ObjectID.isValid(id)){
    return res.send(404,'Invalid ID');
  }

  if(_.isBoolean(body.completed) && body.completed)
{
  body.completedAt=new Date().getTime();
}
else
{
  body.completed=false;
  body.completedAt=null;
}

todo.findByIdAndUpdate(id, {$set:body}, {new:true}).then((todo)=>{
  if(!todo){
    return  res.send(404,'Todo not found');
  }

  return res.send({todo});

}).catch((e)=>{
  console.log(e);
});

});

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


app.post('/users/login',(req,res)=>{
  //console.log(req.body);

  var body=_.pick(req.body,['email','password']);

  user.findByCredentials(body.email,body.password).then((user)=>{
    return user.generateAuthToken().then((token)=>{
    res.header('x-auth',token).status(200).send(user);
  }).catch((e)=>{
    res.send(400,`the fuck !! ${e}`);
  });
    //  res.status(200).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  })

});


app.get('/users/me',authenticate, (req,res)=>{
  console.log(req.user);
  res.send(req.user);
});

app.listen(port,()=>{
  console.log(`started server on port ${port}`);
});

app.delete('/users/me/token',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch((e)=>{
    res.status(400).send();
  })
})

module.exports={app}

// var newUser=new user({
//   email:'  '
// });
//
// newUser.save().then((s)=>{
//   console.log('data saved is ',JSON.stringify(s));
// },(e)=>{
//   console.log('unable to save due to error ',e);
// })
