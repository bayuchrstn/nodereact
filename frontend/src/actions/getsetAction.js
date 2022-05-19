import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notifySuccess = (message) => toast.success(message);
const notifyError = (message) => toast.error(message);

export const GET_SETTINGS_LIST = "GET_SETTINGS_LIST";
export const GET_SETTING_DETAIL = "GET_SETTING_DETAIL";
export const ADD_SETTING = "ADD_SETTING";
export const POST_SETTING_CREATE = "POST_SETTING_CREATE";
export const PUT_SETTING_EDIT = "PUT_SETTING_EDIT";
export const DELETE_SETTING_DELETE = "DELETE_SETTING_DELETE";

export const addSetting = () => {
  return (dispatch) => {
    dispatch({
          type: ADD_SETTING,
          payload: {
            data: false,
            errorMessage: false,
          },
        });
  };
};
export const getSettingsList = (page,size,search,sort,direction) => {
  return (dispatch) => {
    axios
      .get("http://localhost:5000/general/?page="+page+"&size="+size+"&search="+search+"&sort="+sort+"&direction="+direction)
      .then(function (response) {
        dispatch({
          type: GET_SETTINGS_LIST,
          payload: {
            data: response.data.result,
            totalItems: response.data.totalItems,
            totalPages: response.data.totalPages,
            currentPage: response.data.currentPage,
            errorMessage: false,
          },
        });
      })
      .catch(function (error) {
        dispatch({
          type: GET_SETTINGS_LIST,
          payload: {
            data: false,
            errorMessage: error.message,
          },
        });
      });
  };
};

export const getSettingDetail = (id) => {
  return (dispatch) => {
    axios
      .get("http://localhost:5000/general/" + id)
      .then(function (response) {
        dispatch({
          type: GET_SETTING_DETAIL,
          payload: {
            data: response.data,
            errorMessage: false,
          },
        });
      })
      .catch(function (error) {
        dispatch({
          type: GET_SETTING_DETAIL,
          payload: {
            data: false,
            errorMessage: error.message,
          },
        });
      });
  };
};

export const postSettingCreate = (data) => {
  return (dispatch) => {
    axios
      .post("http://localhost:5000/general", data)
      .then(function (response) {
        dispatch({
          type: POST_SETTING_CREATE,
          payload: {
            data: response.data,
            errorMessage: false,
          },
        });
        notifySuccess(response.data.msg);
        dispatch(getSettingsList());
      })
      .catch(function (error) {
        dispatch({
          type: POST_SETTING_CREATE,
          payload: {
            data: false,
            errorMessage: error.response.data,
          },
        });
        notifyError(error.response.data.msg);
      });
  };
};

export const putSettingUpdate = (data) => {
  return (dispatch) => {
    axios
      .put("http://localhost:5000/general/" + data.id, data)
      .then(function (response) {
        dispatch({
          type: PUT_SETTING_EDIT,
          payload: {
            data: response.data,
            errorMessage: false,
          },
        });
        notifySuccess(response.data.msg);
        dispatch(getSettingsList());
      })
      .catch(function (error) {
        dispatch({
          type: PUT_SETTING_EDIT,
          payload: {
            data: false,
            errorMessage: error.response.data,
          },
        });
        notifyError(error.response.data.msg);
      });
  };
};

export const delSetting = (id) => {
  return (dispatch) => {
    axios
      .delete("http://localhost:5000/general/" + id)
      .then(function (response) {
        notifySuccess(response.data.msg);
        dispatch(getSettingsList());
      })
      .catch(function (error) {
        dispatch({
          type: DELETE_SETTING_DELETE,
          payload: {
            data: false,
            errorMessage: error.message,
          },
        });
      });
  };
};

export const importSetting = (data) => {
  return (dispatch) => {
    axios
      .post("http://localhost:5000/general/upload",data)
      .then(function (response) {
        notifySuccess(response.data.msg);
        dispatch(getSettingsList());
      })
      .catch(function (error) {
        notifyError(error.response.data.msg);
      });
  };
};

