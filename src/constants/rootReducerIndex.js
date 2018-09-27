import { combineReducers } from 'redux';

import loginReducer from '../components/Login/loginReducer';
import mapReducer from '../components/Commons/Map/mapReducer';

const rootReducer = combineReducers({
    loginReducer,
    mapReducer
});

export default rootReducer;