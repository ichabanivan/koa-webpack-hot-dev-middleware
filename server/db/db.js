import { MongoClient } from 'mongodb';
import config from '../config';

let database = {};

MongoClient.connect(config.url, function (err, db) {
  database = db.db('todos')
})

database.findOneUser = async (ctx, user) => {
  return await database.collection('users').findOne(user)
}

database.addUser = async (ctx, user) => {
  return await database.collection('users').insertOne(user)
}

database.findAllTodos = async (ctx) => {
  return await database.collection('todos').find({}).toArray()
}

database.findOneTodo = async (ctx, todo) => {
  return await database.collection('todos').findOne(todo)
}

database.addTodo = async (ctx, todo) => {
  return await database.collection('todos').insertOne(todo)
}

database.findAndUpdateTodo = async (ctx, id, todo) => {
  return await database.collection('todos').findOneAndUpdate({ _id: id }, {
    $set: todo
  }, {
    returnOriginal: false
  })
}

database.deleteTodo = async (ctx, id) => {
  return await database.collection('todos').deleteOne({ _id: id })
}

export default database;