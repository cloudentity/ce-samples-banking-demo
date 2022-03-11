import React from 'react';
import Toolbar from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Tab from '@material-ui/core/Tab';
import Hidden from '@material-ui/core/Hidden';
import Tabs from '@material-ui/core/Tabs';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

// import financrooLogo from '../../assets/financroo-logo.svg';
// import { logout } from '../AuthPage';

export const subHeaderHeight = 116;

const useStyles = (withSubheader: boolean, mode: string) =>
  makeStyles((theme) => ({
    appBar: {
      ...(withSubheader
        ? {
            border: 'none',
          }
        : {}),
    },
    toolBar: {
      ...(withSubheader
        ? {
            border: '1px solid transparent',
            borderBottom: 'none',
          }
        : {}),
      ...(mode === 'onlySubheader'
        ? {
            display: 'none',
          }
        : {}),
    },
    subHeaderContainer: {
      height: subHeaderHeight,
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.primary.main,
      fontSize: 28,
      lineHeight: '40px',
      padding: '0 80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    button: {
      color: 'white',
      fontSize: 16,
      lineHeight: '24px',
      textTransform: 'none',
      padding: '8px 24px',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
      },
    },
  }));

export default function PageToolbar({
  mode,
  children,
  authorizationServerURL,
  authorizationServerId,
  tenantId,
  tab,
  subHeaderTitle,
  subHeaderButton,
}) {
  const classes = useStyles(!!subHeaderTitle, mode)();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      variant="outlined"
      className={classes.appBar}
    >
      <Toolbar className={classes.toolBar}>
        {/* <img alt="financroo logo" src={financrooLogo} /> */}
        <div style={{marginLeft: 10, color: '#36C6AF'}}>
          <Typography variant="h5" component="h1">1st Demo Bank</Typography>
        </div>
        <div style={{ flex: 1 }} />

        {mode === 'dialog' && children}
        {mode === 'main' && (
          <>
            <Hidden mdUp>
              <IconButton edge="start" color="inherit" aria-label="menu">
                <MenuIcon />
              </IconButton>
            </Hidden>
            <Hidden smDown>
              <Tabs
                value={tab || 'accounts'}
                indicatorColor="primary"
                aria-label="menu tabs"
                style={{ height: 64 }}
              >
                <Tab
                  label="Accounts"
                  value="accounts"
                  id={'accounts-tab'}
                  style={{ height: 64 }}
                  onClick={() => {}}
                />
                <Tab label="Settings" value="settings" style={{ height: 64 }} />
              </Tabs>
            </Hidden>
            <Button
              variant="outlined"
              onClick={() => {}}
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
      {subHeaderTitle && (
        <div className={classes.subHeaderContainer}>
          <div>{subHeaderTitle}</div>
          {subHeaderButton && (
            <Button
              onClick={subHeaderButton.onClick}
              variant="contained"
              color="primary"
              className={classes.button}
              id={subHeaderButton.id}
            >
              {subHeaderButton.title}
            </Button>
          )}
        </div>
      )}
    </AppBar>
  );
}
