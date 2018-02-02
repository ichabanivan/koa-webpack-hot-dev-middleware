import { MongoClient } from 'mongodb';
import config from '../config';

let database = {};

MongoClient.connect(config.url, function (err, client) {
  database.mongo = client.db('todos')
})

database.findOneUser = async (user) => {
  return await database.mongo.collection('users').findOne(user)
}

database.addUser = async (user) => {
  return await database.mongo.collection('users').insertOne(user)
}

database.findAllTodos = async (req) => {
  return await database.mongo.collection('todos').find(req).toArray()
}

database.findOneTodo = async (todo) => {
  return await database.mongo.collection('todos').findOne(todo)
}

database.addTodo = async (todo) => {
  return await database.mongo.collection('todos').insertOne(todo)
}

database.findAndUpdateTodo = async (id, todo) => {
  return await database.mongo.collection('todos').findOneAndUpdate({ _id: id }, {
    $set: todo
  }, {
    returnOriginal: false
  })
}

database.deleteTodo = async (id) => {
  return await database.mongo.collection('todos').deleteOne({ _id: id })
}

database.share = async (obj) => {
  return await database.mongo.updateOne(obj)
}

export default database;