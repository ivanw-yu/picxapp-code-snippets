import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Link} from 'react-router-dom';

// import {fetchPhotos} from '../actions';
import _ from 'lodash';

import {fetchPhoto} from '../actions';
import Photo from './Photo';
import PhotoView from './PhotoView';
import PhotoDeleteForm from './PhotoDeleteForm';

import Auth from '../services/Auth';
/*
  Photos is a child component of Search and UsersPhotoLayout component.
  The Search component is responsible for fetching the photos and passing the photos array
  to this child component, and the UsersPhotoLayout is for dashboards.
  Photos serves to display the Photos, trigger PhotoView display on Photo click, and open
  PhotoDeleteForm components upon pressing delete buttons in photos.

  PhotoViewIndex is the initial index of the photo selected for PhotoView, its purpose is
  to pass this index to PhotoView Component, and PhotoView is responsible for navigating to the next photos
  after the initial index if its navigation button is pressed to change the photo in the PhotoView.
*/

class Photos extends Component{

  constructor(props){
    super(props);
    this.state = {photoViewIndex : 0, photoDeletionIndex: -1};
    this.openDeleteForm = this.openDeleteForm.bind(this);
  }

  renderPhotos(){

    return _.map(this.props.photos, (photo, index) => {
      return (
              <div  key = {photo._id}
                    className="delete-button-div col-lrg-4 col-md-4 col-sm-4 col-xs-6">
                { Auth.getUserId() === photo.user
                    ? this.renderPhotoDeletionButtonAndForm(photo, index)
                    : ''}
                {this.renderPhoto(photo, index)}
              </div>
              );
    });

  }

  renderPhoto(photo, index){
    return <div onClick = {() => this.handlePhotoOnClick(index)}>
              <Photo
                  photo = {photo}
                />
            </div>;
  }

  // the closeDelete prop passed to PhotoDeleteForm will set the state for the Photos component,
  // not the PhotoDeleteForm component.
  renderPhotoDeletionButtonAndForm(photoToDelete, index){
    return <div>
              <button className = "glyphicon glyphicon-remove open-delete-form-button"
                                onClick = {() => this.openDeleteForm(index)}    />
              { this.state.photoDeletionIndex == index ?
                    (<div id = {`photo-delete-form-background${index}`}>
                      <PhotoDeleteForm photo = {photoToDelete}
                                       index = {index}
                                       closeDelete = { () => { this.setState({photoDeletionIndex: -1}) } }/>
                    </div>)
                  : ''}
            </div>;
  }

  handlePhotoOnClick(photoViewIndex){
    this.props.fetchPhoto(this.props.photos[photoViewIndex]._id);
    this.setState({photoViewIndex});
  }

  render(){
    return (<div>
              {this.props.photo ? this.renderPhotoView() : ""}
              <div className = "row photo-row"
                      style = { {marginTop: "150px",
                                padding: "0"}}>
                  {this.renderPhotos()}
              </div>
            </div>);
  }

  renderPhotoView(){
    return this.props.photo ? <PhotoView
                                  index = {this.state.photoViewIndex}
                                  photo = {this.props.photo}
                                  photos = {this.props.photos}
                                />
                             : "";
  }

  openDeleteForm(index){
    this.setState({photoDeletionIndex: index});
  }


}

function mapStateToProps(state){
  return {photo: state.photo};
}

export default connect(mapStateToProps, {fetchPhoto})(Photos);
