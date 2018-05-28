const expect=require('expect');
const request=require('supertest');

const{ObjectID}=require('mongodb');

const {app}=require('../server');
const {todo}=require('../models/todo');

var todos=[{
  _id:new ObjectID(),
  text:"first todo"
},
{
  _id:new ObjectID(),
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


describe('GET/todos/:id',()=>{
  it('should return todo doc',(done)=>{
    //console.log(`/todos/${todos[0]._id.toHexString()}`);
    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      done();
    });
  });

  it('should return 404 if todo not found',(done)=>{
    //console.log(`/todos/${todos[0]._id.toHexString()}`);
    request(app)
    .get(`/todos/5b0ba50c50ade813efe39f50`)
    .expect(404)

    .end((err,res)=>{
      if(err){
        return done(err);
      }

      done();
    });
  });

  it('should return 404 for invalid ids',(done)=>{
    //console.log(`/todos/${todos[0]._id.toHexString()}`);
    request(app)
    .get(`/todos/123`)
    .expect(404)

    .end((err,res)=>{
      if(err){
        return done(err);
      }

      done();
    });
  });

})
