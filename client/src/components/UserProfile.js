import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import UserPhotosLayout from './UserPhotosLayout';
import UserHeader from './UserHeader';

import {fetchPhotosByUser,
        fetchUser,
        resetPhotos} from '../actions';

class UserProfile extends Component{

    componentDidMount(){
        this.props.fetchUser(this.props.match.params.id);
    }

    render(){
        return (<div style = {{padding: '50px'}}>
                    <UserHeader
                        user = {this.props.user}
                    />
                    <UserPhotosLayout
                        userId = {this.props.match.params.id}
                    />
                </div>
            );
    }

}

function mapStateToProps(state){
    return {user: state.user};
}

export default connect(mapStateToProps,{fetchPhotosByUser,
    fetchUser,
    resetPhotos})(UserProfile);
