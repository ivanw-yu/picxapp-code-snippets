import React, {Component} from 'react';
import PhotoForm from './PhotoForm';
import {Link} from 'react-router-dom';

class PhotoUpload extends Component{

  render(){
    return (
      <div>
        <PhotoForm />
      </div>
    );
  }
}

export default PhotoUpload;
