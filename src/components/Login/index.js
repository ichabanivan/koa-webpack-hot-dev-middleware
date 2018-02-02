import React, { Component } from 'react';

import { connect } from 'react-redux';

import { login } from '../../actions/auth'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom';

import Input from '../Input/';
import TodoList from '../TodoList/';

import ModalError from '../ModalError/';
import ModalRemoveTodo from '../ModalRemoveTodo/';
import ModalChangeStatus from '../ModalChangeStatus/';

class Login extends Component {
  state = {
    username: '',
    passwords: '',
  }

  login = (e) => {
    e.preventDefault()

    const { username, password } = this.state;
    const { login } = this.props;

    if (username.length < 3) {
      alert("Username is short")
    } else if (password.length < 3) {
      alert("Password is short")
    } else {
      login({
        username,
        password
      })
    }
  }

  handleName = (e) => {
    this.setState({
      username: e.target.value
    })
  }

  handlePassword = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  render() {

    return (
      <form className="auth">
        <h2>Login</h2>

        <input onChange={this.handleName} type="text" placeholder="Username" val={this.state.username}/>
        <input onChange={this.handlePassword} type="password" placeholder="Password" val={this.state.passwords}/>

        <button onClick={this.login} type="submit">Login</button>
        <Link to="/reg">Register</Link>
      </form>
    );
  }
}

export default connect(null, { login, push })(Login)
