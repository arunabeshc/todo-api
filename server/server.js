var express=require('express');
var bodyparser=require('body-parser');

var {mongoose}=require('./db/mongoose');
var {user}=require('./models/user');
var {todo}=require('./models/todo');


var app=express();

app.use(bodyparser.json());

app.post('/todos',(req,res)=>{
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

app.listen(3000,()=>{
  console.log('Started server on port 3000');
});

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
