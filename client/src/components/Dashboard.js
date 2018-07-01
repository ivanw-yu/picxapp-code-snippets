import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import DashboardControlPanel from './DashboardControlPanel';

import Photos from './Photos';
import PhotoUpload from './PhotoUpload';
import DashboardProfileEdit from './DashboardProfileEdit';
import UserPhotosLayout from './UserPhotosLayout';
import UserHeader from './UserHeader';
import ProfilePictureUpload from './ProfilePictureUpload';
import DashboardPasswordEdit from './DashboardPasswordEdit';

import Auth from '../services/Auth';

import {fetchUser} from '../actions';

const ROOT_URL = "/dashboard";

class Dashboard extends Component{
  constructor(props){
    super(props);
  }


  componentDidMount(){
    this.props.fetchUser(Auth.getUserId());
  }


  render(){
    return (<div className = "row">
              <DashboardControlPanel />
                <div className = "dashboard-content-area col-sm-9">
                      <UserHeader
                          user = {this.props.user}
                        />
                    <Route exact path = {`${ROOT_URL}/`} render = {() => <UserPhotosLayout
                                                                            userId = {Auth.getUserId()} />} />
                    <Route exact path = {`${ROOT_URL}/photos/upload`} component = {PhotoUpload} />
                    <Route exact path = {`${ROOT_URL}/profile/edit`} render = {() => this.props.user ? <DashboardProfileEdit user = {this.props.user} />
                                                                                                      : ""} />
                    <Route exact path = {`${ROOT_URL}/profile/picture/upload`} render = { () => this.props.user ? <ProfilePictureUpload user = {this.props.user} />
                                                                                                                : ''} />
                    <Route exact path = {`${ROOT_URL}/password/edit`} component = {DashboardPasswordEdit} />
                </div>
            </div>);
  }

  componentWillUnmount(){
    window.onscroll = null;
  }
}

function mapStateToProps(state){
  return {user: state.user};
}

export default connect(mapStateToProps, {fetchUser})(Dashboard);
