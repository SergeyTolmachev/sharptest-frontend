import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class DialogModal extends React.Component {

  render() {
    const {openDialog, dialogText, handleCloseDialog} = this.props;

    return (<Dialog open={openDialog} onClose={this.handleCloseDialog}>
      <DialogTitle>Error!</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {"Error"}
        </DialogContentText>
        <DialogContentText>
          <b>{dialogText}</b>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDialog} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>)
  }
}
