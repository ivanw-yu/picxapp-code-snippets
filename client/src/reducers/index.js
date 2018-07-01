import {combineReducers} from 'redux';
import {reducer as reduxForm} from 'redux-form';

import usersReducer from './usersReducer';
import userReducer from './userReducer';
import photosReducer from './photosReducer';
import photoReducer from './photoReducer';
import searchReducer from './searchReducer';
import flashMessageReducer from './flashMessageReducer';


// the different values the reduxForm reducer
// can take are: photoForm, userForm, and keywordsForm (to get search bar keyword)
const reducers = combineReducers({
  users : usersReducer,
  user: userReducer,
  photos : photosReducer,
  photo: photoReducer,
  flashMessage: flashMessageReducer,
  search: searchReducer,
  form: reduxForm
});

export default reducers;
