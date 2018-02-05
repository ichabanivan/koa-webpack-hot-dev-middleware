import React, { Component } from 'react';

import { connect } from 'react-redux';

import CONSTANTS from '../../constants/';

import { hideModalAndShareTodo, hideModal } from '../../actions/modal';
import { initUsers } from '../../actions/users';

class ModalShareTodo extends Component {

  state = {
    userId: null
  }

  componentDidMount = () => {
    this.props.initUsers()
  }
  

  stopPropagation = (e) => {
    e.stopPropagation();
  };

  agree = (e) => {
    e.preventDefault();
    const todoId = this.props._id;
    console.log(todoId, this.state.userId)
    this.props.hideModalAndShareTodo(todoId, this.state.userId);
  };

  disagree = (e) => {
    e.preventDefault();

    this.props.hideModal();
  };

  handleChange = (e) => {
    this.setState({
      userId: e.target.value
    })
  }

  render() {
    const { isVisible, users } = this.props;

    if (isVisible) {
      return (
        <div>
          <div className="modal-overlay" onClick={ this.disagree }>
            <form className="modal" onClick={ this.stopPropagation }>
              <div className="modal-content">
                <h4> Do you want to share todo? </h4>
              </div>
              <select className="username" onChange={this.handleChange}>
                {
                  users.map((user, index) => {
                    return <option key={index} value={user._id}>{user.username}</option>
                  })
                }
              </select>
              <div className="modal-footer">
                <button
                  className="modal-action"
                  onClick={ this.disagree }
                > Disagree </button>
                <button
                  className="modal-action"
                  onClick={ this.agree }
                > Agree </button>
              </div>
            </form>
          </div>
        </div>
      );
    } else {
      return null
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isVisible: state.modals[CONSTANTS.MODAL_SHARE].isVisible,
    users: state.users
  }
};

export default connect(mapStateToProps, { hideModal, hideModalAndShareTodo, initUsers })(ModalShareTodo)
