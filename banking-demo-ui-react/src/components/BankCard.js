import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
import {DollarSign} from 'react-feather';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
import { Link } from 'react-router-dom';
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
}));

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
        <Link to="/transfer">
          <DollarSign className={classes.actionsBarColor}/>
        </Link>
      </div>
    </Card>
  )
};
