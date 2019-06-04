import axios from 'axios';
import { handleActions } from 'redux-actions';

const types = {
  LIST: 'LIST',
};

const getList = payload => ({
  type: types.LIST,
  payload,
});

const load = function () {
  return dispatch => {
    return axios.get('/api/transaction/list')
      .then(data => {
        return dispatch(getList(data.data));
      })
      .catch(() => {});
  };
};
export const transactionActions = {
  getList,
  load,
};

const initialState = {
  items: [],
};

export const transactionReducer = handleActions({
  [types.LIST]: (state, { payload } = []) => {
    return {
      ...state,
      items: payload,
    };
  },
}, initialState);
