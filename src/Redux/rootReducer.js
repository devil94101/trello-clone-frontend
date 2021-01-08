import { combineReducers } from "redux";
import { userReducer } from "./user/userReducer";
import {listReducer} from './List/listReducer'
export default combineReducers({
  user: userReducer,
  list:listReducer
});