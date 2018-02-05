import React, { Component } from 'react';

import { connect } from 'react-redux';

import CONSTANTS from '../../constants/';

import { hideModalAndShareTodo, hideModal } from '../../actions/modal';

class ModalShareTodo extends Component {
  stopPropagation = (e) => {
    e.stopPropagation();
  };

  agree = (e) => {
    e.preventDefault();
    const _id = this.props._id;
    this.props.hideModalAndShareTodo(_id, this.state.username);
  };

  disagree = (e) => {
    e.preventDefault();

    this.props.hideModal();
  };

  handleChange = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  render() {
    const { isVisible } = this.props;

    if (isVisible) {
      return (
        <div>
          <div className="modal-overlay" onClick={ this.disagree }>
            <form className="modal" onClick={ this.stopPropagation }>
              <div className="modal-content">
                <h4> Do you want to share todo? </h4>
              </div>
              <input className="username" placeholder="Username" onChange={this.handleChange}/>
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
    isVisible: state.modals[CONSTANTS.MODAL_SHARE].isVisible
  }
};

export default connect(mapStateToProps, { hideModal, hideModalAndShareTodo })(ModalShareTodo)
