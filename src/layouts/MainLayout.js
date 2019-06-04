import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {withStyles} from '@material-ui/core';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import SvgIcon from '@material-ui/core/SvgIcon';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import MenuIcon from '@material-ui/icons/Menu';
import {Logout} from '../config/icons';


import Router from '../Router';
import {userActions} from "../rdx/user";

const styles = theme => ({
  menuButton: {
    marginRight: theme.spacing(2),
  },
});

class MainLayout extends React.Component {

  state = {
    anchorEl: null,
  };

  componentDidMount = () => {
    this.props.userActions.checkAuth();
  };

  handleClose = () => {
    this.setState({...this.state, anchorEl: null})
  };

  handleLogout = () => {
    this.props.userActions.unauthorize();
    localStorage.removeItem('token');
  }

  handleOpen = (event) => {
    this.setState({...this.state, anchorEl: event.currentTarget})
  };

  render() {
    const {classes, userState} = this.props;
    console.log(userState);
    const {anchorEl} = this.state;
    return (
      <Container maxWidth="sm">
        <Grid container>
          <AppBar position="static">
            <Toolbar>
              <Grid item xs>
                {
                  (!userState || !userState.user) && (
                    <IconButton className={classes.menuButton} color="inherit"
                                onClick={this.handleOpen}>
                      <MenuIcon/>
                    </IconButton>
                  )
                }
              </Grid>
                <Grid item xs={8}>
                  <Typography variant="h6">Parrot Wings</Typography>
                  {
                    userState && userState.user && (<Typography>{userState.user.name} {userState.user.balance}PW</Typography>)
                  }
                </Grid>
              <Grid item xs>
                {
                  userState && userState.user && (<IconButton className={classes.menuButton} color="inherit"
                                       onClick={this.handleLogout}>
                    <SvgIcon color="inherit">{Logout}</SvgIcon>
                  </IconButton>)
                }
              </Grid>
              <Menu id="simple-menu" anchorEl={anchorEl} open={Boolean(anchorEl)}
                    onClose={this.handleClose}>
                <MenuItem onClick={this.handleClose}><Link to="/">Main</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link to="/auth">Auth</Link></MenuItem>
                <MenuItem onClick={this.handleClose}><Link
                  to="/registration">Registration</Link></MenuItem>
                {/*<MenuItem onClick={this.handleClose}>Logout</MenuItem>*/}
              </Menu>
            </Toolbar>
          </AppBar>
          <Router/>
        </Grid>
      </Container>
    )
  }
}

const MainLayoutWithStyles = withStyles(styles)(MainLayout);

function mapStateToProps(state) {
  return {
    userState: state.user,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainLayoutWithStyles);
