const {SHA256}=require('crypto-js');
const jwt=require('jsonwebtoken');

var message='i am user no 6';
var hash=SHA256(message).toString();

console.log('messsage encrypted is ',hash);

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
