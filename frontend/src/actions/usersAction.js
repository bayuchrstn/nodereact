import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

export const GET_USERS = "GET_USERS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGOUT = "LOGOUT";
export const REGISTER_REQUEST = "REGISTER_REQUEST";

export const Login = (data) => {
  return (dispatch) => {
    axios
      .post("http://localhost:5000/login", data)
      .then(function (response) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            data: response.data,
            errorMessage: false,
            loggingIn:true
          },
        });
        notifySuccess(response.data.msg);
      })
      .catch(function (error) {
        dispatch({
          type: LOGIN_FAIL,
          payload: {
            data: false,
            errorMessage: error.response.data,
          },
        });
        notifyError(error.response.data.msg);
      });
  };
};

export const Logout = () => {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}