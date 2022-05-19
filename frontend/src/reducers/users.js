import {
  GET_USERS,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_REQUEST,
} from "../actions/usersAction";

let initialState = {
  loggingIn: false,
  errlogging:false,
  getusersdetail: false,
  errorgetusersdetail: false,
  getResponDataRegister: false,
  errorResponDataRegister: false,
};

const users = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        getusersdetail: action.payload.data,
        errorgetusersdetail: action.payload.errorMessage,
      };

    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: action.payload.data,
        errlogging: action.payload.errorMessage,
        
      };

    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: action.payload.logginIn,
        getusersdetail: action.payload.data,
      };

    case LOGOUT:
      return {
      };

    case REGISTER_REQUEST:
      return {
        ...state,
        getResponDataRegister: action.payload.data,
        errorResponDataRegister: action.payload.errorMessage,
      };

    default:
      return state;
  }
};

export default users;
