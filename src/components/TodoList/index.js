import React, { Component } from 'react';

import { connect } from 'react-redux';

import { initTodos } from '../../actions/todo';

import CONSTANTS from '../../constants';
import TodoItem from '../TodoItem/';

import './index.css';

class TodoList extends Component {
  componentDidMount() {
    this.props.initTodos()
  }
  
  render() {
    const {
      todos,
      _id
    } = this.props;
    return (
      <div className="todo__list">
        {
          todos.map((todo) => {
            return <TodoItem isActive={_id === todo._id } key={ Math.random() } todo={ todo } />
          })
        }
      </div>
    );
  }
}

const filterTodos = (todos, filter, text, username) => {
  switch (filter) {
    case CONSTANTS.FILTER_ALL:
      return todos.filter((todo) => {
        return todo.body.indexOf(text) !== -1 && todo.request !== username;
      });
    case CONSTANTS.FILTER_COMPLETED:
      return todos.filter((todo) => {
        return todo.status === 'completed' && todo.body.indexOf(text) !== -1 && todo.request !== username;
      });
    case CONSTANTS.FILTER_ACTIVE:
      return todos.filter((todo) => {
        return (todo.status === 'new' || todo.status === 'in progress') && todo.body.indexOf(text) !== -1 && todo.request !== username;
      });
    default: {
      break;
    }
  }
};

const mapStateToProps = (state) => {
  return {
    todos: filterTodos(state.todos, state.filter, state.inputText, state.user.username)
  }
};

export default connect(mapStateToProps, { initTodos })(TodoList)
