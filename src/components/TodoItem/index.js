import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { editTodo } from '../../actions/todo';

import './index.css';

class TodoItem extends Component {
  render () {
    const {
      todo,
      push,
      isActive,
      editTodo,
      user,
      assigned
    } = this.props;

    let activeClass = isActive ? 'item--active': '';

    if(user) {
      return (
        <div className={`todo__item item ${activeClass}`} >
          <div className="item__top">
            Status: <button
              className="item__label"
              onClick={() => editTodo(`/app/${todo._id}/change-label`, todo)}
            > { todo.status } </button>
            <button
              className="item__label"
              onClick={() => editTodo(`/app/${todo._id}/share`, todo)}
            > Share </button>

            <span className="item__text">{ todo.body }</span>

            <div className="item__btns">
              <button
                className="item__delete"
                onClick={() => editTodo(`/app/${todo._id}/remove-todo`, todo)}
              > X </button>
              <button
                className="item__edit"
                onClick={() => editTodo(`/app/${todo._id}`, todo)}
              > edit </button>
            </div>
          </div>

          <div>
            <div>Owner: <strong>{ user.username }</strong></div>
            <div>Assigned to: <strong>{assigned.username }</strong></div>
            <div>Created: { new Date(todo.created).toLocaleDateString() } </div>
            <div>Мodified: { new Date(todo.modified).toLocaleDateString() }</div>
          </div>
        </div>
      );
    } else {
      return null
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    user: state.users.filter((user) => {
      return ownProps.todo.owner === user._id
    })[0],
    assigned: state.users.filter((user) => {
      console.log(ownProps.todo)
      return ownProps.todo.canEdit === user._id
    })[0],
  }
}

export default connect(mapStateToProps, { editTodo })(TodoItem)
