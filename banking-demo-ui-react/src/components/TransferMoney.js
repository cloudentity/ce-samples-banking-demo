import React, {useState} from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import ReactJson from 'react-json-view';
import Card from '@material-ui/core/Card';
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
import jwt_decode from 'jwt-decode';
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
  accessTokenCard: {
    margin: '30px 0',
    padding: '30px 50px',
    width: '90%',
  }
});

const TransferMoney = ({accountData, classes}) => {
  let {register, watch, formState, setValue, control, handleSubmit} = useForm();

  const { state } = useLocation();

  if (state?.transferAmount) {
    setValue('transferAmount', state?.transferAmount);
  }

  const stateContainsConfirmValues = !!(state?.transferFromAcct && state?.transferToAcct && state?.transferAmount);

  const [transferDialogOpen, setTransferDialogOpen] = useState(true);
  const [transferDialogSuccess, setTransferDialogSuccess] = useState(false);
  const [transferDialogError, setTransferDialogError] = useState('');
  const [transferFromAcct, setTransferFromAcct] = useState(state?.transferFromAcct || 'none');
  const [transferToAcct, setTransferToAcct] = useState(state?.transferToAcct || 'none');

  const activeAccessToken = window.localStorage.getItem(`${authConfig.accessTokenName}_transfer.${state?.transferAmount}`);
  const activeAccessTokenData = activeAccessToken ? jwt_decode(activeAccessToken) : {};

  const handleChangeTransferDialogState = (action, data) => {
    if (action === 'cancel') {
      setTransferDialogOpen(false);
      setTransferDialogError('');
      if (state?.transferAmount) {
        window.localStorage.removeItem(`${authConfig.accessTokenName}_transfer.${state?.transferAmount}`);
      }
    }
    if (action === 'confirm') {
      setTransferDialogError('');
      const transferAccessTokenName = `${authConfig.accessTokenName}_transfer.${data.transferAmount}`;
      const transferAccessToken = window.localStorage.getItem(transferAccessTokenName);

      const transferAuthConfig = {
        ...authConfig,
        ...{
          accessTokenName: transferAccessTokenName,
          scopes: [`transfer.${data.transferAmount}`],
          redirectUri: 'http://localhost:3000/transfer-callback',
        }
      };
      const transferAuth = new CloudentityAuth(transferAuthConfig);

      if (transferAccessToken) {
        transferAuth.getAuth()
          .then(res => {
            api.transferMoney(data, transferAccessTokenName)
              .then(() => setTransferDialogSuccess(true))
              .catch((err) => {
                err?.status === 403
                  ? setTransferDialogError('You are not authorized to perform this action.')
                  : setTransferDialogError(err?.response?.body?.message || 'Sorry, a server error occred.');
              });
          })
          .catch(err => {
            console.log('auth error', err);
            setTransferDialogError('Access token expired or invalid');
          })
      } else {
        transferAuth.authorize({state: window.btoa(JSON.stringify(data))});
      }
    }
  };

  const activeError = !!pathOr(false, ['errors', 'transferAmount'], formState);

  const submitDisabled = (!state?.transferAmount && !watch('transferAmount')) || activeError || transferFromAcct === 'none' || transferToAcct === 'none';

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
          {stateContainsConfirmValues && (
            <div style={{display: 'flex', justifyContent: 'space-around', marginBottom: 20}}>
              <p style={{color: '#000'}}>Thank you for verifying your account. You may now confirm your transfer.</p>
            </div>
          )}
          <InputLabel style={{marginBottom: 10}}>Transfer FROM:</InputLabel>
          <FormControl
            variant="outlined"
            style={{width: 400}}
          >
            <Controller
              render={() => (
                <Select
                  id="transfer-from-input"
                  defaultValue={state?.transferFromAcct || 'none'}
                  onChange={(event) => {
                    setTransferFromAcct(event.target.value);
                    return event.target.value
                  }}
                  disabled={stateContainsConfirmValues}
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
              render={() => (
                <Select
                  id="transfer-from-input"
                  defaultValue={state?.transferToAcct || 'none'}
                  onChange={(event) => {
                    setTransferToAcct(event.target.value);
                    return event.target.value
                  }}
                  disabled={stateContainsConfirmValues}
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
              disabled={stateContainsConfirmValues}
              defaultValue={state?.transferAmount || ''}
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
          {activeAccessToken && (
            <Card className={classes.accessTokenCard}>
              <div style={{marginTop: 20}}>
                <Typography>{`The contents of your OAuth Access token for this transfer:`}</Typography>
              </div>
              <ReactJson style={{marginTop: 20}} src={activeAccessTokenData} />
            </Card>
          )}
        </>
      )}
      {!transferDialogOpen && <Navigate to='/accounts' />}
    </div>
  );
};

export default withStyles(styles, {withTheme: true})(TransferMoney);
