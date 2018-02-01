const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const config = require('../config')

let db = {};

db.signup = async (ctx) => {
  let request = JSON.parse(ctx.request.body)
  let user = {
    username: request.username,
    password: request.password
  }
  let token = jwt.sign(user, config.privateKey, {});

  let userData = await ctx.app.database.collection('users').findOne({ username: request.username })

  // if user don't exist, create new user
  if (!userData) {
    let result = await ctx.app.database.collection('users').insertOne({
      username: request.username,
      password: request.password
    })

    let tokenForUser = jwt.sign({
      username: request.name
    }, config.privateKey)

    ctx.body = JSON.stringify({
      _id: result.ops[0]._id,
      username: result.ops[0].username,
      authorization: tokenForUser
    })
  } else {
    ctx.message = 'User exist';
  }
}

db.signin = async (ctx) => {
  let request = JSON.parse(ctx.request.body)

  let user = await ctx.app.database.collection('users').findOne({ username: request.username, password: request.password })

  if (user) {
    let tokenForUser = jwt.sign({
      username: user.username
    }, config.privateKey)

    ctx.body = JSON.stringify({
      _id: user._id,
      username: user.username,
      authorization: tokenForUser
    })
  } else {
    ctx.message = 'error /signin';
  }
}

db.listTodos = async (ctx) => {
  let { authorization, _id } = ctx.request.header;
  let id = new ObjectId(_id);
  let token = authorization.split(' ')[1];

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err) => {
    if (err) {
      ctx.message = "Error(listTodos) - cannot verify user data";
      console.log("Error(listTodos) - cannot verify user data");
    } else {
      try {
        let response = await ctx.app.database.collection('todos').find({}).toArray()
        ctx.body = JSON.stringify(response)
      } catch (error) {
        ctx.message = error;
      }
    }
  });
}

db.addTodo = async (ctx) => {
  let { authorization, _id } = ctx.request.header;
  let id = new ObjectId(_id);
  let token = authorization.split(' ')[1];

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err) => {
    if (err) {
      ctx.message = 'Error(addTodo) - cannot verify user data';
    } else {
      try {
        let date = new Date().toLocaleDateString();

        let todo = await JSON.parse(ctx.request.body);
        let result;

        let todoFromDB = await ctx.app.database.collection('todos').findOne({ body: todo.body })

        if (todoFromDB) {
          console.log('You have same todo')
          ctx.message = 'You have same todo';
        } else if (todo.body && todo.status) {
          todo.created = date;
          todo.modified = date;

          try {
            let insertOne = await ctx.app.database.collection('todos').insertOne(todo)
            result = insertOne.ops[0]
            ctx.body = result            
          } catch (error) {
            console.log(error);
          }

        } else {
          ctx.message = 'Body or status is empty in request';
        }
      } catch (error) {
        ctx.message = error;
      }
    }
  })
}

db.updateTodo = async (ctx) => {
  let { authorization, _id } = ctx.request.header;
  let id = new ObjectId(_id);
  let token = authorization.split(' ')[1];

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err) => {
    if (err) {
      ctx.message = 'Error(updateTodo) - cannot verify user data';
    } else {
      try {
        let date = new Date().toLocaleDateString();
        let todo = JSON.parse(ctx.request.body);
        let id = new ObjectId(todo._id);

        ctx.body = await ctx.app.database.collection('todos').findOneAndUpdate({ _id: id }, {
          $set: {
            modified: date,
            body: todo.body,
            status: todo.status
          }
        }, {
            returnOriginal: false
          })

        if (!ctx.body) {
          ctx.message = 'error';
        }
      } catch (error) {
        ctx.message = e;
      }
    }
  })
}

db.del = async (ctx) => {
  let { authorization, _id } = ctx.request.header;
  let id = new ObjectId(_id);
  let token = authorization.split(' ')[1];

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err) => {
    if (err) {
      ctx.message = 'Error(del) - cannot verify user data';
    } else {
      try {
        const id = new ObjectId(ctx.params.id);
        ctx.body = await ctx.app.database.collection('todos').deleteOne({ _id: id })
        if (!ctx.body.result.ok) {
          ctx.message = e;
        }
      } catch (error) {
        ctx.message = e;
      }
    }
  })
};

module.exports = db
