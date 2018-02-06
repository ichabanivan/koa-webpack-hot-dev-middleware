import ACTIONS from '../constants/';

import { push } from 'react-router-redux'
import { showModalError } from './modal'

import api from './fetch';

export const newText = (text) => ({
  type: ACTIONS.NEW_TEXT,
  text
});

export const shareTodo = (_id, shareUserId) => {
  return async (dispatch, getState) => {
    let state = getState();

    let todo = { 
      _id, 
      shareUserId
    };

    try {
      let res = await api({
        url: '/app/shareTodo',
        method: 'PUT',
        body: todo,
        _id
      }, state)

      if (res.ok) {
        dispatch({
          type: ACTIONS.UPDATE_TODO,
          todo: res.value
        });
        dispatch(push(`/app/`))
      } else {
        dispatch(showModalError(`response ok not true`, _id));
      }
    } catch (error) {
      console.error('/shareTodo - error')
      dispatch(showModalError(error, _id));
    }
  }
};


export const updateTodo = (todo, _id, shareUsername) => {
  return async (dispatch, getState) => {
    let state = getState();

    if (todo.body) {
      try {
        let res = await api({
          url: '/app/updateTodo',
          method: 'PUT',
          body: todo,
          _id
        }, state) 

        if (res.ok) {
          dispatch({
            type: ACTIONS.UPDATE_TODO,
            todo: res.value
          });
          dispatch(push(`/app/`))
        } else {
          dispatch(showModalError(`response ok not true`, res.value._id));
        }
      } catch (error) {
        console.error('/updateTodo - error')
        dispatch(showModalError(error, res.value._id));
      }
    } else {
      dispatch(showModalError(`todo body is empty`, res.value._id));
    }
  }
};

export function addNewTodo(text) {
  return async (dispatch, getState) => {

    let state = getState();
    let isUnic = true;

    // if empty
    if (!text) {
      dispatch(showModalError(`text is empty`, 0));
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
        let res = await api({
          url: '/app/addTodo',
          method: 'POST',
          body: todo
        }, state) 

        dispatch({
          type: ACTIONS.ADD_TODO,
          todo: res
        });
        dispatch({
          type: ACTIONS.RESET_TEXT
        })
      } catch (error) {
        console.error('/addTodo - error')
        dispatch(showModalError(error, 0));
      }
    } else {
      dispatch(showModalError(`Not unic value`, 0));
    }
  };
}

export function actionRemoveTodo(_id) {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      let res = await api({
        url: `/app/${_id}`,
        method: 'DELETE',
        _id
      }, state) 

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
        dispatch(showModalError(`response ok - not true`, _id));
      }
    } catch (error) {
      console.error(error)
      dispatch(showModalError(error, _id));
    }
  }
}

export function actionChangeStatus(_id, status) {
  return async (dispatch, getState) => {
    let state = getState();
    let todo = state.todos.filter((todo) => _id === todo._id)[0];
    todo.status = status;

    try {
      let res = await api({
        url: '/app/updateTodo',
        method: 'PUT',
        body: todo,
        _id
      }, state) 

      if (res.ok) {
        dispatch({
          type: ACTIONS.UPDATE_TODO,
          todo: res.value
        });
      } else {
        dispatch(showModalError('response ok not true', _id));
      }
    } catch (error) {
      dispatch(showModalError(error, _id));
    }
  };
}

export function initTodos() {
  return async (dispatch, getState) => {
    let state = getState();
    try {
      let todos = await api({
        url: '/app/listTodos',
        method: 'GET'
      }, state) 

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
      dispatch(showModalError(error, 0));
    }
  }
}

export function accessEditing(access, _id) {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      let todo = await api({
        url: '/app/access',
        method: 'POST',
        body: {
          _id,
          access
        },
        _id
      }, state) 

      if (todo.ok) {
        dispatch({
          type: ACTIONS.UPDATE_TODO,
          todo: todo.value
        })
      } else {
        dispatch(push(`/app/${_id}/error`));
        dispatch(showModalError(`/app/${_id}/error`, _id));
      }

    } catch (error) {
      console.error('/requestEditing error')
      dispatch(showModalError(error, _id));
    }
  }
}

export function editTodo(link, todo) {
  return async (dispatch, getState) => {
    let state = getState();
    let userId = state.user._id;

    if (todo.canEdit === userId) {
      dispatch(push(link))
    } else {
      console.error('/requestEditing error')
      dispatch(showModalError('You cannot edit',todo._id));
    }
  }
}