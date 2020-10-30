import { combineReducers } from 'redux';
import general from './general';
import record from './record';

const rootReducer = combineReducers({
  general,
  record,
});

export default rootReducer;
