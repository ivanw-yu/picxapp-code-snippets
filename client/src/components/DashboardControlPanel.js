import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

const ROOT_URL = "/dashboard";

class DashboardControlPanel extends Component{

  constructor(props){
    super(props);
  }

  render(){
    return (
      <ul className = "col-sm-3 dashboard-side-nav">
        <li><NavLink exact
                     to = {`${ROOT_URL}`}
                     activeClassName = 'active' >My Photos</NavLink></li>
        <li><NavLink exact
                     to = {`${ROOT_URL}/photos/upload`}
                     activeClassName = 'active' > Upload Photo </NavLink></li>
        <li><NavLink exact
                     to = {`${ROOT_URL}/profile/edit`}
                     activeClassName = 'active' > Edit Profile </NavLink></li>
        <li><NavLink exact
                     to = {`${ROOT_URL}/profile/picture/upload`}
                     activeClassName = 'active' > Update Profile Picture </NavLink></li>
        <li><NavLink exact
                     to = {`${ROOT_URL}/password/edit`}
                     activeClassName = 'active' > Edit Password </NavLink></li>

      </ul>
    );
  }
}

export default DashboardControlPanel;
