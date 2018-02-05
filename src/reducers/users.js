import CONSTANTS from '../constants/';

export default function user(state = [], action) {
  switch (action.type) {
    case CONSTANTS.USERS_INIT:
      return action.payload
    default:
      return state;
  }
}
