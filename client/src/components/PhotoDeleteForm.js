import React, {Component} from 'react';
import {connect} from 'react-redux';

import {deletePhoto} from '../actions';

class PhotoDeleteForm extends Component{

  constructor(props){
    super(props);
    this.deletePhoto = this.deletePhoto.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
  }

  render(){
    return <div className = "photo-delete-form">
              {this.renderMessage()}
              {this.renderButtons()}
              {this.renderImage()}
              <div id = "errorMessage"
                   style = {{display: 'none'}} ></div>
           </div>
  }

  renderButtons(){
    return <div style = {{'padding': '20px'}} >
             <button className = "btn btn-primary"
                     style = {{marginRight: '15px'}}
                     onClick = {this.deletePhoto}> Yes </button>

             <button className = "btn btn-primary"
              onClick = {this.cancelDelete}> No </button>
          </div>
  }

  renderImage(){
    const photo = this.props.photo;
    const filePath = `/photos/${photo._id}.${photo.fileExtension}`;
    return <img src = {filePath}
                style = {{width: "150px", height: "150px"}}
                />;
  }

  renderMessage(){
    const photo  = this.props.photo;
    return `Are you sure you want to delete your photo titled '${photo.title}' ?`;
  }

  deletePhoto(){
    this.props.deletePhoto(this.props.photo._id, () => {
        this.props.closeDelete();
    });
  }

  cancelDelete(){
    this.props.closeDelete();
  }

}

export default connect(null, {deletePhoto})(PhotoDeleteForm);
