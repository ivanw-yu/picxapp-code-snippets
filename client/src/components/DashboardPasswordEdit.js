import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import {updateUserPassword} from '../actions';

import UserField from './UserField';
import Auth from '../services/Auth';

const FIELDS = [
  {type: 'password', name: 'currentPassword', label: 'Current Password'},
  {type: 'password', name: 'newPassword', label: 'New Password'},
  {type: 'password', name: 'confirmPassword', label: 'Confirm New Password'}
];

class DashboardPasswordEdit extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render(){
    return <form className = "form-horizontal shadow-box register-form"
                 onSubmit = {this.props.handleSubmit(this.handleSubmit)} >
                 <h1>Change Password</h1>
                 {this.renderFields()}
                 <button className = 'btn btn-primary'
                         disabled = {this.props.invalid}
                         onClick = {this.props.handleSubmit(this.handleSubmit)} >
                        Submit
                 </button>
           </form>
  }

  renderFields(){
    return FIELDS.map(({type, name, label}) => (<Field
                                          key = {name}
                                          name = {name}
                                          type = {type}
                                          label = {label}
                                          component = {UserField}
                                          />));
  }

  handleSubmit(values){
    this.props.updateUserPassword(Auth.getUserId(), values.currentPassword, values.newPassword);
    this.props.history.push('/dashboard');
  }
}

function validate(values){
  const errors = {};
  if(!values.currentPassword){
    errors.currentPassword = 'Please enter your current password.';
  }

  if(!values.newPassword){
    errors.newPassword = 'Please enter a new password.'
  }

  if(values.newPassword && values.newPassword.length < 3){
    errors.newPassword = 'Please make sure that your password is at least 3 characters long.';
  }

  if(!values.confirmPassword){
    errors.confirmPassword = 'Please confirm password by typing it again.';
  }

  if(values.confirmPassword != values.newPassword){
    errors.confirmPassword = 'Please make sure your new password matches the re-typed password.';
  }

  return errors;
}

export default reduxForm({
  form: 'changePasswordForm',
  validate
})(withRouter(connect(null, {updateUserPassword})(DashboardPasswordEdit)));
