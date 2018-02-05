import React, { Component } from 'react';

import { Route } from 'react-router-dom';
import { connect } from 'react-redux';

import { push } from 'react-router-redux'

import Todos from './Todos/';
import Register from './Register/';
import Login from './Login/';

import 'normalize.css';
import './index.css';

class App extends Component {

  componentDidMount = () => {
    const { push, user } = this.props;
    if (!user.username) push('/login')
  }
  
  render() {
    return (
      <div className="todo">

        <h1>Todos</h1>
        <p>Hello <strong>{this.props.user.username}</strong></p>
        <Route path="/login" component={Login} />
        <Route path="/reg" component={Register} />
        <Route path="/app/:id?/:modal?" component={ Todos } />

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user 
  }
};

export default connect(mapStateToProps, { push })(App)
