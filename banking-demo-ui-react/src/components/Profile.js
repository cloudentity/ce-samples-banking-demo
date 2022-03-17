import { makeStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  profileHeader: {
    marginBottom: 30
  },
  profileCard: {
    margin: '30px 0',
    padding: '30px 50px',
    width: 'calc(100vw - 300px)',
  }
}));

const Profile = ({auth, handleLogout}) => {
  const classes = useStyles();

  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  const accessToken = window.localStorage.getItem(authConfig.accessTokenName);
  const accessTokenData = accessToken ? jwt_decode(accessToken) : {};

  console.log(idTokenData, idTokenData);

  return (
    <div className={classes.root}>
      <Card className={classes.profileCard}>
        <div className={classes.profileHeader}>
          <Typography variant="h5" component="h2">{`Hi, ${idTokenData.sub || 'user'}!`}</Typography>
        </div>
        <div style={{marginTop: 20}}>
          <Typography>{`The contents of your OAuth ID token:`}</Typography>
        </div>
        <ReactJson style={{marginTop: 20}} src={idTokenData} />
        <div style={{marginTop: 20}}>
          <Typography>{`The contents of your OAuth Access token:`}</Typography>
        </div>
        <ReactJson style={{marginTop: 20}} src={accessTokenData} />
      </Card>
    </div>
  );
};

export default Profile;
