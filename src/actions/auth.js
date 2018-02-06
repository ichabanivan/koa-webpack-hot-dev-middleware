import ACTIONS from '../constants/';

import { push } from 'react-router-redux'
import { showModalError } from './modal';
import account from './account'

export const login = (user) => {
  return async dispatch => {
    try {
      let res = await account({
        url: '/signIn',
        method: 'POST',
        body: JSON.stringify(user)
      })
      
      localStorage.setItem('user', JSON.stringify(res));
      
      if (res.username) {
        dispatch({
          type: ACTIONS.USER,
          user: res
        });
        dispatch(push(`/app`))
      } else {
        console.error('/login - error')
      }
     
    } catch (error) {
      console.error('/login - error')
    }
  }
};

export const reg = (user) => {
  return async dispatch => {
    try {
      let res = await account({
        url: '/signUp',
        method: 'POST',
        body: JSON.stringify(user)
      })

      localStorage.setItem('user', JSON.stringify(res));

      dispatch({
        type: ACTIONS.USER,
        user: res
      });
      dispatch(push('/app'))
    } catch (error) {
      console.log(error)
      console.error('/reg - error')
    }
  }
};

export const exit = (user) => {
  return async dispatch => {
    localStorage.removeItem('user');
    dispatch(push('/login'))
    dispatch({
      type: ACTIONS.EXIT,
      user: {}
    });
  }
};