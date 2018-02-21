const {ObjectID} = require('mongodb');

const {mongoose}= require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {Users} = require('./../server/models/Users');

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

Todo.findOneAndREmove({_id:'5a8d53834ec2a2dbd9a58cc4'}).then(()=>{
      console.log(e);
});

Todo.findByIdAndRemove('5a8d53834ec2a2dbd9a58cc4').then((todo)=>{
   console.log(todo);
},(e)=>{
    console.log(e);
});
