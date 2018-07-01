import {LOGIN_USER,
        FETCH_USER,
        UPDATE_USER} from '../actions/types';

export default function(state=null, action){
  switch(action.type){
    case LOGIN_USER:
      return action.payload;
    case FETCH_USER:
      return action.payload;
    case UPDATE_USER:
      return action.payload;
    default:
      return state;
  }
}
