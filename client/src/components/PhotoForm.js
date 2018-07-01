import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import _ from 'lodash';
import * as axios from 'axios';

import {postPhoto} from '../actions';

import PhotoField from './PhotoField';

import Auth from '../services/Auth';

const FIELDS = [
  {name: 'title', label: 'Photo Title', type: 'text', required: true},
  {name: 'caption', label: 'Caption', type: 'textarea' },
  {name: 'publicity', label: 'Publicity', type: 'checkbox', checked: 'true'},
  {name: 'file', label: 'Image File', type: 'file', required: true}
];

class PhotoForm extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.invalid = this.invalid.bind(this);
  }

  renderFields(){

    return _.map(FIELDS, ({name, label, type, required}) => {
      return <PhotoField
                key={name}
                name={name}
                label={label}
                type={type}
                required = {required}
              />;
    });
  }

  handleSubmit(e, file){
    e.preventDefault();

    if(this.invalid()){
      return this.showErrorMessage('Please provide title and file to submit');
    }

    const title = document.getElementsByName('title')[0].value;
    const caption = document.getElementsByName('caption')[0].value;
    const publicity = document.getElementsByName('publicity')[0].value;
    const imageFile = document.getElementsByName('file')[0];

    if(!this.validFileType(imageFile.value)){
      return this.showErrorMessage('Please upload a file type of jpg, jpeg or png only.');
    }
    const parsedFileName = imageFile.value.split(".");
    const fileExtension = parsedFileName[parsedFileName.length-1];

    var fileReader = new FileReader();

    fileReader.onload = () => {

      const id = Auth.getUserId();
      if(id){
        const data = {
          title,
          caption,
          fileExtension,
          publicity,
          image: fileReader.result,
          user: id
        };

        this.props.postPhoto(data, (err) => {
          if(!err)
            this.props.history.push('/dashboard');
        });
      }
    };

    fileReader.readAsDataURL(imageFile.files[0]);
  }

  render(){
    const user = JSON.parse(localStorage.getItem('user'));
    const id = user ? user._id : null;
    return (
      <form
        id = "photoForm"
        className = "form-horizontal shadow-box"
        onSubmit = {(e) => { this.handleSubmit(e) }} >
        {this.renderFields()}
        <button
          type = "submit"
          className = "btn btn-primary">
            Submit
        </button>
        <p id = "errorMessage" />
      </form>
    );
  }

  showErrorMessage(errorMessage){
    const errorMessageElem = document.getElementById('errorMessage');
    errorMessageElem.innerHTML = errorMessage;

    setTimeout(() => {
      errorMessageElem.innerHTML = '';
    }, 3000);
  }

  validFileType(fileName){
    return /\.(jpe?g|png)$/i.test(fileName);
  }

  invalid(){
    const title = document.getElementsByName('title')[0];
    const imageFile = document.getElementsByName('file')[0];

    if(!title || !imageFile)
      return false;

    const titleValue = title.value.replace(/[ ]+/, '');
    return titleValue.length == 0 || !imageFile.value;
  }
}

export default withRouter(connect(null, {postPhoto})(PhotoForm));
