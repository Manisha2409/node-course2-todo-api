
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url,(err, db)=>{
  if(err){
      return console.log('Unable to connect to the server');
  }
  console.log('Connectd to mongodb server');
  var database = db.db('Users');



//   database.collection('Todos').find({ 
//      _id: new ObjectID('5a85626641268eb1b4a9aece')
//     // completed: false
//     }).toArray().then((docs)=>{
//       console.log('Toods');
//       console.log(JSON.stringify(docs, undefined ,2));
//   },(err)=>{
//       console.log('Unabble to find documents', err);
//   });


//   database.collection('Todos').find().count().then((count)=>{
//       console.log(`Toods ${count}`);
//      },(err)=>{
//       console.log('Unabble to find documents', err);
//   });

  database.collection('Users').find({name:'Appu'}).toArray().then((docs)=>{
      console.log(JSON.stringify(docs,undefined,2));
     },(err)=>{
      console.log('Unabble to find documents', err);
  });


//   db.close();
});