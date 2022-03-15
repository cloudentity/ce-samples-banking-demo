import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import {Plus} from 'react-feather';
import Card from '@material-ui/core/Card';
import Checkbox from '@material-ui/core/Checkbox';
// import {banks} from './banks';
import {filter, pathOr} from 'ramda';

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
  }
}));

export default function BankCard({bankId, reconnect, accounts, balances, filtering, style = {}, onChangeFiltering, onDisconnect, onReconnect}) {
  const classes = useStyles();

  const getAccountBalance = (accountId, balances) => balances.find(b => b.AccountId === accountId);
  const getAccountAmountAsString = (accountId, balances) => {
    console.log('accountId', accountId);
    const accountBalance = getAccountBalance(accountId, balances);
    console.log('accountBalance', accountBalance)
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
        <Typography>Open a new account</Typography>
        <IconButton>
          <Plus className={classes.actionsBarColor}/>
        </IconButton>
      </div>
    </Card>
  )
};
