import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';

import config from '../config';
import db from '../db/db';

let routes = {};

routes.verify = async (ctx, next) => {
  let { authorization, _id } = ctx.request.header;

  if (authorization) {
    let id = new ObjectId(_id);
    let token = authorization.split(' ')[1];

    try {
      jwt.verify(token, config.privateKey)
      await next()
    } catch (error) {
      ctx.message = "Error - cannot verify user data";
      console.log("Error - cannot verify user data");
    }
  } else {
    ctx.message = 'User does not have a token';
    console.log('User does not have a token');
  }
}

routes.signup = async (ctx) => {
  let request = JSON.parse(ctx.request.body)
  let user = {
    username: request.username,
    password: request.password
  }
  let token = jwt.sign(user, config.privateKey, { expiresIn: '10h' });

  let userData = await db.findOneUser({ username: request.username })

  // if user don't exist, create new user
  if (!userData) {
    let result = await db.addUser({
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

routes.signin = async (ctx) => {
  let request = JSON.parse(ctx.request.body)

  let user = await db.findOneUser({ username: request.username, password: request.password })

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

routes.listTodos = async (ctx) => {
  try {
    let response = await db.findAllTodos()
    ctx.body = JSON.stringify(response)
  } catch (error) {
    ctx.message = error;
    console.log(error);
  }  
}

routes.addTodo = async (ctx) => {
  try {
    let date = new Date().toLocaleDateString();

    let todo = await JSON.parse(ctx.request.body);
    let result;

    let todoFromDB = await db.findOneTodo({ body: todo.body })

    if (todoFromDB) {
      console.log('You have same todo')
      ctx.message = 'You have same todo';
    } else if (todo.body && todo.status) {
      todo.created = date;
      todo.modified = date;

      try {
        let insertOne = await db.addTodo(todo)
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

routes.updateTodo = async (ctx) => {
  try {
    let date = new Date().toLocaleDateString();
    let todo = JSON.parse(ctx.request.body);
    let id = new ObjectId(todo._id);

    ctx.body = await db.findAndUpdateTodo(id, {
      modified: date,
      body: todo.body,
      status: todo.status
    })

    if (!ctx.body) {
      ctx.message = 'error';
    }
  } catch (error) {
    ctx.message = e;
  }
}

routes.del = async (ctx) => {
  try {
    const id = new ObjectId(ctx.params.id);
    ctx.body = await db.deleteTodo(id)
    if (!ctx.body.result.ok) {
      ctx.message = e;
    }
  } catch (error) {
    ctx.message = e;
  }  
};

export default routes
