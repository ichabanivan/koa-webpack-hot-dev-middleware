import ACTIONS from '../constants/';

import { push } from 'react-router-redux'

export const newText = (text) => ({
  type: ACTIONS.NEW_TEXT,
  text
});

export const shareTodo = (_id, shareUserID) => {
  return async (dispatch, getState) => {
    let state = getState();

    let todo = { 
      _id, 
      shareUserID 
    };

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
      console.error('/shareTodo - error')
      dispatch(push(`/app/${_id}/error`));
    }
  }
};


export const updateTodo = (todo, _id, shareUsername) => {
  _id
  return async (dispatch, getState) => {
    let state = getState();

    if (todo.body) {
      try {
        let response = await fetch('/app/updateTodo', {
          method: 'PUT',
          body: JSON.stringify(todo),
          headers: new Headers({
            'authorization': `Bearer ${state.user.authorization}`
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
          dispatch(push(`/app/${res.value._id}/error`));
        }
      } catch (error) {
        console.error('/updateTodo - error')
        dispatch(push(`/app/${res.value._id}/error`));
      }
    } else {
      dispatch(push(`/app/${res.value._id}/error`));
    }
  }
};

export function addNewTodo(text) {
  return async (dispatch, getState) => {

    let state = getState();
    let isUnic = true;

    // if empty
    if (!text) {
      dispatch(push(`app/0/error`));
      return false
    }

    state.todos.forEach((todo) => {
      if (todo.body === text) {
        isUnic = false
      }
    });

    let todo = { body: text, status: "new", canEdit: state.user.username, owner: state.user._id };

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
        dispatch(push(`/app/0/error`));
      }
    } else {
      dispatch(push(`/app/0/error`));
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
          'authorization': `Bearer ${state.user.authorization}`
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
        dispatch(push(`/app/${_id}/error`));
      }
    } catch (error) {
      dispatch(pushonClick(`/app/${_id}/error`));
    }
  };
}

export function initTodos() {
  return async (dispatch, getState) => {
    let state = getState();
    try {
      let response = await fetch('/app/listTodos', {
        method: 'GET',
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`
        })
      });

      let todos = await response.json()

      if (todos) {
        dispatch({
          type: ACTIONS.INIT_TODOS,
          todos
        })
      } else {
        dispatch(push(`/app/0/error`));
      }
      
    } catch (error) {
      console.error('/listTodos error')
      dispatch(push(`/app/0/error`));
    }
  }
}

export function accessEditing(access, _id) {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      let response = await fetch('/app/access', {
        method: 'POST',
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`
        }),
        body: JSON.stringify({
          _id,
          access
        })
      });

      let todo = await response.json()

      if (todo.ok) {
        dispatch({
          type: ACTIONS.UPDATE_TODO,
          todo: todo.value
        })
      } else {
        dispatch(push(`/app/${_id}/error`));
      }

    } catch (error) {
      console.error('/requestEditing error')
      dispatch(push(`/app/${_id}/error`));
    }
  }
}

export function editTodo(link, todo) {
  return async (dispatch, getState) => {
    let state = getState();
    let userId = state.user._id;

    console.log(todo.canEdit, userId)
    if (todo.canEdit === userId) {
      dispatch(push(link))
    } else {
      console.error('/requestEditing error')
      dispatch(push(`/app/${todo._id}/error`));
    }
  }
}