import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import _ from 'lodash';

import User from './User';

class Users extends Component{

  render(){
    return <div className = "row">
            {this.renderUsers()}
           </div>
  }

  renderUsers(){
    return _.map(this.props.users, (user) => {
      return (
              <div className = "col-lrg-4 col-md-4 col-sm-12">
                <Link to = {`users/${user._id}`} >
                  <User
                    key = {user._id}
                    user = {user}
                  />
                </Link>
              </div>);
    });
  }

}

export default Users;
