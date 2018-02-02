import React, { Component } from 'react';

import { connect } from 'react-redux';

import { reg } from '../../actions/auth'
import { Link } from 'react-router-dom';

import Input from '../Input/';
import TodoList from '../TodoList/';

import ModalError from '../ModalError/';
import ModalRemoveTodo from '../ModalRemoveTodo/';
import ModalChangeStatus from '../ModalChangeStatus/';

class Register extends Component {

  state = {
    username: '',
    password1: '',
    password2: ''
  }

  reg = (e) => {
    e.preventDefault()
    
    const { username, password1, password2 } = this.state;
    const { reg } = this.props;

    if (this.state.username.length < 3) {
      console.log(this.state.username)
      alert("Username is short")
    } else if (password1 !== password2) {
      alert("Passwords don't same")
    } else if (password1.length < 3) {
      alert("Password is short")
    } else {
      reg({
        username,
        password: password1
      })
    }
  }

  handleName = (e) => {
    this.setState({
      username: e.target.value
    })
  }
  handlePassword1 = (e) => {
    this.setState({
      password1: e.target.value
    })
  }
  handlePassword2 = (e) => {
    this.setState({
      password2: e.target.value
    })
  }

  render() {

    return (
      <form className="auth">
        <h2>Register</h2>

        <input onChange={this.handleName} type="text" placeholder="Username" val={this.state.username}/>
        <input onChange={this.handlePassword1} type="password" placeholder="Password" val={this.state.password1}/>
        <input onChange={this.handlePassword2} type="password" placeholder="Repeat password" val={this.state.password2}/>

        <button onClick={this.reg} type="submit">Register</button>
        <Link to="/login">Login</Link>
      </form>
    );
  }
}

export default connect(null, { reg })(Register)
