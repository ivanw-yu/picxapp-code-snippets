import {FETCH_PHOTO,
        RESET_PHOTO,
        UPDATE_PHOTO_COMMENTS,
        DELETE_COMMENT} from '../actions/types';

export default function(state=null, action){
  switch(action.type){
    case FETCH_PHOTO:
      return action.payload;
    case UPDATE_PHOTO_COMMENTS:
      return action.payload;
    case RESET_PHOTO:
      return null;
    case DELETE_COMMENT:
      return action.payload || null;
    default:
      return state;
  }
}
