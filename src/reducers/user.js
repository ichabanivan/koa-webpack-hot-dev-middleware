import CONSTANTS from '../constants/';

let user = JSON.parse(localStorage.getItem("TodoUser"));

export default function user(state = user, action) {
  switch (action.type) {
    case CONSTANTS.USER:
      return action.user;

    default:
      return state;
  }
}
