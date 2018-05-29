const {ObjectID}=require('mongodb');

const {mongoose}=require('../server/db/mongoose');
const {todo}=require('../server/models/todo');
const {user}=require('../server/models/user');

// todo.remove({}).then((result)=>{
//   console.log('data removed !! ',result);
// })

todo.findOneAndRemove({
  text:"first todo on the web mongo"
}).then((result)=>{
  console.log(result);
},(e)=>{
  console.log(e);
});
