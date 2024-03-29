import { Navigate } from 'react-router-dom';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PageContent from './common/PageContent';
import PageToolbar from './common/PageToolbar';

import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    height: 'calc(100vh - 64px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginCard: {
    padding: '30px 50px'
  },
  subContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  textColor: {
    color: theme.palette.secondary.main,
  },
  loginButton: {
    color: '#fff',
    background: theme.palette.primary.main,
    marginTop: 30,
    padding: '10px 20px',
    '&:hover': {
      color: theme.palette.primary.main,
    },
  }
}));

const Unauthorized = ({className, auth, handleLogin, redirectPath}) => {
  const classes = useStyles();

  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  const role = idTokenData.role || 'user';
  const isAdmin = role === 'admin';

  const queryParams = Object.fromEntries((new URLSearchParams(window.location.search)).entries());

  const parseState = (base64) => {
    if (base64) {
      try {
        return JSON.parse(window.atob(base64))
      } catch {
        return {};
      }
    }
    return {};
  };

  return (
    <div style={{ position: 'relative' }}>
      <PageToolbar
        mode="dialog"
        authorizationServerURL={'authorizationServerURL'}
        authorizationServerId={'authorizationServerId'}
        tenantId={'tenantId'}
      />
      <PageContent>
        {auth === null && <div>Loading...</div>}
        {auth === false && (
          <div className={classes.mainContainer}>
            <Card className={classes.loginCard}>
              <div className={classes.subContainer}>
                <div className={`${classes.subContainer} ${classes.textColor}`}>
                  <Typography variant="h5" component="h2">Welcome!</Typography>
                  <Typography>Log in to access online banking.</Typography>
                </div>
                <Button color="primary" onClick={handleLogin} className={classes.loginButton}>
                  Continue
                </Button>
              </div>
            </Card>
          </div>
        )}
        {auth && !redirectPath && <Navigate to={isAdmin ? '/admin' : '/accounts'} />}
        {auth && redirectPath && <Navigate to={redirectPath} state={parseState(queryParams.state)} />}
      </PageContent>
    </div>
  );
};

export default Unauthorized;
