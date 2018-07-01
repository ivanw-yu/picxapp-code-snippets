import {UPDATE_FLASH_MESSAGE,
        RESET_FLASH_MESSAGE} from '../actions/types';

export default function(state= null, action){
  switch(action.type){
    case UPDATE_FLASH_MESSAGE:
      return action.payload;
    case RESET_FLASH_MESSAGE:
      return null;
    default:
      return state;
  }
}
