const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id:9
}
var token = jwt.sign(data, 'abc123');
console.log(token);

var decoded=jwt.verify(token,'abc123');
console.log('decoded' , decoded);





// var message = 'I am Manisha';
// var hashing = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hashing : ${hashing}`);


// var data = {
//     id:4
// }
// var token={
//     data,
//     hash : SHA256(JSON.stringify(data) + 'somesecrete').toString()
// }
//  token.data.id= 5;
//  token.hash=SHA256(JSON.stringify(token.data)).toString();


// var hashdata = SHA256(JSON.stringify(token.data)+'somesecrete').toString();

// if(hashdata === token.hash){
//     console.log('Data not changed');
// }
// else{
//     console.log('Data was changed, do not trust');
// }