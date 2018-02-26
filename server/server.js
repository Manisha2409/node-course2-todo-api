require('./config/config.js');
const _= require('lodash');

const express=  require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose.js');
const {Todo} = require('./models/todo.js');
const {Users} = require('./models/Users.js');
const {authenticate} = require('./middleware/authenticate');
const {ObjectID} = require('mongodb');

const port = process.env.PORT;
var app=express();

app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
      var todo = new Todo({
          text : req.body.text
      });
      todo.save().then((doc)=>{
          res.send(doc);
      },(e)=>{
          res.status(400).send(e);
      });
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
       res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  })
});


app.get('/todos/:id',(req,res)=>{
  var id= req.params.id;
   if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
   }
   Todo.findById(id).then((todo)=>{
     if(!todo){
        return res.status(400).send('Can\'t find Todo');
     }
      res.send({todo});
     
   }).catch((e)=>{
      return res.status(404).send();
   });
});

app.delete('/todos/:id',(req,res)=>{
var id= req.params.id;
if(!ObjectID.isValid(id)){
    return res.status(404).send();
}
Todo.findByIdAndRemove(id).then((todo)=>{
  if(!todo){
      re.status(404).send();
  }
  res.status(200).send({todo});
}).catch((e)=>{
     return res.status(404).send();
});

});

app.patch('/todos/:id',(req,res)=>{
    var id=req.params.id;
    var body = _.pick(req.body,['text','completed']);

    if(!ObjectID.isValid(id)){
        return res.status(404).send('Invalid ID');
   }
   
   if(_.isBoolean(body.completed) && body.completed){
       body.completedAt = new Date().getTime();
   }
   else{
       body.completedAt =null;
       body.completed = false;
   }
  Todo.findByIdAndUpdate(id,{$set :body},{new: true}).then((todo)=>{
      if(!todo){
          return res.status(404).send();
      }
      res.send({todo});
  }).catch((e)=> {
      res.status(404).send();
  });
});

// POST METHOD


// POST /users
app.post('/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new Users(body);
  
    user.save().then(() => {
      return user.generateAuthToken();
    }).then((token) => {
      res.header('x-auth', token).send(user);
    }).catch((e) => {
      res.status(400).send(e);
    })
  });

  

app.get('/users/me', authenticate,(req,res)=>{
    res.send(req.user);
})


app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    Users.findByCredentials(body.email,body.password).then((user)=>{
           return user.generateAuthToken().then((token)=>{
                res.header('x-auth', token).send(user);
           });
    }).catch((e)=>{
        res.status(400).send();
    });
});

app.delete('/users/me/token',authenticate,(req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send()
    },()=>{
        res.status(400).send()
    });
});


app.listen(port,()=>{
    console.log(`Started lisening port ${port}`);
});


module.exports = {app};