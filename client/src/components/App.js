import React, {Component, Fragment} from 'react';
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';

import PhotoUpload from './PhotoUpload';
import Header from './Header';
import Home from './Home';
import SearchPhotosLayout from './SearchPhotosLayout';
import Register from './Register';
import Dashboard from './Dashboard';
import Login from './Login';
import DashboardProfileEdit from './DashboardProfileEdit';
import Users from './Users';
import Search from './Search';
import UserProfile from './UserProfile';
import Footer from './Footer';
import FlashMessage from './FlashMessage';
import NotFoundComponent from './NotFoundComponent';
import Auth from '../services/Auth';

class App extends Component{

  renderUsers(){
  }

  render(){
    return (
      <BrowserRouter>
        <div>
          <Header />
          <FlashMessage />
          <div className = "container-fluid">
            <Switch>
              <Route exact path = "/" component = {Home} />
              <Route exact path = "/search" component = {Search} />
              <Route exact path = "/users/:id" component = {UserProfile} />
              { Auth.isLoggedIn() ?
                ( <Switch>
                    <Route path = "/dashboard" component = { Dashboard } />
                    <Route exact path = "/logout" render = { () => <Redirect to="/login" />} />
                    <Route component={NotFoundComponent}  />
                  </Switch>
                ) :
                (
                  <Switch>
                    <Route exact path = "/register" component = {Register} />
                    <Route exact path = "/login" component = {Login} />
                    <Route component={NotFoundComponent}  />
                  </Switch>
                )
              }
            </Switch>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    );
  }

}

export default App;
