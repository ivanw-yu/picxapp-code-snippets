import React, {Component} from 'react';
import {connect} from 'react-redux';

import Photo from './Photo';
import PhotoDetails from './PhotoDetails';
import PhotoComments from './PhotoComments';
import PhotoCommentForm from './PhotoCommentForm';
import {fetchPhoto, resetPhoto} from '../actions';


/*
  has index and photos passed to it from Photos component.
*/
class PhotoView extends Component{

    constructor(props){
      super(props);
      this.state = {index : this.props.index || 0};
      this.photoNavButtonPress = this.photoNavButtonPress.bind(this);
    }

    componentDidMount(){
      window.addEventListener('keydown', this.photoNavButtonPress);
    }

    render(){
      return this.props.photo ? this.renderPhoto() : "";
    }

    renderPhoto(){
      return this.props.photo ? (
              <div className = "photo-view-background">
                <div className = "photo-view-layout">
                  {this.renderExitButton()}
                  <div className = "photo-view">
                    <div className = "photo-view-image">
                      <Photo
                        photo = {this.props.photo}
                        photoView = {true}
                      />
                    </div>
                    <div className = "photo-view-detail-and-comments">
                      <div className = "photo-view-details">
                        <PhotoDetails photo = {this.props.photo} />
                      </div>
                      <div className = "photo-view-comments">
                        <PhotoComments  photoId = {this.props.photo._id}
                                        comments = {this.props.photo.comments} />
                      </div>
                        <PhotoCommentForm
                          photoId = {this.props.photo._id}
                        />
                    </div>
                    {this.renderNavigationButtons()}
                  </div>
                </div>


              </div>
            )
            : "";
    }

    renderNavigationButtons(){
      return (<div className = "photos-navigation-button-area">
                <button className = "glyphicon glyphicon-chevron-left"
                        id = "left-button"
                        onClick = {() => this.changePhoto(-1)}
                />
                <button className = "glyphicon glyphicon-chevron-right"
                        id = "right-button"
                        onClick = {() => this.changePhoto(1)}
                />
              </div>);
    }

    renderExitButton(){
      return (<button onClick = {() => this.handleExitPhotoViewClick()}
              className = "exit-photo-view-button">
                <span className = "glyphicon glyphicon-remove" />
             </button>);
    }

    handleExitPhotoViewClick(){
      this.props.resetPhoto();
    }

    photoNavButtonPress(e){
      switch(e.key){
        case 'ArrowRight':
          document.getElementById('right-button').click();
          break;
        case 'ArrowLeft':
          document.getElementById('left-button').click();
      }
    }

    changePhoto(offset){
      const currentIndex = this.state.index,
            numberOfPhotos = this.props.photos.length;
      const index = (currentIndex + (offset)) >= 0 ? (currentIndex + offset) % numberOfPhotos
                                                   : numberOfPhotos - 1;
      this.props.fetchPhoto(this.props.photos[index]._id);
      this.setState({index});
    }

    componentWillUnmount(){
      window.removeEventListener('keydown', this.photoNavButtonPress, false);
      this.props.resetPhoto();
    }
}

function mapStateToProps(state){
  return {photo: state.photo};
}

export default connect(mapStateToProps, {fetchPhoto, resetPhoto})(PhotoView);
