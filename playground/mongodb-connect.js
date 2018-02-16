// import { ObjectId } from '../../../../.cache/typescript/2.6/node_modules/@types/bson';

// const MongoClient = require('mongodb').MongoClient;
// const mongoose = require('mongoose');

// MongoClient.create('mongodb://localhost:27017/TodoApp',(err, db)=>{
//     if(err){
//         return console.log('Unable to connect to the server');
//     }
//     console.log('Connectd to mongodb server');
//     var collection=db.collection;
//     collection('Todos').insertOne({
//       text: 'Something to do',
//       completed : false  
//     },(err ,result)=>{
//         if(err){
//             return console.log('Unable to do insert todos', err);
//         }
//         console.log(JSON.stringify(result.ops, undefined , 2));
//     });


//     db.close();
// });

//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var obj1= new ObjectID();
console.log(obj1);
var users = { name: 'Manisha', age:22};
var {name}= users;
console.log(name);
var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url,(err, db)=>{
  if(err){
      return console.log('Unable to connect to the server');
  }
  console.log('Connectd to mongodb server');
//   var database= db.db("Todo");
//   var obj ={ text: 'Something to do',
//   completed : false};
//   database.collection('Todos').insertOne(obj, (err,result)=>{
//    if(err)
//    {
//        console.log("error in insertion");
//    }
//    console.log(JSON.stringify(result.ops, undefined , 2));
//    console.log("inserted successfully.");
//   });

//Inserting  into second  database

// var database = db.db("Users");
// var obj = {
    
//     name: 'Appu Kutty',
//     age: 22,
//     location: 'kotagiri'
// };
// database.collection('Users').insertOne(obj,(err,result)=>{
//    if(err){
//        return console.log('Unable to insert new doc',err);
//    }
//    console.log(result.ops[0]._id.getTimestamp());
// });



  db.close();
});