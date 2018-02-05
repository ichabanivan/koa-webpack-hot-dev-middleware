import React, { Component } from 'react';

import { connect } from 'react-redux';

import ShareTodo from '../ShareTodo'

class ShareTodos extends Component {
  render () {
    const {
      todos,
    } = this.props;

    if (todos.length) {
      return todos.map((todo, index) => {
        return <ShareTodo key={index} todo={todo} />
      })
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos.filter((todo) => {
      return todo.request === state.user.username;
    })
  }
};

export default connect(mapStateToProps, {})(ShareTodos)
