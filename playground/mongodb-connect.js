//const MongoClient=require('mongodb').MongoClient;

const {MongoClient,ObjectID}=require('mongodb');

// var obj=new ObjectID();
//
// var user={name:'riju',age:30};
// var {name}=user;
// console.log(name);


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
  if(err){
    return console.log('unable to connect to mongoDB server');
  }
  console.log('connected to server successfully');

  db.collection('nameAgeLocation').find({
    name:'riju'

    //_id:new ObjectID('5b050df4901d3f027ea38949')
  }).toArray().then((docs)=>{
    console.log(`Todos ${JSON.stringify(docs,undefined,2)}`);
  },(err)=>{
    console.log('unable to fetch todos ',err);
  });

  db.collection('nameAgeLocation').count({
    name:'riju'

    //_id:new ObjectID('5b050df4901d3f027ea38949')
  }).then((docs)=>{
    console.log(`Count ${JSON.stringify(docs,undefined,2)}`);
  },(err)=>{
    console.log('unable to fetch todos ',err);
  });

  // db.collection('Todos').insertOne({
  //   text:'something to do',
  //   completed:false
  // },(err,result)=>{
  //   if(err){
  //     return console.log('unable to insert todo ',err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });


  // db.collection('nameAgeLocation').insertOne({
  //   name:'riju',
  //   age:30,
  //   location:'kolkata'
  // },(err,result)=>{
  //   if(err){
  //     return console.log('unable to insert a rec in nameAgeLocation ',err);
  //   }
  //
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp()));
  // });
  //
  db.close();
});
