import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {postPhotoComment} from '../actions';

import Auth from '../services/Auth';

class PhotoCommentForm extends Component{

  render(){
    return Auth.isLoggedIn() ? this.renderPhotoCommentForm() : this.renderLockedPhotoCommentForm();
  }

  renderPhotoCommentForm(){
    return <form  className = "form-horizontal photo-comment-form"
                  onSubmit = {(event) => this.handleCommentSubmit(event)} >
              <div className = "form-group">
                <textarea
                       id = "comment"
                       name = "comment"
                       className = "comment form-control"></textarea>
              </div>
              <button
                  className = "btn btn-primary"
                  disabled = {!Auth.isLoggedIn()}>
                  Comment
              </button>
           </form>;
  }

  renderLockedPhotoCommentForm(){
    return <div className = "photo-comment-form-locked">
              <p>Please <Link to = "/login"> {'log-in'}  </Link> {'to post comments for this photo.'}</p>
              <div className = "glyphicon glyphicon-lock" />
           </div>
  }

  handleCommentSubmit(event){
    event.preventDefault();
    const commentTextarea = document.getElementById('comment');
    const comment = commentTextarea.value;
    const data = {user: Auth.getUserId(), comment}
    this.props.postPhotoComment(this.props.photoId, data);
    commentTextarea.value = "";
  }

}

export default connect(null, {postPhotoComment})(PhotoCommentForm);
