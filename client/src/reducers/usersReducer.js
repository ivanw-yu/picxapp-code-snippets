import {FETCH_USERS,
        REGISTER_USER,
        RESET_USERS} from '../actions/types';

export default function(state = null, action){

  switch(action.type){
    case FETCH_USERS:
      return state ? state.concat(action.payload) : action.payload;
    case REGISTER_USER:
      return action.payload;
    case RESET_USERS:
      return [];
    default:
      return state;
  }
}
