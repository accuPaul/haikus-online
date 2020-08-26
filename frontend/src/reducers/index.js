import { combineReducers } from 'redux';
import haikuReducer from './haikuReducer';

export default combineReducers({
    haiku: haikuReducer
});