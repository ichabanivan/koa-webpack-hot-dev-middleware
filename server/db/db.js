const ObjectId = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');
const uuidV4 = require('uuid/v4');

let db = {};

db.signin = async (ctx) => {
  let request = JSON.parse(ctx.request.body)

  let user = await ctx.app.database.collection('users').findOne({ username: request.username, password: request.password })

  let tokenForUser = jwt.sign({
    username: user.username
  }, user.privateKey)

  ctx.body = JSON.stringify({
    _id: user._id,
    token: tokenForUser
  })
}

db.signup = async (ctx) => {
  let privateKey = uuidV4();
  let request = JSON.parse(ctx.request.body)

  let user = {
    username: request.username,
    password: request.password
  }

  let token = jwt.sign(user, privateKey, {});

  let isNull = await ctx.app.database.collection('users').findOne({ username: request.username })
  
  if (!isNull) {
    let result = await ctx.app.database.collection('users').insertOne({
      token,
      privateKey,
      username: request.username,
      password: request.password
    })

    let tokenForUser = jwt.sign({
      username: request.name
    }, privateKey)

    ctx.body = JSON.stringify({
      _id: result.ops[0]._id,
      token: tokenForUser
    })
  } else {
    ctx.message = 'error';
  }
}

db.listTodos = async (ctx) => {
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })

  await jwt.verify(token, user.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /listTodos';
    } else {
      try {
        let response = await ctx.app.database.collection('todos').find({}).toArray()
        ctx.body = JSON.stringify(response)
      } catch (error) {
        ctx.message = 'error /listTodos';
      }
    }
  });
}

db.addTodo = async (ctx) => {
  let { token, _id } = ctx.request.header;
  let id = new ObjectId(_id);

  let user = await ctx.app.database.collection('users').findOne({ _id: id })
  
  await jwt.verify(token, user.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /listTodos';
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

  await jwt.verify(token, user.privateKey, async (err, decoded) => {
    if (err) {
      ctx.message = 'error /listTodos';
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
  try {
    const id = new ObjectId(ctx.params.id);
    ctx.body = await ctx.app.database.collection('todos').deleteOne({ _id: id })

    if (!ctx.body.result.ok) {
      ctx.message = e;
    }
  } catch (error) {
    ctx.message = e;
  }
};

module.exports = db
