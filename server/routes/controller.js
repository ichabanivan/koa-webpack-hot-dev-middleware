import jwt from 'jsonwebtoken';
import { Base64 } from 'js-base64';

import config from '../config';
import db from '../db/db';

let controller = {};

controller.verify = async (ctx, next) => {
  let { authorization } = ctx.request.header;

  if (authorization) {
    let token = authorization.split(' ')[1];
    try {
      ctx.user = jwt.verify(token, config.privateKey)
      await next()
    } catch (error) {
      console.log(error)
      ctx.message = "Error - cannot verify user data";
      console.log("Error - cannot verify user data");
    }
  } else {
    ctx.message = 'User does not have a token';
    console.log('User does not have a token');
  }
}

controller.signup = async (ctx) => {
  let request = ctx.request.body
  let password = Base64.encode(request.password)

  let userData = await db.findOneUser({ username: request.username })

  // if user doesn't exist, create new user
  if (!userData) {
    let result = await db.addUser({
      username: request.username,
      password
    })

    let token = jwt.sign({
      username: result.ops[0].username,
      _id: result.ops[0]._id,
    }, config.privateKey/*, { expiresIn: '1h' }*/)

    ctx.body = JSON.stringify({
      _id: result.ops[0]._id,
      username: result.ops[0].username,
      authorization: token
    })
  } else {
    ctx.message = 'User exist';
  }
}

controller.signin = async (ctx) => {
  let request = ctx.request.body
  let password = Base64.encode(request.password)
  let user = await db.findOneUser({ username: request.username, password })

  if (user) {
    let tokenForUser = jwt.sign({
      username: user.username,
      _id: user._id,
    }, config.privateKey/*, { expiresIn: '1h' }*/)

    ctx.body = JSON.stringify({
      _id: user._id,
      username: user.username,
      authorization: tokenForUser
    })
  } else {
    ctx.message = 'error /signin';
  }
}

controller.listTodos = async (ctx) => {
  try {
    let response = await db.findAllTodos({
      "share": ctx.user._id
    })
    ctx.body = JSON.stringify(response)
  } catch (error) {
    ctx.message = error;
    console.log(error);
  }  
}

controller.addTodo = async (ctx) => {
  try {
    let body = ctx.request.body;
    let user = ctx.user;

    body.share = [user._id]
    body.canEdit = user._id;
    body.request = '';

    let todoFromDB = await db.findOneTodo({ 
      body: body.body,
      share: user._id
    })

    if (todoFromDB) {
      let body = ctx.request.body;
      let userId = ctx.user._id;
      console.log('You have same todo')
      ctx.message = 'You have same todo';
    } else if (body.body && body.status) {
      body.created = new Date();
      body.modified = new Date();

      try {
        let todo = await db.addTodo(body)
        ctx.body = todo.ops[0]
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

controller.updateTodo = async (ctx) => {
  try {
    let userId = ctx.user._id;
    let todo = ctx.request.body;

    ctx.body = await db.findAndUpdateTodo(todo._id, {
      $set: { 
        modified: new Date(),
        body: todo.body,
        status: todo.status
      }
    })

    if (!ctx.body) {
      ctx.message = 'error';
    }
  } catch (error) {
    ctx.message = e;
  }
}

controller.shareTodo = async ctx => {
  try {
    let req = ctx.request.body;

    ctx.body = await db.share(req._id, req.shareUserId)
  } catch (error) {
    ctx.message = error;
  }
};

controller.access = async ctx => {
  try {
    let req = ctx.request.body;

    let userId = ctx.user._id;

    if (req.access) {
      ctx.body = await db.findAndUpdateTodo(req._id, {
        $set: {
          canEdit: ctx.user._id,
          request: ''
        }
      })
    } else {
      let todo = await db.findOneTodoById(req._id)
      let owner = todo.owner;

      ctx.body = await db.findAndUpdateTodo(req._id, {
        $set: {
          canEdit: owner, // id owner
          request: ''
        },
        $pull: {
          share: userId === owner ? '' : userId
        }
      })
    }

  } catch (error) {
    ctx.message = error;
  }
};

controller.del = async (ctx) => {
  try {
    ctx.body = await db.deleteTodo(ctx.params.id)
    if (!ctx.body.result.ok) {
      ctx.message = 'error del';
    }
  } catch (error) {
    console.log(error)
    ctx.message = error;
  }
};


controller.findAllUsers = async (ctx) => {
  try {
    let response = await db.findAllUsers()
    ctx.body = JSON.stringify(response)
  } catch (error) {
    ctx.message = error;
    console.log(error);
  }
}

controller.findOneUserById = async (ctx) => {
  let body = ctx.request.body;
  let userId = body._id;
  try {
    let response = await db.findOneUser()
    ctx.body = JSON.stringify(response)
  } catch (error) {
    ctx.message = error;
    console.log(error);
  }
}

export default controller
