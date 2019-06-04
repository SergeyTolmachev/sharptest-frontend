import React from 'react';
import axios from 'axios';

import {DateTime} from 'luxon';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import SearchIcon from '@material-ui/icons/Search';

import {transactionActions} from "../rdx/transaction";
import {userActions} from "../rdx/user";

import DialogModal from "./Dialog";

const styles = (theme) => ({
  table: {
    width: '100%',
  },
});

class SearchItem extends React.Component {
  render() {
    const {handleClose, user} = this.props;
    return (
      <MenuItem onClick={handleClose(user)}>{user.name}</MenuItem>
    )
  }
}

class TransactionItem extends React.Component {
  render() {
    const {transaction} = this.props;
    const date = DateTime.fromISO(transaction.createdAt);
    return (
      <TableRow>
        <TableCell>{transaction.id}</TableCell>
        <TableCell align="center">{date.setLocale('en-GB').toFormat('DD HH:mm')}</TableCell>
        <TableCell align="center">{transaction.agentName}</TableCell>
        <TableCell align="center">
          {
            transaction.type === 'debt' ? transaction.sum : -transaction.sum
          }
        </TableCell>
        <TableCell align="center">{transaction.balance}</TableCell>
      </TableRow>
    )
  }
}

class Transactions extends React.Component {

  state = {
    open: false,
    search: '',
    users: [],
    user: '',
    userId: '',
    sum: 0,
    openDialog: false,
    dialogText: '',
  };

  handleClose = (user) => (event) => {
    this.setState({
      ...this.state,
      search: '',
      open: !this.state.open,
      user: user.name,
      userId: user.id
    })
  };

  handleCloseDialog = () => {
    this.setState({...this.state, openDialog: false});
  }

  handleFocus = () => {
    this.setState({...this.state, open: !this.state.open})
  }

  handleEnterSum = ({target}) => {
    if (Number.isInteger(+target.value)) {
      if (target.value <= this.props.userState.user.balance) {
        return this.setState({...this.state, sum: target.value})
      } else {
        this.setState({
          ...this.state,
          openDialog: true,
          dialogText: 'Sum cannot be more that balance'
        })
      }
    }
  }

  componentDidMount = () => {
    this.props.transactionActions.load();
  };

  handleCreateTransaction = () => {
    console.log('transaction', this.state.userId, this.state.sum);
    axios.post(`api/transaction`, { receiverId: this.state.userId, sum: this.state.sum })
      .then(({data}) => {
        this.setState({ ...this.state, user:'', userId:'', sum: 0});
        this.props.transactionActions.load();
        this.props.userActions.checkAuth();
      })
      .catch(error => this.setState({
        ...this.state,
        openDialog: true,
        dialogText: 'error'
      }));
  }

  handleSearch = (event) => {
    this.setState({...this.state, search: event.target.value}, () => {
      if (this.state.search.length > 3) {
        axios.get(`api/user/list?name=${this.state.search}`)
          .then(({data}) => this.setState({...this.state, users: data}))
      }
    });
  };

  render() {
    const {users, open, user, userId, sum, openDialog, dialogText} = this.state;
    const {classes, transactionState} = this.props;
    return (
      <Grid container>
        <Grid item xs={6}>
          <Typography align={"center"} variant="subtitle1">Create a transaction</Typography>
          <Typography variant="subtitle2">To create a transaction choose a correspondent and enter sum</Typography>
          <Typography> ---------------------------- </Typography>
          <Typography variant="body2">Correspondent: {user || "choose correspondent"}</Typography>
          <Typography variant="body2">Sum: {sum}</Typography>
          <Button onClick={this.handleCreateTransaction} disabled={!user || !userId || !sum} variant="contained" color={"inherit"}>
            Transaction
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Paper style={{width: '100%'}}>
            <TextField onFocus={this.handleFocus} id="search-bar" placeholder={"Search receiver"}
                       onChange={this.handleSearch}
                       value={this.state.search}/>
            <IconButton>
              <SearchIcon/>
            </IconButton>

            <Paper style={{display: open ? open : 'none'}} onClose={this.handleClose}>
              {
                users && users.map((user) => (
                  <SearchItem key={user.id} user={user} handleClose={this.handleClose}/>))
              }
              {
                (!users || !users.length) && (
                  <MenuItem><Typography variant="body2">There Is No Results</Typography></MenuItem>)
              }
            </Paper>
          </Paper>
          <Paper style={{width: '100%'}}>
            <Typography>Enter sum</Typography>
            <TextField placeholder={"Enter sum"}
                       required
                       onChange={this.handleEnterSum}
                       onFocus={() => this.setState({...this.state, sum: ''})}
                       value={sum}/>
          </Paper>
          <DialogModal openDialog={openDialog} dialogText={dialogText}
                       handleCloseDialog={this.handleCloseDialog}/>
        </Grid>


        <Paper className={classes.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>№ id</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Correspondent</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Balance</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                (!transactionState || !transactionState.items || transactionState.items.length === 0) && (
                  <TableRow><TableCell
                    colSpan={5}>{"There are no transactions"}</TableCell></TableRow>)
              }
              {
                transactionState && transactionState.items && transactionState.items.length > 0 && transactionState.items.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                  />
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    )
  }
}


function mapStateToProps(state, props) {
  return {
    transactionState: state.transaction,
    userState: state.user,
  }
}


function mapDispatchToProps(dispatch) {
  return {
    transactionActions: bindActionCreators(transactionActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Transactions));
