import React from 'react';

import {Provider} from 'react-redux';
import {BrowserRouter} from 'react-router-dom';
import {createMuiTheme, MuiThemeProvider} from '@material-ui/core/styles';

import indigo from '@material-ui/core/colors/indigo';
import deepPurple from '@material-ui/core/colors/deepPurple';

import './config/axios';

import store from './rdx/store';
import MainLayout from './layouts/MainLayout';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: deepPurple,
    secondary: indigo,
  },
});


class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <MuiThemeProvider theme={theme}>
          <BrowserRouter>
            <div className="App">
              <MainLayout/>
            </div>
          </BrowserRouter>
        </MuiThemeProvider>
      </Provider>
    );
  }

}

export default App;
