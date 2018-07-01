import {FETCH_USERS,
        FETCH_USER,
        FETCH_PHOTO,
        FETCH_PHOTOS_BY_KEYWORDS,
        FETCH_PHOTOS_BY_USER,
        DELETE_PHOTO,
        DELETE_COMMENT,
        POST_PHOTO,
        RESET_PHOTOS,
        RESET_PHOTO,
        REGISTER_USER,
        LOGIN_USER,
        RESET_USERS,
        UPDATE_SEARCH_CATEGORY,
        UPDATE_SEARCH_KEYWORDS,
        UPDATE_SEARCH_PAGE,
        UPDATE_SEARCH_COUNT,
        UPDATE_SEARCH_MESSAGE,
        UPDATE_PHOTO_COMMENTS,
        UPDATE_USER,
        UPDATE_USER_PROFILE_PICTURE,
        UPDATE_USER_PASSWORD,
        UPDATE_FLASH_MESSAGE,
        RESET_FLASH_MESSAGE} from './types';


import axios from 'axios';

import Auth from '../services/Auth';

export const fetchUsers = (keywords, page) => async dispatch => {
  let queryParams = keywords ? `keywords=${keywords}` : '';
  queryParams += page ? (keywords ? "&" : "") + `page=${page}` : '';
  try{
    const res = await axios.get(`/api/users?${queryParams}`);

    if(res.data && res.data.success){
      dispatch({type: UPDATE_SEARCH_COUNT, payload: res.data.count});
      dispatch({type: FETCH_USERS, payload: res.data.users});
    }
  }catch(e){
    console.log("ERROR fetching users");
    updateFlashMessage(getMessageFromError(e, 'Error occurred while fetching users result.'), false, dispatch);
  }
}

export const fetchUser = (id) => async dispatch => {
  try{
    const res = await axios.get(`/api/users/${id}`);
    dispatch({type: FETCH_USER, payload: res.data.user});
  }catch(e){
    console.log("ERROR fetching user");
    updateFlashMessage(getMessageFromError(e, 'Error occurred while fetching user.'), false, dispatch);
  }
}

export const fetchPhotos = (keywords, page, lastId) => async dispatch => {
  let queryParams = keywords ? `keywords=${keywords}` : '';
  queryParams += page ? (keywords ? "&" : "") + `page=${page}` : '';

  try{
    const res = await axios.get(`/api/photos?${queryParams}`);
    if(res.data && res.data.success){
      dispatch({type: UPDATE_SEARCH_COUNT, payload: res.data.count});
      dispatch({type: UPDATE_SEARCH_MESSAGE, payload: res.data.message || ''});
      dispatch({type: FETCH_PHOTOS_BY_KEYWORDS, payload: res.data.photos});
      return;
    }
      updateFlashMessage('Error occurred while fetching photos result.', false, dispatch);
  }catch(e){
    console.log("ERROR fetching photos");
    updateFlashMessage(getMessageFromError(e, 'Error occurred while fetching photos result.'), false, dispatch);
  }
}

export const fetchPhoto = (id) => async dispatch => {
  try{
    const res = await axios.get(`/api/photos/${id}`);
    dispatch({type: FETCH_PHOTO, payload: res.data.photo });
  }catch(e){
    console.log("ERROR fetching photos");
    updateFlashMessage(getMessageFromError(e, 'Error occurred while fetching photo.'), false, dispatch);
  }
};

export const fetchPhotosByUser = (userId, page = 1) => async dispatch => {
  try{
    const res = await axios(`/api/photos/user/${userId}?page=${page}`);
    dispatch({type: UPDATE_SEARCH_COUNT, payload: res.data.count});
    dispatch({type: FETCH_PHOTOS_BY_USER, payload: res.data.photos});
  }catch(e){
    console.log("ERROR fetching user's photos");
    updateFlashMessage(getMessageFromError(e, 'Error occurred while fetching user\'s photos.'), false, dispatch);
  }
};

