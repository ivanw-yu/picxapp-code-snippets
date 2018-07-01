import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import {deleteComment} from '../actions';

import PhotoCommentForm from './PhotoCommentForm';

import Auth from '../services/Auth';

class PhotoComments extends Component{

  render(){
     return <div id = "comments"
                className = "photo-view-comments">
              {this.props.comments && this.props.comments.length ? this.renderComments() : this.renderNoCommentMessage()}
            </div>;
  }

  renderComments(){
    return _.map(this.props.comments, (commentElement, index) => {
      return <div>
                <b>{commentElement.user.username}:</b> {commentElement.comment}
                <button className = "glyphicon glyphicon-remove comment-delete-button"
                        onClick = {() => this.deleteComment(commentElement)}/>
                <p style = {{display: 'none', color: 'red'}}
                   id = {`errorMessage${commentElement._id}`}>{'Error, comment cannot be deleted at this time.'}</p>
             </div>
    });
  }

  renderNoCommentMessage(){
    return <div style = {{textAlign: "center", paddingTop: "10px"}}>
              {'No comments have been posted for this image, be the first to comment.'}
           </div>;
  }

  componentDidMount(){
    this.scrollBottom();
  }

  componentDidUpdate(){
    this.scrollBottom();
  }

  scrollBottom(){
    var commentDiv = document.getElementById('comments');
    if(commentDiv)
      commentDiv.scrollTop = commentDiv.scrollHeight;
  }

  deleteComment(comment){
    this.props.deleteComment(this.props.photoId, comment._id, (err) => {
      if(err){
        const errorMessage = document.getElementById(`errorMessage${comment.id}`);
        errorMessage.style.display = 'inline';
        setTimeout(() => {
          errorMessage.style.display = 'none';
        }, 2000);
      }
    });
  }

}

export default connect(null, {deleteComment})(PhotoComments);
