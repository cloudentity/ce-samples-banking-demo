import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputAdornment from '@material-ui/core/InputAdornment';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import {DollarSign} from 'react-feather';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import {useForm, Controller} from 'react-hook-form';
// import {banks} from './banks';
import {filter, pathOr} from 'ramda';
import { api } from '../api/api';

const useStyles = makeStyles((theme) => ({
  accountRoot: {
    borderBottom: '1px solid #ECECEC',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  accountCardBackgroundActive: {
    background: theme.palette.primary.main
  },
  accountCardBackgroundInactive: {
    background: 'initial'
  },
  accountCardColorActive: {
    color: '#fff'
  },
  accountCardColorInactive: {
    color: 'initial'
  },
  actionsBarColor: {
    color: theme.palette.primary.main
  },
  transferMoneyDialog: {
    padding: 40,
    minWidth: 300
  },
  confirmTransferButton: {
    color: '#fff',
    background: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
  boldText: {
    fontWeight: 700
  }
}));

const TransferMoneyDialog = ({open, accountData, handleClose, error, classes}) => {
  let {register, setValue, control, handleSubmit} = useForm();

  const [transferFromAcct, setTransferFromAcct] = useState('none');
  const [transferToAcct, setTransferToAcct] = useState('none');

  const resetTransferValues = () => {
    setTransferFromAcct('none');
    setTransferToAcct('none');
    setValue('transferAmount', '');
  };

  const submitTransfer = (formData) => {
    handleClose('confirm', {transferFromAcct, transferToAcct, transferAmount: formData.transferAmount});
    resetTransferValues();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <div className={classes.transferMoneyDialog}>
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
            {...register('transferAmount')}
            defaultValue={''}
            style={{width: 400, marginBottom: 30}}
          />
        </FormControl>
        <div style={{color: 'red', marginBottom: 30, height: 10, textAlign: 'center'}}>
          {error}
        </div>
        <div style={{display: 'flex', justifyContent: 'flex-end'}}>
          <Button className={classes.datasetButton} onClick={() => {
            handleClose('cancel');
            resetTransferValues();
          }}>
            Cancel
          </Button>
          <div style={{width: 10}}></div>
          <Button className={classes.confirmTransferButton} onClick={handleSubmit(submitTransfer)}>
            Confirm
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default function BankCard ({bankId, reconnect, accounts, balances, filtering, style = {}, onChangeFiltering, onDisconnect, onReconnect}) {
  const classes = useStyles();

  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [transferDialogError, setTransferDialogError] = useState('');

  const handleChangeTransferDialogState = (action, data) => {
    if (action === 'cancel') {
      setTransferDialogOpen(false);
      setTransferDialogError('');
    }
    if (action === 'confirm') {
      setTransferDialogError('');
      api.transferMoney(data)
      .then(() => setTransferDialogOpen(false))
      .catch((err) => {
        err?.status === 403
          ? setTransferDialogError('You are not authorized to perform this action.')
          : setTransferDialogError(err?.response?.body?.message || 'Sorry, a server error occred.');
      });
    }
  };

  const getAccountBalance = (accountId, balances) => balances.find(b => b.AccountId === accountId);
  const getAccountAmountAsString = (accountId, balances) => {
    const accountBalance = getAccountBalance(accountId, balances);
    return accountBalance
      ? `${accountBalance.Currency === 'USD' ? '$' : accountBalance.Currency + ' '}${pathOr(0, ['Amount'], accountBalance)}`
      : 'N/A'

  }
  const isAccountChecked = id => filtering?.accounts?.includes(id);

  // let selectedBank = banks.find(b => b.value === bankId);

  return (
    <Card style={style} id={bankId}>
      {accounts.map(account => (
        <div
          key={account.AccountId}
          onClick={() => onChangeFiltering(
            {
              accounts:
                isAccountChecked(account.AccountId)
                  ? filter(a => a !== account.AccountId, filtering?.accounts)
                  : [...filtering?.accounts, account.AccountId],
              months: [],
              categories: []
            })}
          className={
            isAccountChecked(account.AccountId)
              ? `${classes.accountRoot} ${classes.accountCardBackgroundActive} ${classes.accountCardColorActive}`
              : `${classes.accountRoot} ${classes.accountCardBackgroundInactive} ${classes.accountCardColorInactive}`
          }
          style={{
            height: 62,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px'
          }}>

          <div style={{display: 'flex', alignItems: 'center'}}>
            <Checkbox
              checked={isAccountChecked(account.AccountId)}
              onChange={() => onChangeFiltering(
                {
                  accounts:
                    isAccountChecked(account.AccountId)
                      ? filter(a => a !== account.AccountId, filtering?.accounts)
                      : [...filtering?.accounts, account.AccountId],
                  months: [],
                  categories: []
                })}
              color={'primary'}
              style={{color: isAccountChecked(account.AccountId) ? '#fff' : 'initial'}}
              inputProps={{'aria-label': 'primary checkbox'}}
            />
            <div style={{marginLeft: 12}}>
              <Typography className={`account-name`}>{account.Nickname}</Typography>
              <Typography>**** ***** **** {account.AccountId}</Typography>
            </div>
          </div>
          <div>
            <Typography>{getAccountAmountAsString(account.AccountId, balances)}</Typography>
          </div>
        </div>
      ))}
      <div className={classes.actionsBarColor} style={{
        height: 52,
        padding: '0 21px',
        background: 'rgba(54, 198, 175, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Typography>Transfer money</Typography>
        <IconButton onClick={() => setTransferDialogOpen(true)}>
          <DollarSign className={classes.actionsBarColor}/>
        </IconButton>
      </div>
      <TransferMoneyDialog
        open={transferDialogOpen}
        accountData={accounts}
        handleClose={handleChangeTransferDialogState}
        error={transferDialogError}
        classes={classes}
      />
    </Card>
  )
};
