import {FETCH_PHOTOS_BY_KEYWORDS,
        FETCH_PHOTOS_BY_USER,
        RESET_PHOTOS,
        DELETE_PHOTO,
        POST_PHOTO} from '../actions/types';

export default function(state = null, action){
  switch(action.type){
    case FETCH_PHOTOS_BY_KEYWORDS:
      // concat next set of 12 photos with the previous photos array result, based on the pagination.
      return state ? state.concat(action.payload) : action.payload;
    case FETCH_PHOTOS_BY_USER:
      // concat the next set of requested photos, since pagination allows only up to 12 photos to be fetched via request.
      return state ? state.concat(action.payload) : action.payload;
    case RESET_PHOTOS:
      return [];
    case DELETE_PHOTO:
      // get rid of the photo in the photos state
      return action.payload ? state.filter(photo => photo._id != action.payload._id) : state;
    case POST_PHOTO:
      // add new picture at the front.
      return action.payload ? [action.payload].concat(state) : state;
    default:
      return state;
  }
}
