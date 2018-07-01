import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {withRouter} from 'react-router-dom';

import Auth from '../services/Auth';

import _ from 'lodash';

import UserField from './UserField';
import {loginUser} from '../actions';

const FIELDS = [
  {name: 'emailOrUsername', type: 'text', label: 'Email/Username'},
  {name: 'password', type: 'password', label: 'Password'}
];

class Login extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {errorMessage: ''};
  }

  renderFields(){
    return _.map(FIELDS, ({name, label, type}) => {
      return <Field
                key={name}
                name={name}
                label={label}
                type={type}
                component={UserField}
              />;
    });
  }

  render(){
    return (
      <div style = { { width: "100%",
                       padding: "75px 25% 100px 25%"}}>

        <form
          className = "form-horizontal shadow-box login-form"
          onSubmit = {this.props.handleSubmit(this.handleSubmit)} >
          <h1>Login</h1>
          <br />
          {this.renderFields()}
          <button
            type = "submit"
            className = "btn btn-primary">
              Submit
          </button>
          <div id = "errorMessage">{this.state.errorMessage}</div>
        </form>
      </div>
    );
  }

  handleSubmit(values){
    const data = {
      emailOrUsername: values.emailOrUsername,
      password: values.password
    };
    this.props.loginUser(data, (res) => {
      if(res.success){
        Auth.setToken(res.token);
        Auth.setUser(res.user);
        window.location.pathname = '/dashboard';
      }
      if(!res.success && res.message)
        this.setState({errorMessage: res.message || 'Invalid email/username and password combination.'});
    });
  }
}


function validate(values){
  const errors = {};
  if(!values.emailOrUsername){
    errors.emailOrUsername = 'Please enter an email or username to log in.';
  }

  if(!values.password){
    errors.password = 'Please enter a password to log in.';
  }
}

export default reduxForm({
  validate,
  form: 'loginForm'
})(withRouter(connect( null, {loginUser})(Login)));
