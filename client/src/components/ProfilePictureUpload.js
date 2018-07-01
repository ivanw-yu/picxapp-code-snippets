import React, {Component} from 'react';
import {connect} from 'react-redux';
import PhotoField from './PhotoField';

import {updateProfilePicture,
        deleteProfilePicture} from '../actions';

import Auth from '../services/Auth';

class ProfilePictureUpload extends Component{

  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteProfilePicture = this.deleteProfilePicture.bind(this);
  }

  render(){
    const user = this.props.user;
    return <div className = "shadow-box"
                style = {{paddingBottom: "90px",
                          paddingBottom: "90px"}}>
                {this.renderProfilePictureUploadForm()}
                {user.profilePicture ? this.renderDeleteProfilePictureButton() : ''}
           </div>;
  }

  renderProfilePictureUploadForm(){
    return <form className = "form-horizontal"
             onSubmit = {(e) => {this.handleSubmit(e)}} >
              <label>{`Image File`}</label>
              <PhotoField
                name = "file"
                type = "file"
                />
              <button
                type = "submit"
                className = "btn btn-primary">
                  Submit
              </button>
              <p id = "errorMessage" />
            </form>;
  }

  renderDeleteProfilePictureButton(){
    return <button className = 'btn btn-danger'
                   onClick = {this.deleteProfilePicture}
                    style = {{float: 'left', marginTop: "40px"}}> Delete Profile Picture </button>
  }

  handleSubmit(e){
    e.preventDefault();
    const imageFile = document.getElementsByName('file')[0];

    if(this.invalid()){
      return this.showErrorMessage('Please provide an image file (jpg, jpeg or png) to submit');
    }

    if(!this.validFileType(imageFile.value)){
      return this.showErrorMessage('Please upload a file type of jpg, jpeg or png only.');
    }


    var fileReader = new FileReader();

    fileReader.onload = () => {
      const data = {
        file: imageFile.value,
        image: fileReader.result,
      };
      this.props.updateProfilePicture( Auth.getUserId(), data);
    };

    fileReader.readAsDataURL(imageFile.files[0]);
  }

  deleteProfilePicture(){
    this.props.deleteProfilePicture(Auth.getUserId());
  }

  validFileType(fileName){
    return /\.(jpe?g|png)$/i.test(fileName);
  }

  invalid(){
    const imageFile = document.getElementsByName('file')[0];

    if(!imageFile)
      return false;

    return !imageFile.value;
  }

  showErrorMessage(errorMessage){
    const errorMessageElem = document.getElementById('errorMessage');
    errorMessageElem.innerHTML = errorMessage;

    setTimeout(() => {
      errorMessageElem.innerHTML = '';
    }, 3000);
  }
}

export default connect(null, {updateProfilePicture,
                              deleteProfilePicture})(ProfilePictureUpload);
