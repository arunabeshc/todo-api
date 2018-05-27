const expect=require('expect');
const request=require('supertest');

const {app}=require('../server');
const {todo}=require('../models/todo');

var todos=[{
  text:"first todo"
},
{
  text:"second todo"
}];

beforeEach((done)=>{
  todo.remove({}).then(()=>{
    todo.insertMany(todos).then(()=>{
        done();
    });
    ;
  });
});

describe('POST /todos',()=>{
  it('should create a new todo',(done)=>{
    var text='test todo text';

    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((res)=>{
      expect(res.body.text).toBe(text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      todo.find({text}).then((todos)=>{
        expect(todos.length).toBe(1);
        expect (todos[0].text).toBe(text);
        done();
      }).catch((e)=>{
        done(e);
      });
    });
  });

  it('should not create todo with invalid data',(done)=>{
    var text='';

    request(app)
    .post('/todos')
    .send({text})
    .expect(400)
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      todo.find().then((todos)=>{
        expect(todos.length).toBe(2);
        done();
      }).catch((e)=>{
        done(e);
      });
    });
  });


  it('should fetch all todos',(done)=>{

    request(app)
    .get('/todos')
    .expect(200)
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      done();
    });
  });


});
