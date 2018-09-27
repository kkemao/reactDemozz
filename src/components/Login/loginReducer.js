import * as types from './LoginActionTypes';

const loginReducer = (state = {}, action) => {
  switch (action.type) {
    case types.LOGIN_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case types.LOGIN_FAIL:
      return {
        ...state,
        ...action.payload
      };
    case types.LOGIN_CHANGE_LOGIN_TYPE:
      return {
        ...state,
        ...action.payload
      };
    case types.LOGOUT:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
};

export default loginReducer;
