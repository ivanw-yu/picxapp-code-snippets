import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';

import Photo from './Photo';
import Photos from './Photos';

import {fetchPhotosByUser,
        resetPhotos} from '../actions';

import Auth from '../services/Auth';

class UserPhotosLayout extends Component{

  constructor(props){
    super(props);
    this.state = { page : 1 };
  }


  componentDidMount(){

    this.props.resetPhotos();
    this.props.fetchPhotosByUser(this.props.userId, 1);

    window.onscroll = _.debounce(() => {
        if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
            this.setState({page : this.state.page + 1});
            this.props.fetchPhotosByUser(this.props.userId/*Auth.getUserId()*/, this.state.page);
        }
    }, 900);
  }

  render(){
    return (
              <div className = "row"
                   style = {{marginBottom: '100px'}}>
                   {  this.props.photos && this.props.photos.length > 0 ?
                          <Photos
                            photos = {this.props.photos}
                          />
                        : <div style = {{height: '500px',
                                         padding: '100px',
                                         textAlign: 'center',
                                         fontSize: '30px'}} >
                            No pictures
                          </div>
                  }
              </div>
            );
  }

  componentWillUnmount(){
    this.props.resetPhotos()
  }
}

function mapStateToProps(state){
  return {photos: state.photos};
}

export default connect(mapStateToProps, {fetchPhotosByUser, resetPhotos})(UserPhotosLayout);
