import { combineReducers } from 'redux'
import getset from './getset'
import users from './users'

export default combineReducers({
    getset,users
})