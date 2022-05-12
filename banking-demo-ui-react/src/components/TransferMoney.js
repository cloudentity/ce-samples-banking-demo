import React, {useState} from 'react';
import { Navigate } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import {useForm, Controller} from 'react-hook-form';
import { Link } from 'react-router-dom';
// import {banks} from './banks';
import CloudentityAuth from '@cloudentity/auth';
import authConfig from '../authConfig';
import {filter, pathOr} from 'ramda';
import { api } from '../api/api';

const styles = theme => ({
  progress: {
    width: 100,
    height: 100,
    position: 'absolute',
    left: 'calc(50% - 50px);',
  },
  circle: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  transferMoneyDialog: {
    padding: '0 40px',
    minWidth: 300
  },
  cancelTransferButton: {

  },
  confirmTransferButton: {
    color: '#fff',
    background: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  inputContainer: {},
});

const TransferMoney = ({accountData, classes}) => {
  let {register, watch, formState, setValue, control, handleSubmit} = useForm();

  const [transferDialogOpen, setTransferDialogOpen] = useState(true);
  const [transferDialogSuccess, setTransferDialogSuccess] = useState(false);
  const [transferDialogError, setTransferDialogError] = useState('');
  const [transferFromAcct, setTransferFromAcct] = useState('none');
  const [transferToAcct, setTransferToAcct] = useState('none');

  const handleChangeTransferDialogState = (action, data) => {
    if (action === 'cancel') {
      setTransferDialogOpen(false);
      setTransferDialogError('');
    }
    if (action === 'confirm') {
      setTransferDialogError('');
      const transferAuthConfig = {
        ...authConfig,
        ...{
          accessTokenName: `${authConfig.accessTokenName}.transfer.${data.transferAmount}`,
          // scopes: [`transfer.${data.transferAmount}`],
          redirectUri: 'http://localhost:3000/transfer-callback',
        }
      };
      const transferAuth = new CloudentityAuth(transferAuthConfig);
      transferAuth.authorize();

      // TODO: finish token minting flow before wiring API
      // api.transferMoney(data)
      //   .then(() => setTransferDialogSuccess(true))
      //   .catch((err) => {
      //     err?.status === 403
      //       ? setTransferDialogError('You are not authorized to perform this action.')
      //       : setTransferDialogError(err?.response?.body?.message || 'Sorry, a server error occred.');
      //   });
    }
  };

  const activeError = !!pathOr(false, ['errors', 'transferAmount'], formState);

  const submitDisabled = !watch('transferAmount') || activeError || transferFromAcct === 'none' || transferToAcct === 'none';

  const resetTransferValues = () => {
    setTransferFromAcct('none');
    setTransferToAcct('none');
    setValue('transferAmount', '');
  };

  const submitTransfer = (formData) => {
    handleChangeTransferDialogState('confirm', {transferFromAcct, transferToAcct, transferAmount: formData.transferAmount});
    resetTransferValues();
  };

  return (
    <div className={classes.transferMoneyDialog}>
      {transferDialogSuccess ? (
        <>
          <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 20}}>
            <Typography variant="h5" component="h5">Your transfer was successful!</Typography>
          </div>
          <div style={{display: 'flex', justifyContent: 'center'}}>
            <Button className={classes.confirmTransferButton} onClick={() => {
              handleChangeTransferDialogState('cancel');
            }}>
              Done
            </Button>
          </div>
        </>
      ) : (
        <>
          <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 20}}>
            <Typography variant="h5" component="h5">Transfer Money</Typography>
          </div>
          <InputLabel style={{marginBottom: 10}}>Transfer FROM:</InputLabel>
          <FormControl
            variant="outlined"
            style={{width: 400}}
          >
            <Controller
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  id="transfer-from-input"
                  defaultValue={'none'}
                  onChange={(event) => {
                    setTransferFromAcct(event.target.value);
                    return event.target.value
                  }}
                >
                  <MenuItem value={'none'} disabled>Choose an account to transfer from</MenuItem>
                  {accountData && Array.isArray(accountData) && accountData.map((account) => (
                    <MenuItem key={account.AccountId} value={account.AccountId} disabled={account.AccountId === transferToAcct}>{`******${account.AccountId}`}</MenuItem>
                  ))}
                </Select>
              )}
              name="transferFrom"
              control={control}
            />
          </FormControl>
          <InputLabel style={{marginTop: 20, marginBottom: 10}}>Transfer TO:</InputLabel>
          <FormControl
            variant="outlined"
            style={{width: 400}}
            disabled={transferFromAcct === 'none'}
          >
            <Controller
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Select
                  id="transfer-from-input"
                  defaultValue={'none'}
                  onChange={(event) => {
                    setTransferToAcct(event.target.value);
                    return event.target.value
                  }}
                >
                  <MenuItem value={'none'} disabled>Choose an account to transfer to</MenuItem>
                  {accountData && Array.isArray(accountData) && accountData.map((account) => (
                    <MenuItem key={account.AccountId} value={account.AccountId} disabled={account.AccountId === transferFromAcct}>{`******${account.AccountId}`}</MenuItem>
                  ))}
                </Select>
              )}
              name="transferTo"
              control={control}
            />
          </FormControl>
          <InputLabel style={{marginTop: 20, marginBottom: 10}}>Amount to Transfer</InputLabel>
          <FormControl className={classes.inputContainer}>
            <OutlinedInput
              id="transfer-amount-input"
              variant="outlined"
              startAdornment={<InputAdornment position="start">$</InputAdornment>}
              name="transferAmount"
              {...register('transferAmount', {
                validate: v => /^\d+(?:\.\d{0,2})$/.test(v.trim()) || 'Please enter a valid amount.'
              })}
              error={activeError}
              defaultValue={''}
              style={{width: 400, marginBottom: 30}}
            />
          </FormControl>
          <div style={{color: 'red', marginBottom: 30, height: 10}}>
            {pathOr(transferDialogError, ['errors', 'transferAmount', 'message'], formState)}
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            <Button className={classes.cancelTransferButton} onClick={() => {
              handleChangeTransferDialogState('cancel');
              resetTransferValues();
            }}>
              Cancel
            </Button>
            <div style={{width: 10}}></div>
            <Button className={classes.confirmTransferButton} disabled={submitDisabled} onClick={handleSubmit(submitTransfer)}>
              Confirm
            </Button>
          </div>
        </>
      )}
      {!transferDialogOpen && <Navigate to='/accounts' />}
    </div>
  );
};

export default withStyles(styles, {withTheme: true})(TransferMoney);
