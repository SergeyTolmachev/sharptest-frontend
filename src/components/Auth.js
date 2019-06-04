import React from 'react';
import axios from 'axios';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {userActions} from "../rdx/user";


class Form extends React.Component {

  state = {
    email: '',
    password: '',
  }

  handleChange = (name) => event => {
    this.setState({...this.state, [name]: event.target.value});
  }

  handleClick = (event) => {
    const {email, password} = this.state;
    axios.post('/api/rpc/auth', { email, password })
      .then((result) => {
        const {data} = result;
        localStorage.setItem('token', data.token);
        this.props.userActions.authorize(data);
        window.location.replace('/transaction');
      }).catch((error)=>{
      console.log(error);
    });
  }

  render() {
    const {email, password} = this.state;

    return (<React.Fragment>
      <Typography variant="subtitle1" color="inherit">Login</Typography>
      <TextField id="email"
                 label="Email"
                 value={email}
                 onChange={this.handleChange('email')}
                 margin="dense"
                 fullWidth
                 variant="outlined"/>
      <TextField id="password"
                 label="Password"
                 value={password}
                 onChange={this.handleChange('password')}
                 margin="dense"
                 type="password"
                 fullWidth
                 variant="outlined"/>
      <Button color="primary" variant="contained" fullWidth onClick={this.handleClick}>
        Login
      </Button>
    </React.Fragment>)
  }
}


class Auth extends React.Component {
  render() {
    const {userState} = this.props;
    return (
      <Grid container>
        <Grid item xs/>
        <Grid item xs={8}>
          {
            (!userState || !userState.user) && <Form userActions={this.props.userActions}/>
          }
          {
            userState && userState.user && (<Typography>{"You are authorized"}</Typography>)
          }
        </Grid>
        <Grid item xs/>
      </Grid>
    )
  }
}

const AuthForm = reduxForm({
  form: 'auth',
})(Auth);


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

export default connect(mapStateToProps, mapDispatchToProps)(AuthForm);
