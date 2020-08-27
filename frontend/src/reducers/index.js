import { combineReducers } from 'redux';
import haikuReducer from './haikuReducer';
import errorReducer from './errorReducer';
import authReducer from './authReducer';

export default combineReducers({
    haiku: haikuReducer,
    auth: authReducer,
    error: errorReducer
});