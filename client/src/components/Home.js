import React, {Component} from 'react';
import {connect} from 'react-redux';

import {resetPhotos,fetchPhotos} from '../actions';

import Photos from './Photos';
import Auth from '../services/Auth';

class Home extends Component{

  componentDidMount(){
      this.props.resetPhotos();
      this.props.fetchPhotos('', 1);
      window.onscroll = null;
  }

  render(){
    return (
      <div>
        <div className = "home-jumbotron">
          <div className = "home-header">
            <h1 className = "home-title">Picxapp</h1>
            <p> {'Upload and share pictures'} </p>
            <p> Browse and comment on photos. </p>
            <p> {'See other user\'s photo collections.'} </p>
            {!Auth.isLoggedIn() ?
                    <div>
                      <button className = "btn btn-primary"
                              onClick={(e) => this.props.history.push('/login')}>Login</button>
                      <button className = "btn btn-primary"
                              onClick={(e) => this.props.history.push('/register')}>Register</button>
                    </div>
                  : <div>
                      <button className = "btn btn-primary"
                              onClick={(e) => this.props.history.push('/dashboard/photos/upload')}>
                              Upload Photos
                      </button>
                    </div>}
          </div>
        </div>
        <div className = "home-photos-background">
          <div className = "row home-photos">
            <h1>Recent Photos</h1>
            <Photos photos={this.props.photos} />
          </div>
        </div>
      </div>);
  }

}

function mapStateToProps(state){
  return {photos: state.photos};
}

export default connect(mapStateToProps, {resetPhotos,fetchPhotos})(Home);
