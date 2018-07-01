import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

// import {fetchPhotos} from '../actions';
import _ from 'lodash';

import {fetchPhotos} from '../actions';
import Photo from './Photo';


class SearchPhotosLayout extends Component{

  constructor(props){
    super(props);
    this.state = {page : 1, keywords: this.props.keywords};
  }

  componentDidMount(){
    window.onscroll = _.debounce( () => {
      if ((window.innerHeight + window.pageYOffset) >= document.body.offsetHeight) {
          this.setState({page : this.state.page + 1});
          this.props.fetchPhotos(this.props.keywords, this.state.page);
      }
    }, 900).bind(this);

    if(this.state.keywords != this.props.keywords){
      this.setState({page: 1, keywords: this.props.keywords});
      this.props.fetchPhotos(this.props.keywords, 1);
    }
  }

  renderPhotos(){
    const photos = this.props.photos;
    return _.map(this.props.photos, (photo) => {
      return ( <Photo
                  photo = {photo}
                />);
    });
  }

  render(){
    return (<div>
              <h2 className = "search-photos-result-header">{this.props.photos && this.props.photos.length ? `Showing first ${this.props.photos.length} results.`
                                                                 : "No Results found."}</h2>
              <div className = "row photo-row"
                    style = { {marginTop: "150px",
                              padding: "0"}}>
                {this.renderPhotos()}
                <br />
              </div>
            </div>);
  }
}

function mapStateToProps(state){
  return {photos: state.photos,
          keywords: state.keywords};
}

export default connect(mapStateToProps, {fetchPhotos})(SearchPhotosLayout);