export const postPhoto = (data, callback) => async dispatch => {
  try{
    const res = await axios({
      method: 'post',
      url: '/api/photos',
      data,
      headers : {
        'Content-Type' : 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      //dispatch({type: POST_PHOTO, payload: res.data.photo});
      updateFlashMessage('Photo successfully posted!', true, dispatch);
      return callback(null);
    }

    updateFlashMessage('Unable to save photo at this time.', false, dispatch);
    callback(true);
  }catch(e){
    updateFlashMessage(getMessageFromError(e), false, dispatch);
    callback(e);
  }
};

export const postPhotoComment = (id, data) => async dispatch => {
  try{
    const res = await axios({
      method: 'post',
      url: `/api/photos/${id}/comments`,
      data: {user: data.user, comment: data.comment},
      headers: {
        'Content-Type': 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      return dispatch({type: UPDATE_PHOTO_COMMENTS, payload: res.data.photo});
    }
    updateFlashMessage('Unable to save photo at this time.', false, dispatch);
  }catch(e){
    updateFlashMessage(getMessageFromError(e), false, dispatch);
  }

};

export const registerUser = (data, callback) => async dispatch => {
  try{
    const res = await axios({
      method: 'post',
      url: '/api/users',
      data
    });

    if(res.data && res.data.success){
      dispatch({type: REGISTER_USER, payload: res.data});
      updateFlashMessage('You have successfully registered an account!', true, dispatch);
      return callback(res.data);
    }
    updateFlashMessage('Error registering an account.', false, dispatch);
  }catch(e){
    updateFlashMessage(getMessageFromError(e, 'Error registering an account'), false, dispatch);
    return callback(e.response.data);
  }
  callback({success: false});
};

export const resetPhotos = () => dispatch => {
  dispatch({type: UPDATE_SEARCH_PAGE, payload: 1});
  dispatch({type: RESET_PHOTOS, payload: []});
};

export const resetPhoto = () => dispatch => {
  dispatch({type: RESET_PHOTO, payload: null});
};

export const resetUsers = () => dispatch => {
  dispatch({type: RESET_USERS, payload: []});
};

export const deletePhoto = (id, callback) => async dispatch => {
  try{
    const res = await axios({
      method: 'delete',
      url: `/api/photos/${id}`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      dispatch({type: DELETE_PHOTO, payload: res.data.photo});
      updateFlashMessage('Photo deleted successfully.', true, dispatch);
    }else{
      updateFlashMessage('Error occurred in deleting photo.', false, dispatch);
    }
  }catch(e){
    updateFlashMessage(getMessageFromError(e, 'Error occurred in deletin3g photo.'), false, dispatch);
  }
  callback();
}

export const deleteProfilePicture = (userId) => async dispatch => {
  try{
    const res = await axios({
      method: 'delete',
      url: `/api/users/${userId}/profilePicture`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': Auth.getToken()
      }
    });

    if(res.data && res.data.success){
      dispatch({type: UPDATE_USER, payload: res.data.user});
      return updateFlashMessage('Successfully deleted profile picture!', true, dispatch);
    }
    updateFlashMessage('Error deleting profile picture.', false, dispatch);
  }catch(e){
    updateFlashMessage(getMessageFromError(e), false, dispatch);
  }
}

export const deleteComment = ( photoId, commentId, callback ) => async dispatch => {

  try{
    const res = await axios({
      method: 'delete',
      url: `/api/photos/${photoId}/comments/${commentId}`,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      dispatch({type: DELETE_COMMENT, payload: res.data.photo});
      return callback(null);
    }
    callback(true);
  }catch(err){
    callback(err);
  }
};

export const updateSearchKeywords = (keywords) => dispatch => {
  resetSearch(dispatch);
  dispatch({type: UPDATE_SEARCH_KEYWORDS,  payload: keywords});
};

export const updateSearchPage = (page) => dispatch => {
  dispatch({type: UPDATE_SEARCH_PAGE, payload: page});
}

export const updateSearchCategory = (category) => dispatch => {
  resetSearch(dispatch);
  dispatch({type: UPDATE_SEARCH_CATEGORY, payload: category});
}

function resetSearch(dispatch){
  dispatch({type: RESET_PHOTOS, payload: []});
  dispatch({type: RESET_USERS, payload: []});
  dispatch({type: UPDATE_SEARCH_PAGE, payload: 1});
}

export const loginUser = (data, callback) => async dispatch => {

  const user = {
    emailOrUsername: data.emailOrUsername,
    password: data.password
  }
  try{
    const res = await axios({
      method: 'post',
      url: '/api/users/login',
      data: user
    });

    if(res.data && res.data.success){
      dispatch({type: LOGIN_USER, payload: res.data.user});
      return callback(res.data);
    }
  }catch(e){
    return callback(e.response.data);
  }
}

export const updateUser = (id, user, callback) => async dispatch => {
  try{
    const res = await axios({
      method: 'patch',
      url: `/api/users/${id}`,
      data: user,
      headers: {
        'Content-Type': 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      dispatch({type: UPDATE_USER, payload: res.data.user });
      callback(res.data);
    }else{
      dispatch({type: UPDATE_USER, payload: null});
    }
  }catch(e){
    updateFlashMessage(getMessageFromError(e, 'Error occurred while updating user.'), false, dispatch);
    return callback(e.response.data);
  }
}

export const updateUserPassword = (id, password, newPassword) => async dispatch => {
  try{
    const res = await axios({
      method: 'patch',
      url: `/api/users/${id}/password`,
      data: {
        password,
        newPassword
      },
      headers: {
        'Content-Type' : 'application/json',
        'x-auth': Auth.getToken()
      }
    });

    if(res.data && res.data.success){
      dispatch({type: UPDATE_USER_PASSWORD, payload: res.data.user});
      return updateFlashMessage('You have successfully changed your password!', true, dispatch);
    }

    return updateFlashMessage('Error in updating password', false, dispatch);
  }catch(e){
    updateFlashMessage(getMessageFromError(e, 'Error in updating password'), false, dispatch);
  }
};

export const updateProfilePicture = (id, data) => async dispatch => {
  try{
    const res = await axios({
      method: 'patch',
      url: `/api/users/${id}/profilePicture`,
      data,
      headers : {
        'Content-Type' : 'application/json',
        'x-auth': Auth.getToken()
      }
    });
    if(res.data && res.data.success){
      dispatch({type: UPDATE_USER, payload: res.data.user});
      return updateFlashMessage('Successfully updated profile picture!', true, dispatch);
    }
    updateFlashMessage('Error updating profile picture.', false, dispatch);
  }catch(e){
    updateFlashMessage(getMessageFromError(e, 'Error updating profile picture.'), false, dispatch);
  }
};

// updating error message should result in reseting the error message a time after.
function updateFlashMessage(message,success, dispatch){
  dispatch({type: UPDATE_FLASH_MESSAGE, payload: {message, success}});
  setTimeout(() => { resetFlashMessage(dispatch) }, 2000);
};

function resetFlashMessage(dispatch){
  dispatch({type: RESET_FLASH_MESSAGE, payload: null});
};

// gets the error message, or a backup message from axios error response.
function getMessageFromError(error, backupMessage){
  const errorMessage = error.response ? (error.response.data ? error.response.data.message : backupMessage)
                                  : backupMessage;
  return errorMessage;
}
