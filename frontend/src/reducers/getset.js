import {
  GET_SETTINGS_LIST,
  GET_SETTING_DETAIL,
  POST_SETTING_CREATE,
  PUT_SETTING_EDIT,
  DELETE_SETTING_DELETE,
  ADD_SETTING,
} from "../actions/getsetAction";

let initialState = {
  getSettingsList: false,
  errorSettingsList: false,
  addSettingResult: false,
  erroraddSettingResult: false,
  getSettingDetail: false,
  errorSettingDetail: false,
  getResponDataSetting: false,
  errorResponDataSetting: false,
};

const getset = (state = initialState, action) => {
  switch (action.type) {
    case ADD_SETTING:
      return {
        ...state,
        getSettingDetail: action.payload.data,
        errorSettingDetail: action.payload.errorMessage,
      };

    case GET_SETTINGS_LIST:
      return {
        ...state,
        getSettingsList: action.payload.data,
        getSettingsList_totalItems: action.payload.totalItems,
        getSettingsList_currentPage: action.payload.currentPage,
        getSettingsList_totalPages: action.payload.totalPages,
        errorSettingsList: action.payload.errorMessage,
      };

    case GET_SETTING_DETAIL:
      return {
        ...state,
        getSettingDetail: action.payload.data,
        errorSettingDetail: action.payload.errorMessage,
      };

    case POST_SETTING_CREATE:
      return {
        ...state,
        addSettingResult: action.payload.data,
        erroraddSettingResult: action.payload.errorMessage,
      };

    case PUT_SETTING_EDIT:
      return {
        ...state,
        getResponDataSetting: action.payload.data,
        errorResponDataSetting: action.payload.errorMessage,
      };

    case DELETE_SETTING_DELETE:
      return {
        ...state,
        getResponDataSetting: action.payload.data,
        errorResponDataSetting: action.payload.errorMessage,
      };

    default:
      return state;
  }
};

export default getset;
