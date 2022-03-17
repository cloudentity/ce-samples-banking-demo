import React from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import BankCard from './BankCard';
import mainClasses from './main.module.css';
import Card from '@material-ui/core/Card';

const useStyles = makeStyles((theme) => ({
  accountsQuantityText: {
    display: 'inline-block',
    background: 'rgba(54, 198, 175, 0.08)',
    color: theme.palette.primary.main,
    fontSize: 14,
    padding: 2,
    marginTop: 4
  }
}));

export default function Accounts ({banks, reconnectBank, accounts, balances, filtering, onChangeFiltering, onConnectClick, onDisconnect, onReconnect}) {
  const classes = useStyles();

  const totalBalance = balances.reduce((total, b) => total + parseFloat(b.Amount), 0).toFixed(2);

  return (
    <div style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
      <Card style={{padding: '32px 20px'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <Typography className={mainClasses.sectionTitle}>All accounts</Typography>
          <Typography><strong>${totalBalance}</strong></Typography>
        </div>
        <Typography className={classes.accountsQuantityText}>{accounts.length} accounts</Typography>
      </Card>

      {banks.map(bankId => (
        <BankCard
          key={bankId}
          bankId={bankId}
          reconnect={reconnectBank}
          accounts={accounts}
          balances={balances}
          filtering={filtering}
          onChangeFiltering={onChangeFiltering}
          onDisconnect={onDisconnect}
          onReconnect={onReconnect}
          style={{marginTop: 32}}/>
      ))}

      <div style={{flex: 1}}/>
    </div>
  )
};
