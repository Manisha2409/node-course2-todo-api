const {ObjectID} = require('mongodb');

const {mongoose}= require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/Users');



// var id= '5a8cf9f0c12b701ecbd740cd1';

// if(!ObjectID.isValid(id)){
//     console.log('Id is not Valid');
// }

// Todo.find({
//     _id : id
// }).then((todos)=>{
//     console.log('Todos ',todos);
// });


// Todo.findOne({
//     _id : id
// }).then((todo)=>{
//     console.log('Todo ',todo);
// });

// Todo.findById(id).then((todos)=>{
//     if(!todos){
//         return console.log('Id Not Found');
//     }
//     console.log('Todo by Id: ',todos);
// }).catch((e)=>console.log(`Error: ${e}`));

var id='5a8d0da74ec2a2dbd9a5757d';  

if(!ObjectID.isValid(id)){
        console.log('Id is not Valid');
    }

    Users.findById(id).then((user)=>{
        if(!user){
            return console.log('User Not Found');
        }
        console.log('User by Id: ',user);
    },(e)=>{
        console.log(e);
    });