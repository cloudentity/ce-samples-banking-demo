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
    justifyContent: 'center',
    height: '100%'
  },
  profileHeader: {
    marginBottom: 30
  },
  profileCard: {
    padding: '60px 50px',
    width: 'calc(100vw - 300px)',
  }
}));

const Profile = ({auth, handleLogout}) => {
  const classes = useStyles();

  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  console.log(idTokenData, idTokenData);

  return (
    <div className={classes.root}>
      <Card className={classes.profileCard}>
        <div className={classes.profileHeader}>
          <Typography>{`Hi, ${idTokenData.sub || 'user'}. Below are the contents of your OAuth ID token.`}</Typography>
        </div>
        <ReactJson src={idTokenData} />
      </Card>
    </div>
  );
};

export default Profile;
