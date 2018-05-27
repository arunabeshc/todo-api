const {ObjectID}=require('mongodb');

const {mongoose}=require('../server/db/mongoose');
const {todo}=require('../server/models/todo');
const {user}=require('../server/models/user');

var id='5b0a3cbe17b0a5af3f832ddb';

if(!ObjectID.isValid(id)){
  return console.log('invalid id');
}

// todo.find({
//   _id:id
// }).then((todos)=>{
//   console.log('todos',todos);
// });
//
//
// todo.findOne({
//   text:"second todo"
// }).then((todos)=>{
//   console.log('todos',todos);
// });


// todo.findById(id).then((todo)=>{
//   if(!todo){
//     return console.log('id not found');
//   }
//   console.log('Todo by id ',todo);
// }).catch((e)=>{
//   console.log(e);
// });

user.findById(id).then((user)=>{
  if(!user){
    return console.log('user not found');
  }
  console.log('user is ',JSON.stringify(user,undefined,2));
},(e)=>{
  console.log(e);
});
