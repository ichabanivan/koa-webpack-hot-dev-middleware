import { MongoClient } from 'mongodb';
import { ObjectId } from 'mongodb';
import config from '../config';
import connect from './connect'

let database = {};

database.connect = async function mongo() {
  database.mongo = await connect()
}

database.findOneUser = async (user) => {
  return await database.mongo.collection('users').findOne(user)
}

database.addUser = async (user) => {
  return await database.mongo.collection('users').insertOne(user)
}

database.findAllTodos = async (req) => {
  return await database.mongo.collection('todos').find(req).sort({created: -1}).toArray()
}

database.findOneTodoById = async (_id) => {
  const id = new ObjectId(_id);
  return await database.mongo.collection('todos').findOne({
    _id: id
  })
}

database.findOneTodo = async (todo) => {
  const id = new ObjectId(todo.share);
  return await database.mongo.collection('todos').findOne({
    body: todo.body,
    share: id
  })
}

database.addTodo = async (todo) => {
  return await database.mongo.collection('todos').insertOne(todo)
}

database.findAndUpdateTodo = async (_id, todo) => {
  const id = new ObjectId(_id);
  return await database.mongo.collection('todos').findOneAndUpdate({ _id: id }, todo, {
    returnOriginal: false
  })
}

database.deleteTodo = async (_id) => {
  const id = new ObjectId(_id);
  return await database.mongo.collection('todos').deleteOne({ _id: id })
}

database.share = async (_id, userId) => {
  const id = new ObjectId(_id);
  return await database.mongo.collection("todos").findOneAndUpdate({ _id: id }, {
    $set: {
      request: userId,
      canEdit: "",
      share: userId,
    }
  }, {
    returnOriginal: false
  });
};

database.findAllUsers = async () => {
  return await database.mongo.collection('users').find().toArray()
}

database.findOneUserById = async (id) => {
  const userId = new ObjectId(id);

  return await database.mongo.collection('users').find({
    _id: userId
  })
}

export default database;