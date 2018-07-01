import React, {Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import * as validator from 'validator';
import _ from 'lodash';

import UserField from './UserField';

import {updateUser} from '../actions';

import Auth from '../services/Auth';

const FIELDS = [
  {name: 'firstName', label: 'First Name', type: 'text'},
  {name: 'lastName', label: 'Last Name', type: 'text'},
  {name: 'username', label: 'Username', type: 'text'},
  {name: 'email', label: 'Email', type: 'text'}
];

/* user props is passed from parent component Dashboard.
  The user props is initially obtained from Auth service
*/
class DashboardProfileEdit extends Component{

  constructor(props){
    super(props);
    this.state = {editMode: false,
                  userForm: {firstName: '',
                             lastName: '',
                             username: '',
                             email: '',
                             password: '',
                             passwordMatch: ''},
                  errors: { firstName: '',
                            lastName: '',
                            username: '',
                            email: '',
                            password: '',
                            passwordMatch: ''},
                  errorMessage: ''
                 };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormOnChange = this.handleFormOnChange.bind(this);
  }

  componentDidMount(){
      this.setState({userForm: { firstName: this.props.user.name.first,
                                 lastName: this.props.user.name.last,
                                 username: this.props.user.username,
                                 email: this.props.user.email }
      });
  }

  render(){
    return <div className = "shadow-box profile-edit-box">
              <div className = "profile-edit-mode-button-area">
                {this.state.editMode ?
                    <button className = "profile-edit-mode-button glyphicon glyphicon-remove"
                            onClick = {(e) => this.changeMode(false)}
                    />
                    :
                    <button className = "profile-edit-mode-button glyphicon glyphicon-pencil"
                            onClick = {(e) => this.changeMode(true)}
                    />
                }
              </div>
              {this.state.editMode ? this.renderProfileEditForm()
                               : this.renderProfileSummary()}
          </div>
  }

  renderProfileEditForm(){
    return  <form className = "form-horizontal"
                   onSubmit = {this.handleSubmit}>
                   {this.renderFields()}
                   <button type = "submit"
                           disabled = {this.isFormInvalid()}
                           className = "btn btn-primary">Submit</button>
                  {this.state.errorMessage}
             </form>;
  }

  renderFields(){
    return _.map(FIELDS, ({name, label, type, value}) => {
      return    <div className="form-group">
                  <label>{label}</label>
                  { this.state.editMode ?
                    <input
                        key={name}
                        name={name}
                        id={name}
                        label={label}
                        type={type}
                        value={this.state.userForm[name]}
                        className = "form-control"
                        onChange = {(e) => this.handleFormOnChange(e.target.value, name)}
                      />
                      : <p>{this.state.userForm[name]}</p>
                    }
                  {this.state.errors[name]}
                </div>
    });
  }

  renderProfileSummary(){
    return <div>
              {this.renderFields()}
           </div>
  }

  isFormInvalid(){
    const errors = this.state.errors;
    return errors.firstName != '' || errors.lastName != '' || errors.username != '' || errors.email != '';
  }

  handleFormOnChange(value, name){
    this.validators(value, name);
  }

  changeMode(editMode){
    this.setState({userForm: {...this.state.userForm},
                   errors: {...this.state.errors},
                   errorMessage: this.state.errorMessage,
                   editMode});
  }

  validators(value, name){
    const errors = {...this.state.errors};
    const userForm = {...this.state.userForm};
    userForm[name] = value;

    switch(name){
      case 'firstName':
        if(!value){
          errors.firstName = 'You must provide a first name';
        }else if(/[^a-zA-Z]/.test(value)){
          errors.firstName = 'First name cannot have special characters or numbers';
        }else if(value.trim().length < 2){
          errors.firstName = 'First name must be at least 2 alphabets.';
        }else{
          errors.firstName = '';
        }
        break;

      case 'lastName':
        if(!value){
          errors.lastName = 'You must provide a first name';
        }else if(/[^a-zA-Z]/.test(value)){
          errors.lastName = 'First name cannot have special characters or numbers';
        }else if(value.trim().length < 2){
          errors.lastName = 'First name must be at least 2 alphabets.';
        }else{
          errors.lastName = '';
        }
        break;
      case 'username':
        if(!value){
          errors.username = 'You must provide a username';
        }else if(/[^a-zA-Z0-9]/.test(value) ){
          errors.username = 'Username cannot have any special character';
        }else if(!/[a-zA-Z]/.test(value)){
          errors.username = 'Username must have an alphabet.';
        }else if(value.trim().length < 3 ){
          errors.username = 'Username must be at least 3 characters long excluding special characters';
        }else{
          errors.username = '';
        }

        break;
      case 'email':
        if(!validator.isEmail(value)){
          errors.email = 'Email is invalid';
        }else{
          errors.email = '';
        }
        break;
    }

    this.setState({editMode: this.state.editMode, userForm, errors});
  }


  handleSubmit(event){
    event.preventDefault();
    const user = this.state.userForm;
    const data = {
        username: user.username,
        email: user.username,
        name: {first: user.firstName, last: user.lastName}
    };
    this.props.updateUser(Auth.getUserId(), data, (res) => {
      if(res.success){
        Auth.setUser(res.user);
        return this.props.history.push('/dashboard');
      }
      this.setState({userForm: {...this.state.userForm},
                     error: {...this.state.error},
                     editMode: this.state.editMode,
                     errorMessage: 'Unable to save profile edits at this time.'});
    });
  }
}

export default withRouter(connect(null, {updateUser})(DashboardProfileEdit));
