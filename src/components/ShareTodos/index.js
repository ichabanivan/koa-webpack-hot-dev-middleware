import React, { Component } from 'react';

import { connect } from 'react-redux';

import ShareTodo from '../ShareTodo'

class ShareTodos extends Component {
  render () {
    const {
      todos,
    } = this.props;
console.log(todos)

    if (todos.length) {
      return todos.map((todo, index) => {
        console.log(todo)
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
