import ACTIONS from '../constants/';

import { push, goBack } from 'react-router-redux';

import {
  actionRemoveTodo,
  actionChangeStatus,
  updateTodo,
  shareTodo
} from "./todo";
import { get } from 'http';

export const showModal = (type) => {
  console.log('showModal')
  return {
    type: type,
    payload: {
      isVisible: true
    }
  }
};

export const showModalError = (error, id) => {
  console.log('modal error')
  return (dispatch) => {
    dispatch(push(`/app/${id}/error`))
    dispatch({
      type: ACTIONS.MODAL_ERROR,
      payload: {
        isVisible: true,
        error
      }
    })
  }
};

export const hideModals = () => {
  return {
    type: ACTIONS.HIDE_MODALS
  }
};

export function chooseModal(modal) {
  console.log('chooseModal')
  console.log(modal)
  return (dispatch, getState) => {
    let state = getState();
    if (modal === 'change-label') {
      dispatch(showModal(ACTIONS.MODAL_STATUS));
    } else if (modal === 'remove-todo') {
      dispatch(showModal(ACTIONS.MODAL_REMOVE));
    } else if (modal === 'error') {
      // console.log('error')
      // dispatch(showModalError('Error', 0))
      dispatch(showModal(ACTIONS.MODAL_ERROR));
    } else if (modal === 'share') {
      dispatch(showModal(ACTIONS.MODAL_SHARE));
    } else {
      console.log('hide')
      dispatch(hideModals());
    }
  };
}

export const hideModalAndRemoveTodo = (_id) => {
  return (dispatch) => {
    dispatch(actionRemoveTodo(_id));
    dispatch(hideModals());
  }
};

export const hideModal = () => {
  return (dispatch) => {
    dispatch(hideModals());
    dispatch(push('/app/'));
  }
};

export const hideModalAndShareTodo = (_id, userID) => {
  return (dispatch) => {
    dispatch(shareTodo(_id, userID));
    dispatch(hideModals());
  }
};

export const hideModalAndChangeStatus = (_id, status) => {
  return (dispatch) => {
    dispatch(actionChangeStatus(_id, status));
    dispatch(hideModals());
    dispatch(push(`/app/${_id}`));
  }
};

export const hideModalChangeStatus = () => {
  return (dispatch) => {
    dispatch(hideModals());
    dispatch(goBack());
  }
};
