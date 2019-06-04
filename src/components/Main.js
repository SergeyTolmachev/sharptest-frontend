import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import {userActions} from "../rdx/user";

class Main extends React.Component {

  render() {
    return (
      <Grid container>
        <Grid item xs/>
        <Grid item xs={8}>
          <Typography variant="subtitle1" color="inherit">Welcome</Typography>
          <Typography variant="body2" color="inherit">To Parrots Wings website</Typography>
        </Grid>
        <Grid item xs/>
      </Grid>
    )
  }
}

function mapStateToProps(state, props) {
  return {
    userState: state.user,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
