import ACTIONS from '../constants/';

import { push } from 'react-router-redux'

export const initUsers = (user) => {
  return async (dispatch, getState) => {
    let state = getState();

    try {
      let response = await fetch('/app/findAllUsers', {
        method: 'GET',
        headers: new Headers({
          'authorization': `Bearer ${state.user.authorization}`
        })
      })
      let res = await response.json()
      console.log(res)

      dispatch({
        type: ACTIONS.USERS_INIT,
        payload: res
      });
      dispatch(push(`/app`))
    } catch (error) {
      console.log(error)
      console.error('/initUsers - error')
    }
  }
};