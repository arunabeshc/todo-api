const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var message='i am user no 6';
var hash=SHA256(message).toString();
var password='dvc123456!';
console.log('messsage encrypted is ',hash);

bcrypt.genSalt(10,(err,salt)=>{
  if(!err){
    bcrypt.hash(password,salt,(err,hash)=>{
      console.log('generating salt');
      console.log(hash);
      var hashedPassword='$2a$10$zJQBAVl6u6kSp.kAaRSehO07//ri57nZKyRxLd6R5eNwMefI6Lxj.';
      bcrypt.compare('dvc123456!',hashedPassword,(err,res)=>{
        if(!err){
          console.log('passwords match  =>');
          console.log(res);
        }
      });
    })
  }
})

var data={
  id:4
}

var token={
  data,
  hash: SHA256(JSON.stringify(data)+'secret').toString()
}
//
// token.data.id=7;
// token.hash=SHA256(JSON.stringify(token.data)).toString();

var resultHash= SHA256(JSON.stringify(token.data)+'secret').toString();

if(token.hash===resultHash){
  console.log('Secured !! Please proceed');
}
else{
  console.log('Security error');
}

var data={
  id:10
}

token=jwt.sign(data,'abc123456')
console.log(token);

decoded=jwt.verify(token,'abc123456');
console.log(decoded);
