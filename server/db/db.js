const ObjectId = require('mongodb').ObjectID;

let db = {};

db.listTodos = async (ctx) => {
  try {
    ctx.body = await ctx.app.database.collection('todos').find().toArray()
    ctx.status = 200;
  } catch (e) {
    ctx.message = e;
  }
}

db.addTodo = async (ctx) => {
  try {
    let date = new Date().toLocaleDateString();

    let todo = JSON.parse(ctx.request.body);
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
  } catch (e) {
    ctx.message = e;
  }
}

db.updateTodo = async (ctx) => {
  try {
    let date = new Date().toLocaleDateString();
    let todo = JSON.parse(ctx.request.body);
    let id = new ObjectId(todo._id);

    ctx.body = await ctx.app.database.collection('todos')
      .findOneAndUpdate({ _id: id }, {
        $set: {
          modified: date,
          body: todo.body,
          status: todo.status
        }
      }, {
        returnOriginal: false
      })
  } catch (error) {
    ctx.message = e;
  }
}

db.del = async (ctx) => {
  try {
    const id = new ObjectId(ctx.params.id);
    ctx.body = await ctx.app.database.collection('todos').deleteOne({ _id: id })
  } catch (error) {
    ctx.message = e;
  }
};

module.exports = db
