import React, { Component } from 'react';

import { connect } from 'react-redux';

import ShareTodo from '../ShareTodo'

class ShareTodos extends Component {
  render () {
    const {
      todos,
    } = this.props;

    if (todos.length) {
      return <div>
        <h2>New todos</h2>
        {
          todos.map((todo, index) => {
            return <ShareTodo key={index} todo={todo} />
          })
        }
      </div>
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
    todos: state.todos.filter((todo) => {      
      return todo.request === state.user._id;
    })
  }
};

export default connect(mapStateToProps, {})(ShareTodos)
