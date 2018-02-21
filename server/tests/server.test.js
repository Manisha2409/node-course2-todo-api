const expect = require('expect');
const request = require('supertest');

const {app}=require('./../server');
const {Todo}= require('./../models/todo');

const todos = [{
  text : 'First test todos'
},{
  text : 'Second test todos'
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









// const expect = require('expect');
// const request = require('supertest');

// const {app} = require('./../server');
// const {Todo} = require('./../models/todo');

// beforeEach((done) => {
//   Todo.remove({}).then(() => done());
// });

// describe('POST /todos', () => {
//   it('should create a new todo', (done) => {
//     var text = 'Test todo text';

//     request(app)
//       .post('/todos')
//       .send({text})
//       .expect((res) => {
//         expect(res.body.text).toBe(text);
//       })
//       .end((err, res) => {
//         if (err) {
//           return done(err);
//         }

//         Todo.find().then((todos) => {
//           expect(todos.length).toBe(1);
//           expect(todos[0].text).toBe(text);
//           done();
//         }).catch((e) => done(e));
//       });
//   });

//   // it('should not create todo with invalid body data', (done) => {
//   //   request(app)
//   //     .post('/todos')
//   //     .send({})
//   //     .expect(200)
//   //     .end((err, res) => {  
//   //       if (err) {
//   //         return done(err);
//   //       }

//   //       Todo.find().then((todos) => {
//   //         expect(todos.length).toBe(0);
//   //         done();
//   //       }).catch((e) => done(e));
//   //     });
//   // });
// });