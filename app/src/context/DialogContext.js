import React, { createContext, useState, useContext } from 'react';
import { node } from 'prop-types';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export const DialogContext = createContext();

const initialState = {
  open: false,
  title: '',
  message: '',
  cancelText: 'Cancel',
  onCancel: Function.prototype,
  actionText: 'Ok',
  onAction: Function.prototype,
};

export const DialogProvider = ({ children }) => {
  const [dialogState, setDialogState] = useState(initialState);
  const showDialog = args =>
    setDialogState({
      ...dialogState,
      ...args,
      open: true,
      onCancel: () => {
        // eslint-disable-next-line no-unused-expressions
        args.onCancel && args.onCancel();
        setDialogState(initialState);
      },
      onAction: () => {
        // eslint-disable-next-line no-unused-expressions
        args.onAction && args.onAction();
        setDialogState(initialState);
      },
    });

  const {
    open, title, message, cancelText, onCancel, actionText, onAction,
  } = dialogState;

  return (
    <DialogContext.Provider value={showDialog}>
      {children}
      <Dialog
        open={open}
        onClose={onCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancel} color="primary">
            {cancelText}
          </Button>
          <Button onClick={onAction} color="primary" autoFocus>
            {actionText}
          </Button>
        </DialogActions>
      </Dialog>
    </DialogContext.Provider>
  );
};

DialogProvider.propTypes = {
  children: node.isRequired,
};

/**
 * HOC
 */
export const withDialog = Comp => props => (
  <DialogContext.Consumer>
    {showDialog => <Comp {...props} showDialog={showDialog} />}
  </DialogContext.Consumer>
);

/**
 * Use Dialog Hook
 *
 * @returns {Function} showDialog function
 */
export const useDialog = () => {
  const showDialog = useContext(DialogContext);

  if (!showDialog) {
    throw new Error('Invalid dialog context');
  }

  return showDialog;
};
