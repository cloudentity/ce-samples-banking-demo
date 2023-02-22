import { makeStyles } from '@material-ui/core/styles';
import ReactJson from 'react-json-view';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select
} from '@material-ui/core';
import {useForm, Controller} from 'react-hook-form';

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
  },
  switchOrgContainer: {
    border: `2px solid ${theme.palette.primary.main}`,
    padding: '20px 15px',
    display: 'flex',
    flexDirection: 'column'
  },
  switchOrgInputs: {
    marginBottom: 20
  },
  switchOrgButton: {
    color: '#fff',
    background: theme.palette.primary.main,
    '&:hover': {
      color: theme.palette.primary.main,
    },
  },
}));

const Profile = ({auth, handleLogout, handleTokenExchange}) => {
  const classes = useStyles();

  let {register, setValue, control, handleSubmit} = useForm();

  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  const accessToken = window.localStorage.getItem(authConfig.accessTokenName);
  const accessTokenData = accessToken ? jwt_decode(accessToken) : {};

  const submitOrgSwitch = (formData) => {
    const tokenExchangeCustomFields = '&scope=' + encodeURIComponent(formData.scopes)
      + '&org_id=' + encodeURIComponent(formData.switchOrg);

    handleTokenExchange({customFields: tokenExchangeCustomFields, setAccessToken: true})
      .then(() => {
        window.location.reload();
      })
      .catch(() => {
        window.alert('The authorization server returned an error. Check the developer tools for details.');
      });
  };

  console.log(idTokenData, idTokenData);

  return (
    <div className={classes.root}>
      <Card className={classes.profileCard}>
        <div className={classes.profileHeader}>
          <Typography variant="h5" component="h2">{`Hi, ${idTokenData.sub || 'user'}!`}</Typography>
        </div>
        <div className={classes.switchOrgContainer}>
          <div className={classes.switchOrgInputs}>
            <InputLabel style={{marginBottom: 10}}>Switch Organization</InputLabel>
            <FormControl
              variant="outlined"
              style={{width: 400}}
            >
              <Controller
                render={() => (
                  <Select
                    id="switch-org-input"
                    defaultValue={''}
                    onChange={(event) => {
                      setValue('switchOrg', event.target.value);
                    }}
                  >
                    <MenuItem value="" disabled>Choose an organization</MenuItem>
                    <MenuItem value="org_1">Org 1</MenuItem>
                    <MenuItem value="org_2">Org 2</MenuItem>
                    <MenuItem value="org_3">Org 3</MenuItem>
                    <MenuItem value="org_4">Org 4</MenuItem>
                    <MenuItem value="org_5">Org 5</MenuItem>
                  </Select>
                )}
                name="switchOrg"
                control={control}
              />
            </FormControl>
            <InputLabel style={{marginTop: 20, marginBottom: 10}}>Scopes (separate multiple scopes with space)</InputLabel>
            <FormControl>
              <OutlinedInput
                id="scopes-input"
                variant="outlined"
                name="scopes"
                {...register('scopes')}
                defaultValue={''}
                style={{width: 400, marginBottom: 30}}
              />
            </FormControl>
          </div>
          <div>
            <Button className={classes.switchOrgButton} onClick={handleSubmit(submitOrgSwitch)}>
              Switch Organization
            </Button>
          </div>
        </div>
        <div style={{marginTop: 20}}>
          <Typography>{`The contents of your OAuth Access token:`}</Typography>
        </div>
        <ReactJson style={{marginTop: 20}} src={accessTokenData} />
        <div style={{marginTop: 20}}>
          <Typography>{`The contents of your OAuth ID token:`}</Typography>
        </div>
        <ReactJson style={{marginTop: 20}} src={idTokenData} />
      </Card>
    </div>
  );
};

export default Profile;
