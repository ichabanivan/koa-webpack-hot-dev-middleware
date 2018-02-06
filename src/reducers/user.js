import CONSTANTS from '../constants/';

let user = JSON.parse(localStorage.getItem("user")) || {};

export default function user(state = user, action) {
  switch (action.type) {
    case CONSTANTS.USER:
      return action.user;

    case CONSTANTS.EXIT:
      return {};

    default:
      return state;
  }
}
