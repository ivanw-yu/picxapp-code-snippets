import React, {Component} from 'react';
import {connect} from 'react-redux';

import _ from 'lodash';

import Photos from './Photos';
import Users from './Users';

import {fetchPhotos,
        fetchUsers,
        resetPhotos,
        updateSearchPage} from '../actions';

/*
  Search states (message, page, keywords and category) will reset for every time the Search component
  page is revisited.
*/
class Search extends Component{

  componentDidMount(){

    window.onscroll = _.debounce( () => {
      if (this.props[this.props.category].length == this.props.count){
        return;
      }
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
          this.props.updateSearchPage(this.props.page + 1);
          this.fetchResults();
      }
    }, 900).bind(this);

  }

  render(){

    switch(this.props.category){

      case 'photos':
        return (
            <div>
              {this.renderSearchHeader()}
              {this.props.photos && this.props.photos.length > 0 ?
                <Photos
                  photos = {this.props.photos}
                />
                : <div style = {{height: "800px"}}> </div>
              }
            </div>
        );

      case 'users':

        return (
            <div>
              {this.renderSearchHeader()}
              {this.props.users && this.props.users.length > 0 ?
                <Users
                  users = {this.props.users}
                />
                : <div style = {{height: "800px"}}> </div> }
            </div>
        );
    }
  }

  renderSearchHeader(){
    const category = this.props.category;
    const searchResult = category == 'photos'
                          ? this.props.photos
                          : (category == 'users'
                                ? this.props.users
                                : null);
    return <h2 className = "search-photos-result-header">
                {this.props.message || `Showing ${searchResult.length} of ${this.props.count} ${category} for search keywords '${this.props.keywords}'.`}
           </h2>;
  }

  fetchResults(){
    switch(this.props.category){
      case 'photos':
          this.props.fetchPhotos(this.props.keywords, this.props.page);
          break;
      case 'users':
          this.props.fetchUsers(this.props.keywords, this.props.page);
          break;
    }
  }

}

function mapStateToProps(state){
   let relevantStates = { keywords: state.search.keywords,
                          page: state.search.page,
                          category: state.search.category,
                          count: state.search.count,
                          message: state.search.message};

   relevantStates[relevantStates.category] = state[relevantStates.category];
   return relevantStates;
}

export default connect(mapStateToProps, {
  fetchPhotos,
  fetchUsers,
  resetPhotos,
  updateSearchPage
})(Search);
