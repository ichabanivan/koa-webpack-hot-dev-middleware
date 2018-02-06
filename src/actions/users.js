import ACTIONS from '../constants/';

import { push } from 'react-router-redux'

import api from './fetch';

export const initUsers = (user) => {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      let res = await api({
        url: '/app/findAllUsers',
        method: 'GET'
      }, state)

      dispatch({
        type: ACTIONS.USERS_INIT,
        payload: res
      });
    } catch (error) {
      console.log(error)
      console.error('/initUsers - error')
    }
  }
};