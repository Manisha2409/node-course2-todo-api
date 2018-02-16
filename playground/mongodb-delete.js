
//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

var url = 'mongodb://localhost:27017/TodoApp';

MongoClient.connect(url,(err, db)=>{
  if(err){
      return console.log('Unable to connect to the server');
  }
  console.log('Connectd to mongodb server');
  var database = db.db('Users');

//deleteMany -deleting many documents at a time

//   database.collection('Todos').deleteMany({text: 'Lunch'}).then((docs)=>{
//       console.log(docs);
//      },(err)=>{
//       console.log('Unabble to find documents', err);
//   });

//deleteOne

// database.collection('Todos').deleteOne({text:'Lunch'}).then((docs)=>{
//     console.log(docs);
// });

//findOneAndDelete

// database.collection('Todos').findOneAndDelete({completed: false}).then((result)=>{
//     console.log(result);
// });

            // Users database

//deleteMany
database.collection('Users').deleteMany({name: 'Appu Kutty'}).then((result)=>{
    console.log(result);
});


//findOneAndDelete

database.collection('Users').findOneAndDelete({
    _id: new ObjectID('5a8545c4db39143a5c1849e5')
}).then((result)=>{
    console.log(result);
});


//   db.close();
});