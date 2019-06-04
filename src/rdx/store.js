import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import reducers from './reducers';

const reducer = combineReducers(reducers);
export default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)));
