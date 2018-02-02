import ACTIONS from '../constants/';

import { push } from 'react-router-redux'

export const newText = (text) => ({
  type: ACTIONS.NEW_TEXT,
  text
});

export const shareTodo = (_id, shareUsername) => {
  return async (dispatch, getState) => {
    let state = getState();
    console.log("shareTodo");
    let todo = { _id, username: shareUsername, canEdit: '' };
    console.log(todo)
    try {
      let response = await fetch('/app/shareTodo', {
        method: 'PUT',
        body: JSON.stringify(todo),
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`,
          _id
        })
      })

      let res = await response.json();

      console.log(res)

      if (response.ok) {
        // dispatch({
        //   type: ACTIONS.UPDATE_TODO,
        //   todo: res.value
        // });
        // dispatch(push(`/app/`))
      } else {
        dispatch(push(`/app/${_id}/error`));
      }
    } catch (error) {
      console.error('/shareTodo - error')
      dispatch(push(`/app/${_id}/error`));
    }
  }
};


export const updateTodo = (todo, _id, shareUsername) => {
  return async (dispatch, getState) => {
    let state = getState();
    todo.share.push(shareUsername) // ?
    console.log(todo)
    if (todo.body) {
      try {
        let response = await fetch('/app/updateTodo', {
          method: 'PUT',
          body: JSON.stringify(todo),
          headers: new Headers({
            'authorization': `Bearer ${state.user.authorization}`,
            '_id': state.user._id // -
          })
        })

        let res = await response.json();

        if (response.ok) {
          dispatch({
            type: ACTIONS.UPDATE_TODO,
            todo: res.value
          });
          dispatch(push(`/app/`))
        } else {
          dispatch(push(`/app/${_id}/error`));
        }
      } catch (error) {
        console.error('/updateTodo - error')
        dispatch(push(`/app/${_id}/error`));
      }
    } else {
      dispatch(push(`/app/${_id}/error`));
    }
  }
};

export function addNewTodo(text) {
  return async (dispatch, getState) => {

    let state = getState();
    let isUnic = true,
      id = Math.floor(Math.random() * 10000).toString();

    // if empty
    if (!text) {
      dispatch(push(`app/${ id }/error`));
      return false
    }

    state.todos.forEach((todo) => {
      if (todo.body === text) {
        isUnic = false
      }
    });

    let todo = { body: text, status: "new", canEdit: state.user.username, owner: state.user.username };

    if (isUnic) {
      try {
        let response = await fetch('/app/addTodo', {
          method: 'POST',
          body: JSON.stringify(todo),
          headers: new Headers({
            'authorization': `Bearer ${state.user.authorization}`
          })
        })
        let res = await response.json()
        dispatch({
          type: ACTIONS.ADD_TODO,
          todo: res
        });
        dispatch({
          type: ACTIONS.RESET_TEXT
        })
      } catch (error) {
        console.error('/addTodo - error')
        dispatch(push(`app/${id}/error`));
      }
    } else {
      dispatch(push(`app/${id}/error`));
    }
  };
}

export function actionRemoveTodo(_id) {
  return async (dispatch, getState) => {
    let state = getState();
    try {
      let response = await fetch(`/app/${_id}`, {
        method: 'DELETE',
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`,
          '_id': state.user._id
        })
      })
      let res = await response.json()

      if (res.ok) {
        dispatch({
          type: ACTIONS.REMOVE_TODO,
          _id
        });
        dispatch({
          type: ACTIONS.RESET_TEXT
        });
        dispatch(push('/app/'));
      } else {
        dispatch(push(`/app/${_id}/error`));
      }
    } catch (error) {
      console.error('Response was not received')
      dispatch(push(`/app/${_id}/error`));
    }
  }
}

export function actionChangeStatus(_id, status) {
  return async (dispatch, getState) => {
    let state = getState();
    let todo = state.todos.filter((todo) => _id === todo._id)[0];
    todo.status = status;

    try {
      let response = await fetch('/app/updateTodo', {
        method: 'PUT',
        body: JSON.stringify(todo),
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`
        })
      })

      let res = await response.json()

      if (res.ok) {
        dispatch({
          type: ACTIONS.UPDATE_TODO,
          todo: res.value
        });
      } else {
        dispatch(push(`app/${_id}/error`));
      }
    } catch (error) {
      dispatch(push(`app/${_id}/error`));
    }
  };
}

export function initTodos() {
  return async (dispatch, getState) => {
    let state = getState();
    let id = Math.floor(Math.random() * 10000);
    try {
      let response = await fetch('/app/listTodos', {
        method: 'GET',
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`,
          '_id': state.user._id
        })
      });

      let todos = await response.json()

      if (todos) {
        dispatch({
          type: ACTIONS.INIT_TODOS,
          todos
        })
      } else {
        dispatch(push(`app/${id}/error`));
      }
      
    } catch (error) {
      console.error('/listTodos error')
      dispatch(push(`app/${id}/error`));
    }
  }
}
