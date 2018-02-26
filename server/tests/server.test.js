const expect = require('expect');
const request = require('supertest');

const {app}=require('./../server');
const {Todo}= require('./../models/todo');

const {Users}= require('./../models/Users');


const {ObjectID} = require('mongodb');

const {todos, populateTodos, users, populateUsers} = require('./seeds/seed');   

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post/ todos',()=>{
it('Should create a new todo',(done)=>{
  var text="Test todo text";

  request(app)
  .post('/todos')
  .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
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
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todos.length).toBe(1);
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

       });
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


  describe('GET /users/me',()=>{
      it('should return user if authenticated',(done)=>{
          request(app)
          .get('/users/me')
          .set('x-auth',users[0].tokens[0].token)
          .expect(200)
          .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
          })
          .end(done);
     
      });

      it('should return 401 if not authentocated',(done)=>{
          request(app)
            .get('/users/me')
            .expect(401)
            .expect((res)=>{
                expect(res.body).toEqual({});
            })
            .end(done);
      });
  });

  describe('POST /users/me',()=>{
    it('should create a user',(done)=>{
          var email = 'example@example.com';
          var password = 'pass123'

          request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res)=>{
              expect(res.header['x-auth']).toBeTruthy();
              expect(res.body._id).toBeTruthy();
              expect(res.body.email).toBe(email);
            })
            .end((err)=>{
              if(err){
                return done(err);  
              }

              Users.findOne({email}).then((user)=>{
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
              }).catch((e)=>done(e));

            });
    });

    it('should return validation error for invalid email',(done)=>{
         var email =' manishsa';
         var password = '1233446';
         request(app)
          .post('/users')
          .send({email, password})
          .expect(400)
          .end(done);
        
    });

    it('should not create users if email already in use',(done)=>{
          var email ='manisham@gmail.com';
          var password = '123password';
          request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done);
    });
  });


  describe('POST /users/login',()=>{
    it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123mnb!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        Users.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e)=>done(e));
      });
    });

    it('should reject with invalid login',(done)=>{

  
      request(app)
        .post('/users')
        .send({
          email: users[1].email,
           password: users[1].password + '1'
          })
        .expect(400)
        .expect((res) => {
          expect(res.headers['x-auth']).toBeFalsy();
         
        })
        .end((err,res) => {
          if (err) {
            return done(err);
          }
  
          Users.findById(users[1]._id).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
          }).catch((e)=>done(e));
        });
    });
  });


  describe('DELETE /users/me/tokens',()=>{
    it('should remove auth token to logout',(done)=>{
      request(app)
       .delete('/users/me/token')
       .set('x-auth',users[0].tokens[0].token)
       .expect(200)
    
       .end((err,res)=>{
          if(err){
            return done(err)
          }
          Users.findById(users[0]._id).then((user)=>{
            expect(user.tokens.length).toBe(0);
            done();            
          }).catch((e)=>{done(e)});
       });
    });
  });