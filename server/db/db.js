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
      token: tokenForUser
    })

    console.log(ctx.body);
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
      token: tokenForUser
    })
  } else {
    ctx.message = 'error /signin';
  }
}

db.listTodos = async (ctx) => {
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })
  await jwt.verify(token, config.privateKey, async (err) => {
    if (err) {
      ctx.message = "Error(listTodos) - can’t verify user data";
      console.log("Error(listTodos) - can’t verify user data");
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
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /addTodo';
    } else {
      try {
        let date = new Date().toLocaleDateString();

        let todo = await JSON.parse(ctx.request.body);
        let result;

        if (todo.body && todo.status) {
          todo.created = date;
          todo.modified = date;

          let insertOne = await ctx.app.database.collection('todos').insertOne(todo)
          result = insertOne.ops[0]
        } else {
          ctx.message = 'error';
        }

        if (result.body && result.status) {
          ctx.body = result
        } else {
          ctx.message = 'error';
        }
      } catch (error) {
        ctx.message = error;
      }
    }
  })
}

db.updateTodo = async (ctx) => {
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /updateTodo';
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
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, config.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /del';
    } else {
      try {
        const id = new ObjectId(ctx.params.id);
        ctx.body = await ctx.app.database.collection('todos').deleteOne({ _id: id })
        console.log(id, ctx.body);
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
