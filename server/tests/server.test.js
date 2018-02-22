const expect = require('expect');
const request = require('supertest');

const {app}=require('./../server');
const {Todo}= require('./../models/todo');

const {ObjectID} = require('mongodb');

const todos = [{
  _id: new ObjectID(),
  text : 'First test todos'
},{
  _id: new ObjectID(),
  text : 'Second test todos',
  completed: true,
  completedAt: 253455
}]

beforeEach((done)=>{
    Todo.remove({}).then(()=> {
      return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('Post/ todos',()=>{
it('Should create a new todo',(done)=>{
  var text="Test todo text";

  request(app)
  .post('/todos')
  .send({text})
  .expect(200)
  .expect((res)=>{
      expect(res.body.text).toBe(text);
  })
  .end((err,res)=>{
        if(err){
          return done(err)  ;
        }
           
    Todo.find({text}).then((todo)=>{
        expect(todo.length).toBe(1);
        expect(todo[0].text).toBe(text);
        done();
    }).catch((e) => done(e));
  });
});

it('Should not create new todo with invalid data',(done)=>{
  
    request(app)
    .post('/todos')
    .send({})
    .expect(400)
    
    .end((err,res)=>{
          if(err){
            return done(err)  ;
          }
            Todo.find().then((todo)=>{
          expect(todo.length).toBe(2);
             done();  
      }).catch((e) => done(e));
    });
  });  
});


describe('GET /todos',()=>{
 it('Should get all todos',(done)=>{
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
 });
});

describe('GET/ todos/:id',()=>{
  it('Should return todo Document',(done)=>{
      request(app)
         .get(`/todos/${todos[0]._id.toHexString()}`)
         .expect(200)
         .expect((res)=>{
           expect(res.body.todo.text).toBe(todos[0].text)
         })
         .end(done);
  });

  it('Should return 404 if todo not found',(done)=>{
    var hexId= new ObjectID().toHexString;  
    request(app)
        .get(`/todos/${hexId}`)
        .expect(404)
        .end(done);
  });

  it('Should return 404 for non-object ids',(done)=>{
    request(app)
      .get(`/todos/1232343`)
        .expect(404)
        .end(done);
  })
});

describe('DELETE /todos/:id',(todo)=>{
  it('Should remove the todo',(done)=>{
     var hexId = todos[1]._id.toHexString();

     request(app)
       .delete(`/todos/${hexId}`)
       .expect(200)
       .expect((res)=>{
         expect(res.body.todo._id).toBe(hexId)
       })
       .end((err,res)=>{
         if(err){
         return done(err);
         }
         else if(res){
            Todo.findById(hexId).then((todo)=>{
               expect(todo).toBeFalsy();
               done();
            }).catch((e)=> done(e));
          }

       })
  });
  it('Should return 404 if todo not found',(done)=>{
    var hexId= new ObjectID().toHexString;  
    request(app)
        .delete(`/todos/${hexId}`)
        .expect(404)
        .end(done);
  });
  it('Should return 404 if object id is invalid',(done)=>{
    request(app)
    .delete(`/todos/1232343`)
      .expect(404)
      .end(done);
});
  });
  

  describe('PATCH /todos:id',()=>{
      it('should update the todo',(done)=>{
          var id=todos[0]._id.toHexString();
          var text = 'This is my new text';
          request(app)
            .patch(`/todos/${id}`)
            .send({
              completed: true,
              text
            })
            .expect(200)
            .expect((res)=>{
              expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(true);
              // expect(res.body.todo.completedAt).toBeAn('number')
            })
            .end(done)
      }); 
      
      it('Should clear completedAt when completed is false',(done)=>{
          var id= todos[1]._id.toHexString();
          var text = 'This is my second newly updated text';
          request(app)
            .patch(`/todos/${id}`)
            .send({
              completed:false,
              text
            })
            .expect(200)
            .expect((res)=>{
                expect(res.body.todo.text).toBe(text);
              expect(res.body.todo.completed).toBe(false);
              expect(res.body.todo.completedAt).toBeFalsy();
                
                // expect(res.body.toto.completed)toBe(false);
            })
            .end(done)
      });


  });



