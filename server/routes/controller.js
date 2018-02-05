import { ObjectId } from 'mongodb';
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
  let request = JSON.parse(ctx.request.body)
  let password = Base64.encode(request.password)

  let userData = await db.findOneUser({ username: request.username })

  // if user don't exist, create new user
  if (!userData) {
    let result = await db.addUser({
      username: request.username,
      password
    })

    let token = jwt.sign({
      username: request.username,
      id: result._id
    }, config.privateKey)

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
  let request = JSON.parse(ctx.request.body)
  let password = Base64.encode(request.password)
  let user = await db.findOneUser({ username: request.username, password })

  if (user) {
    let tokenForUser = jwt.sign({
      username: user.username,
      _id: user._id,
    }, config.privateKey)

    ctx.body = JSON.stringify({
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
      "share": ctx.user.username
    })
    ctx.body = JSON.stringify(response)
  } catch (error) {
    ctx.message = error;
    console.log(error);
  }  
}

controller.addTodo = async (ctx) => {
  try {
    let date = new Date().toLocaleDateString();

    let body = await JSON.parse(ctx.request.body);

    body.share = [ctx.user.username]
    body.canEdit = ctx.user.username;

    let todoFromDB = await db.findOneTodo({ body: body.body })

    if (todoFromDB) {
      console.log('You have same todo')
      ctx.message = 'You have same todo';
    } else if (body.body && body.status) {
      body.created = date;
      body.modified = date;

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
    let date = new Date().toLocaleDateString();
    let todo = JSON.parse(ctx.request.body);
    let id = new ObjectId(todo._id);

    ctx.body = await db.findAndUpdateTodo(id, {
      $set: {
        modified: date,
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
    let req = JSON.parse(ctx.request.body);

    let id = new ObjectId(req._id);
    ctx.body = await db.share(id, req.username)
  } catch (error) {
    ctx.message = error;
  }
};

controller.access = async ctx => {
  try {
    let req = JSON.parse(ctx.request.body);

    let id = new ObjectId(req._id);

    if (req.access) {
      console.log(ctx.user.username)
      ctx.body = await db.findAndUpdateTodo(id, {
        $set: {
          canEdit: ctx.user.username,
          request: null
        }
      })
    } else {
      let todo = await db.findOneTodo({ _id: id})
      let owner = todo.owner;
      console.log(owner)

      ctx.body = await db.findAndUpdateTodo(id, {
        $set: {
          canEdit: owner,
          request: null
        },
        $pull: {
          share: ctx.user.username
        }
      })
    }

  } catch (error) {
    ctx.message = error;
  }
};

controller.del = async (ctx) => {
  try {
    const id = new ObjectId(ctx.params.id);
    ctx.body = await db.deleteTodo(id)
    if (!ctx.body.result.ok) {
      ctx.message = 'error del';
    }
  } catch (error) {
    console.log(error)
    ctx.message = error;
  }  
};

export default controller
