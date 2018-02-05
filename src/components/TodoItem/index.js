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
      editTodo
    } = this.props;

    let activeClass = isActive ? 'item--active': '';

    return (
      <div className={`todo__item item ${activeClass}`} >
        <div className="item__top">
          <button
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
          <div>Created: { todo.created } </div>
          <div>Мodified: { todo.modified } </div>
        </div>
      </div>
    );
  }
}

export default connect(null, { editTodo })(TodoItem)
