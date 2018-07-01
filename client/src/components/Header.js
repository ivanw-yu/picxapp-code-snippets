import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

import SearchBar from './SearchBar';

import Auth from '../services/Auth';
import _ from 'lodash';

class Header extends Component{

  render(){
    return (
      <div className = "row">
        <nav className = "nav theme">
          <NavLink exact
                   to="/"
                   activeClassName = "nav-active">
            Picxapp
          </NavLink>
          <SearchBar />
          <div className = "nav-right">
            {
              !Auth.isLoggedIn() ?
                <div>
                  <NavLink to="/register"
                           activeClassName = "nav-active">
                    Register
                  </NavLink>
                  <NavLink to="/login"
                          activeClassName = "nav-active">
                    Login
                  </NavLink>
                </div>
                :
                <div>
                  <NavLink to="/dashboard"
                           activeClassName = "nav-active">
                    Dashboard
                  </NavLink>
                  <button onClick = {Auth.logout}
                          activeClassName = "nav-active">
                    Logout
                  </button>
                </div>
              }
          </div>
        </nav>
      </div>
    );
  }
}

export default Header;
