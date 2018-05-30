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
  text:"second todo",
  completed:true,
  completedAt: 333
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

});


describe('DELETE/todos/:id',()=>{
  it('should delete todo doc',(done)=>{
    //console.log(`/todos/${todos[0]._id.toHexString()}`);
    request(app)
    .delete(`/todos/${todos[1]._id.toHexString()}`)
    .expect(200)
    .expect((res)=>{
      expect(res.body.todo.text).toBe(todos[1].text);
    })
    .end((err,res)=>{
      if(err){
        return done(err);
      }

      todo.findById(todos[1]._id.toHexString()).then((result)=>{
        expect(result).toNotExist();
        done();
      }).catch((e)=>{
        done(e);
      })

      //done();
    });
  });

    it('should return 404 if todo not found',(done)=>{
      //console.log(`/todos/${todos[0]._id.toHexString()}`);
      request(app)
      .delete(`/todos/5b0d63cddcc2831981059aa3`)
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
      .delete(`/todos/123`)
      .expect(404)

      .end((err,res)=>{
        if(err){
          return done(err);
        }

        done();
      });
    });

  });


  describe('PATCH/todos/:id',()=>{

    it('should update todo doc',(done)=>{
      var text1=todos[1]._id.toHexString();
      var text='modified todo';
      var completed=true;
      //console.log(`/todos/${todos[0]._id.toHexString()}`);
      request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send({text})
      .send({completed})
      .expect(200)
      .expect((todo)=>{
        expect(todo.id).toBe(todos[1].id);
      })
      .end((err,res)=>{
        if(err){
          return done(err);
        }

        todo.findById(todos[1]._id.toHexString()).then((todo)=>{
          expect(todo.completed).toBe(true);
            expect(todo.completedAt).toBeA('number');
            expect(todo.text).toNotBe(text1);
          
          done();
        }).catch((e)=>{
          done(e);
        })

        //done();
      });
    });

      it('should clear completedAt when todo is not completed',(done)=>{
        var text1=todos[0]._id.toHexString();
        var text='modified todo next';
        //console.log(`/todos/${todos[0]._id.toHexString()}`);
        request(app)
        .patch(`/todos/${todos[0]._id.toHexString()}`)
        .send({text})
        .expect(200)
        .expect((todo)=>{
          expect(todo.id).toBe(todos[0].id);
        })
        .end((err,res)=>{
          if(err){
            return done(err);
          }

          todo.findById(todos[0]._id.toHexString()).then((todo)=>{
              expect(todo.completed).toBe(false);
              expect(todo.completedAt).toNotExist();

            done();
          }).catch((e)=>{
            done(e);
          })

          //done();
        });
      });


      // it('should return 404 for invalid ids',(done)=>{
      //   //console.log(`/todos/${todos[0]._id.toHexString()}`);
      //   request(app)
      //   .delete(`/todos/123`)
      //   .expect(404)
      //
      //   .end((err,res)=>{
      //     if(err){
      //       return done(err);
      //     }
      //
      //     done();
      //   });
      // });

    });
