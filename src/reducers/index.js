import {combineReducers} from 'redux';
import { routerReducer } from 'react-router-redux';

import todos from './todos';
import filter from './filter';
import modals from './modals';
import inputText from './inputText';
import user from './user';
import users from './users';

export default combineReducers({
  router: routerReducer,
  todos,
  modals,
  filter,
  inputText,
  user,
  users
});
