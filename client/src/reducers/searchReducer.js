import {UPDATE_SEARCH_KEYWORDS,
        UPDATE_SEARCH_CATEGORY,
        UPDATE_SEARCH_PAGE,
        UPDATE_SEARCH_COUNT,
        UPDATE_SEARCH_MESSAGE} from '../actions/types';

export default function(state = null, action){
  switch(action.type){
    case UPDATE_SEARCH_KEYWORDS:
      return {...state, keywords: action.payload || ""};
    case UPDATE_SEARCH_CATEGORY:
      return {...state, category: action.payload};
    case UPDATE_SEARCH_PAGE:
      return {...state, page: action.payload};
    case UPDATE_SEARCH_COUNT:
      return {...state, count: action.payload};
    case UPDATE_SEARCH_MESSAGE:
      return {...state, message: action.payload};
    default:
      return state;
  }
}
