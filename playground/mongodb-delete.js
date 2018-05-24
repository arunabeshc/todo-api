
const {MongoClient,ObjectID}=require('mongodb');



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('unable to connect to mongoDB server');
  }
  console.log('connected to server successfully');

// db.collection('nameAgeLocation').deleteMany({age:25}).then((result)=>{
//   console.log(result);
// });

// db.collection('nameAgeLocation').deleteOne({age:30}).then((result)=>{
//   console.log(result);
// });

db.collection('nameAgeLocation').findOneAndDelete({_id:new ObjectID('5b059a7b36fb6a02a03a29a4')}).then((result)=>{
  console.log(result);
});
db.close();
});
