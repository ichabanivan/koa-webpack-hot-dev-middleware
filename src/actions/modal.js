import ACTIONS from '../constants/';

import { push, goBack } from 'react-router-redux';

import {
  actionRemoveTodo,
  actionChangeStatus,
  updateTodo,
  shareTodo
} from "./todo";

export const showModal = (type) => {
  return {
    type: type,
    payload: {
      isVisible: true
    }
  }
};

export const hideModals = () => {
  return {
    type: ACTIONS.HIDE_MODALS
  }
};

export function chooseModal(modal) {
  return (dispatch) => {
    if (modal === 'change-label') {
      dispatch(showModal(ACTIONS.MODAL_STATUS));
    } else if (modal === 'remove-todo') {
      dispatch(showModal(ACTIONS.MODAL_REMOVE));
    } else if (modal === 'error') {
      dispatch(showModal(ACTIONS.MODAL_ERROR));
    } else if (modal === 'share') {
      dispatch(showModal(ACTIONS.MODAL_SHARE));
    } else {
      dispatch(hideModals());
    }
  };
}

export const hideModalError = () => {
  return (dispatch) => {
    dispatch(hideModals());
    dispatch(push('/app/'));
  }
};

export const hideModalAndRemoveTodo = (_id) => {
  return (dispatch) => {
    dispatch(actionRemoveTodo(_id));
    dispatch(hideModals());
  }
};

// hidemodals можно сделать 1 метод на всех
export const hideModalRemoveTodo = () => {
  return (dispatch) => {
    dispatch(hideModals());
    dispatch(push('/app/'));
  }
};

export const hideModalAndShareTodo = (_id, username) => {
  return (dispatch) => {
    dispatch(shareTodo(_id, username));
    dispatch(hideModals());
  }
};

export const hideModalShareTodo = () => {
  return (dispatch) => {
    dispatch(hideModals());
    dispatch(push('/app/'));
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
