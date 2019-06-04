import {reducer as formReducer} from 'redux-form';
import {routerReducer} from 'react-router-redux';
import {transactionReducer} from "./transaction";
import {userReducer} from "./user";

export default {
  form: formReducer,
  router: routerReducer,
  transaction: transactionReducer,
  user: userReducer,
};
