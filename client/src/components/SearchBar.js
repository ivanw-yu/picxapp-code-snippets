import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';
import {reduxForm} from 'redux-form';

import {fetchPhotos,
        fetchUsers,
        resetPhotos,
        resetUsers,
        updateSearchKeywords,
        updateSearchCategory,
        updateSearchPage} from '../actions';

import _ from 'lodash';

class SearchBar extends Component{

  constructor(props){
    super(props);
    this.handleKeywordsOnChange = _.debounce(this.handleKeywordsOnChange, 600).bind(this);
  }


  render(){
    return (
      <div className = "nav-left form-group search-bar">
        <form className = "search-bar-form"
              >
            <select name="category"
                    className = "category-dropdown"
                    onChange = {event => this.handleCategoryOnChange(event.target.value)}>
              <option value = "photos">Photos</option>
              <option value = "users">Users</option>
            </select>
            <input id = "keywords"
                   type = "text"
                   name = "keywords"
                   className = "form-control keyword-input"
                   onChange = {event => this.handleKeywordsOnChange(event.target.value)} />
        </form>
      </div>
    )
  }

  handleKeywordsOnChange(value){

      this.props.updateSearchKeywords(value);
      this.props.updateSearchPage(1);

      if(this.props.category == 'photos')
        this.props.fetchPhotos(this.props.keywords, this.props.page);
      else if(this.props.category == 'users')
        this.props.fetchUsers(this.props.keywords, this.props.page);

      if(this.props.history.location.pathname !== '/search'){
        this.props.history.push('/search');
      }
  }

  handleCategoryOnChange(value){
    this.props.updateSearchCategory(value);
    this.props.updateSearchPage(1);
    if(value == 'photos')
      this.props.fetchPhotos(this.props.keywords, this.props.page);
    else if(value == 'users')
      this.props.fetchUsers(this.props.keywords, this.props.page);
    if(this.props.history.location.pathname !== '/search/'){
      this.props.history.push('/search');
    }
  }
}

function mapStateToProps(state){
  return {keywords: state.search.keywords,
          category: state.search.category,
          page: state.search.page};
}

export default withRouter(connect(mapStateToProps,
                                  {fetchPhotos,
                                         fetchUsers,
                                         resetPhotos,
                                         resetUsers,
                                         updateSearchKeywords,
                                         updateSearchCategory,
                                         updateSearchPage})(SearchBar));
