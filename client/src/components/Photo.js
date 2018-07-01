import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import _ from 'lodash';

import {fetchPhotos} from '../actions';
import PhotoDeleteForm from './PhotoDeleteForm';

class Photo extends Component{

  render(){
    const photo = this.props.photo;
    var source = '/photos/' + photo._id + '.' + photo.fileExtension;
    return (<div className={this.props.photoView ? "" : "photo-box"}>
              { photo ?
                      <img
                        key={this.props.photo._id}
                        src={source}
                        className={this.props.photoView ? "" : "photo" }
                      />
                :
                  <img
                    src =""
                    alt = "No Image"
                    className={this.props.photoView ? "" : "photo"}
                  />
              }
            </div>);
  }

}

export default Photo;
