import React from 'react';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import {userActions} from "../rdx/user";
import DialogModal from "./Dialog";

import axios from "axios/index";

class Form extends  React.Component {
  state = {
    email: '',
    name: '',
    password: '',
    confirmPassword: '',
    openDialog: false,
    dialogText: '',
  }

  handleChange = (name) => event => {
    this.setState({...this.state, [name]: event.target.value});
  }

  handleClick = (event) => {
    const {email, password, confirmPassword, name} = this.state;
    if (!email) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Email cannot be empty'});
    }
    if (email && !/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i.test(email)) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Email must be a valid email'});
    }
    if (!password) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Password cannot be empty'});
    }
    if (password && (password.length < 3 || password.length > 15)) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Password muat be 3 letters at least and 15 at max'});
    }
    if (!name) {
      return  this.setState({...this.state, openDialog: true, dialogText: 'Name cannot be empty'});
    }
    if (name && !/^[a-z\s]+$/i.test(name)) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Name has to be valid name without numbers'});
    }
    if (password !== confirmPassword) {
      return this.setState({...this.state, openDialog: true, dialogText: 'Password and confirmPassword must be the same'});
    }

    axios.post('/api/user', { email, password, name })
      .then((result) => {
        const {data} = result;
        localStorage.setItem('token', data.token);
        this.props.userActions.authorize(data);
        window.location.replace('/transaction');
      }).catch((error)=>{
        const { response } = error;
        if (response && response.data && response.data.email){
          return this.setState({...this.state, openDialog: true, dialogText: 'Email must be unique'});
        }
      return this.setState({...this.state, openDialog: true, dialogText: 'There is an error'});
    });

  }

  handleClose = () => {
    this.setState({...this.state, openDialog: false});
  }

  render() {
    const {email, password, name, confirmPassword, openDialog, dialogText} = this.state;
    return (
        <React.Fragment>
          <Typography variant="subtitle1" color="inherit">Registration</Typography>
          <TextField id="email"
                     label="Email"
                     value={email}
                     onChange={this.handleChange('email')}
                     margin="dense"
                     fullWidth
                     required
                     variant="outlined"/>
          <TextField id="name"
                     label="Name"
                     value={name}
                     onChange={this.handleChange('name')}
                     margin="dense"
                     fullWidth
                     required
                     variant="outlined"/>
          <TextField id="password"
                     label="Password"
                     value={password}
                     onChange={this.handleChange('password')}
                     margin="dense"
                     type="password"
                     fullWidth
                     required
                     variant="outlined"/>
          <TextField id="confirmPassword"
                     label="Confirm Password"
                     value={confirmPassword}
                     onChange={this.handleChange('confirmPassword')}
                     margin="dense"
                     type="password"
                     fullWidth
                     required
                     variant="outlined"/>
          <Button color="primary" variant="contained" fullWidth onClick={this.handleClick}>
            Registration
          </Button>
          <DialogModal openDialog={openDialog} dialogText={dialogText} handleCloseDialog={this.handleCloseDialog}/>
        </React.Fragment>
    )
  }
}

class Registration extends React.Component {

  render() {
    const {userState} = this.props;
    return (
      <Grid container>
        <Grid item xs/>
        <Grid item xs={8}>
          {
            userState && userState.user && (<Typography>{"You are authorized"}</Typography>)
          }
          {
            (!userState || !userState.user) && <Form userActions={this.props.userActions}/>
          }
        </Grid>
        <Grid item xs/>
      </Grid>
    )
  }
}

const RegistrationForm = reduxForm({
  form: 'registration',
})(Registration);


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

export default connect(mapStateToProps, mapDispatchToProps)(RegistrationForm);
