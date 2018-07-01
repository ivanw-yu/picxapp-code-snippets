import React, {Component} from 'react';
import {connect} from 'react-redux';

import Photo from './Photo';
import UserHeader from './UserHeader';

class PhotoDetails extends Component{

  render(){
    return this.props.photo ? this.renderPhotoDetails() : "";
  }

  renderPhotoDetails(){
    return (
      <div>
        <h3><b> {this.props.photo.title} </b></h3>
        <p>{this.props.photo && this.props.photo.user ? this.renderUserInformation() : ""}</p>
        <p>{this.props.photo.caption}</p>
      </div>
    );
  }

  renderUserInformation(){
    const user = this.props.photo.user;
    return `By ${user.name.first} ${user.name.last} (${user.username})`;
  }
}

export default PhotoDetails;
