let db = {};

db.findOneUser = async (ctx, user) => {
  return await ctx.app.database.collection('users').findOne(user)
}

db.addUser = async (ctx, user) => {
  return await ctx.app.database.collection('users').insertOne(user)
}

db.findAllTodos = async (ctx) => {
  return await ctx.app.database.collection('todos').find({}).toArray()
}

db.findOneTodo = async (ctx, todo) => {
  return await ctx.app.database.collection('todos').findOne(todo)
}

db.addTodo = async (ctx, todo) => {
  return await ctx.app.database.collection('todos').insertOne(todo)
}

db.findAndUpdateTodo = async (ctx, id, todo) => {
  return await ctx.app.database.collection('todos').findOneAndUpdate({ _id: id }, {
    $set: todo
  }, {
    returnOriginal: false
  })
}

db.deleteTodo = async (ctx, id) => {
  return await ctx.app.database.collection('todos').deleteOne({ _id: id })
}

module.exports = db
