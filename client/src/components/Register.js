import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import _ from 'lodash';
import * as validator from 'validator';
import * as axios from 'axios';

import UserField from './UserField';
import {registerUser} from '../actions';

const FIELDS = [
  {name: 'firstName', label: 'First Name', type: 'text'},
  {name: 'lastName', label: 'Last Name', type: 'text'},
  {name: 'username', label: 'Username', type: 'text'},
  {name: 'email', label: 'Email', type: 'text'},
  {name: 'password', label: 'Password', type: 'password'}
];

class Register extends Component {

    constructor(props){
      super(props);
      this.state = {errorMessage : ''};
      this.handleSubmit = this.handleSubmit.bind(this);
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
                         padding: "100px 10% 50px 10%"}}>
          <form
            className = "form-horizontal shadow-box register-form"
            onSubmit = {this.props.handleSubmit(this.handleSubmit)} >
            <h1>Register</h1>
            {this.renderFields()}
            <button
              type = "submit"
              disabled = {this.props.invalid}
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
        name: {first: values.firstName,
               last: values.lastName},
        username: values.username,
        email: values.email,
        password: values.password
      };
      this.props.registerUser(data, (res) => {
        if(res.success){
          return this.props.history.push('/login');
        }
        let errorMessage;
        if(res.error && res.error.indexOf('username') > 0){
          errorMessage = 'The username you provided has already been taken, please choose a different username.';
        }else if(res.error && res.error.indexOf('email') > 0){
          errorMessage = 'The email you provided has already been taken, please choose a different email.'
        }
        this.setState({errorMessage});
      });
    }
}

function validate(values){
  const errors = {};

  if(!values.firstName || values.firstName.replace(/[ ]+/, '').length < 1){
    errors.firstName = 'You must provide a first name.';
  }else if(/[^a-zA-Z]/.test(values.firstName)){
    errors.firstName = 'First name cannot have special characters or numbers';
  }else if(values.firstName.trim().length < 2){
    errors.firstName = 'First name must be at least 2 alphabets.';
  }

  if(!values.lastName || values.lastName.replace(/[ ]+/, '').length < 1){
    errors.lastName = 'You must provide a last name.';
  }else if(/[^a-zA-Z]+/.test(values.lastName)){
    errors.lastName = 'First name cannot have special characters or numbers';
  }else if(values.lastName.trim().length < 2){
    errors.lastName = 'First name must be at least 2 alphabets.';
  }

  if(!values.password){
    errors.password = 'You must provide a password.';
  }else if(values.password.length < 3){
    errors.password = 'Your password must be atleast 3 characters long';
  }

  if(!values.username){
    errors.username = 'You must provide a username.';
  }else if(/[^a-zA-Z0-9]/.test(values.username) ){
    errors.username = 'Username cannot have any special character';
  }else if(!/[a-zA-Z]/.test(values.username)){
    errors.username = 'Username must have an alphabet.';
  }else if(values.username.trim().length < 3 ){
    errors.username = 'Username must be at least 3 characters long excluding special characters';
  }

  if(!values.email){
    errors.email = 'You must provide an email.';
  }else if(!validator.isEmail(values.email)){
    errors.email = 'The email you provided is invalid.';
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'userForm'
})(withRouter(connect(null, {registerUser})(Register)));
