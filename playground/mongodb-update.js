
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url,(err, db)=>{
  if(err){
      return console.log('Unable to connect to the server');
  }
  console.log('Connectd to mongodb server');



//   var database = db.db('Todo');
//   database.collection('Todos').findOneAndUpdate({
//       _id: new ObjectID('5a85626641268eb1b4a9aece')
//   },{
//       $set:{
//           completed: true
//       }
//   },{
//       returnOriginal: false
//   }).then((result)=>{
//       console.log(result);
//   });

var database= db.db('Users');
database.collection('Users').findOneAndUpdate({
    _id: new ObjectID('5a8545132f72f33a1121d9c7')
},{
    $inc:{
        age:1
    },
    $set:{
        name: 'Appus'
    }
},{
    returnOriginal: true
}).then((err)=>{
    console.log(err);
});

//   db.close();
});
