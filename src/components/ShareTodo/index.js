import React, { Component } from 'react';

import { connect } from 'react-redux';
import { accessEditing } from '../../actions/todo';

import './index.css';

class ShareTodo extends Component {
  accessTrue = (e) => {
    const {
      accessEditing,
      todo
    } = this.props;

    e.preventDefault()
    accessEditing(true, todo._id)
  }

  accessFalse = (e) => {
    const {
      accessEditing,
      todo
    } = this.props;
    
    e.preventDefault()
    accessEditing(false, todo._id)
  }

  render () {
    const {
      todo,
    } = this.props;


    return <div className="share">
      <button className="share__agree" onClick={this.accessTrue}>+</button>
      <button className="share__disagree" onClick={this.accessFalse}>-</button>
      Todo: {todo.body}
    </div>
  }
}

export default connect(null, { accessEditing })(ShareTodo)
