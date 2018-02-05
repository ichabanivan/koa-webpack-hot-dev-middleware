import ACTIONS from '../constants/';

import { push } from 'react-router-redux'

export const login = (user) => {
  return async dispatch => {
    try {
      let response = await fetch('/signIn', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      let res = await response.json()
      
      localStorage.setItem('user', JSON.stringify(res));

      dispatch({
        type: ACTIONS.USER,
        user: res
      });
      dispatch(push(`/app`))
    } catch (error) {
      console.error('/login - error')
    }
  }
};

export const reg = (user) => {
  return async dispatch => {
    try {
      let response = await fetch('/signUp', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      let res = await response.json()

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