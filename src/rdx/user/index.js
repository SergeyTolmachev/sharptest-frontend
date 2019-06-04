import axios from 'axios';
import { handleActions } from 'redux-actions';

const types = {
  AUTHORIZE: 'AUTHORIZE',
  UNAUTHORIZE: 'UNAUTHORIZE',
};

const authorize = payload => ({
  type: types.AUTHORIZE,
  payload,
});

const unauthorize = payload => ({
  type: types.UNAUTHORIZE,
  payload,
});

const checkAuth = function () {
  return dispatch => {
    return axios.post('/api/rpc/me')
      .then(({data}) => {
        return dispatch(authorize({user: data}));
      })
      .catch(() => {
        return dispatch(unauthorize())
      });
  };
};

export const userActions = {
  authorize,
  checkAuth,
  unauthorize,
};

const initialState = {
  token: localStorage.getItem('token'),
  user: undefined
};

export const userReducer = handleActions({
  [types.AUTHORIZE]: (state, { payload } = {}) => {
    return {
      ...state,
      ...payload,
    };
  },
  [types.UNAUTHORIZE]: (state, { payload } = {}) => {
    return {
      ...state,
      token: null,
      user: null,
    };
  },
}, initialState);
