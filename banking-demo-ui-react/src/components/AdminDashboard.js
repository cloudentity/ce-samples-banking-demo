import { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import AdminUsersList from './AdminUsersList';
import Transactions from './Transactions';
import { useQuery } from 'react-query';
import { api } from '../api/api';
import Progress from './Progress';
import TransferMoney from './TransferMoney';
// import {applyFiltering} from './analytics.utils';
// import {path, pick} from 'ramda';

import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  adminNavContainer: {
    marginTop: 20
  }
}));

export default function AdminDashboard () {
  const classes = useStyles();

  const [currentView, setCurrentView] = useState('users');
  const [selectedUser, setSelectedUser] = useState([]);
  const [refreshList, initRefreshList] = useState(false);
  const [manageWithdrawalLimitDialogOpen, setmanageWithdrawalLimitDialogOpen] = useState(false);

  const updateCurrentView = (view) => {
    if (view !== currentView) {
      setCurrentView(view);
    }
  };

  const leftNavItems = [
    {id: 'users', label: 'Manage Banking Users'}
  ];

  const {isLoading: fetchUsersProgress, data: usersRes} = useQuery(['fetchUsers', refreshList], api.adminFetchUsers, {
    refetchOnWindowFocus: false,
    retry: false
  });

  const defaultAdminScopes = {
    scopes: authConfig.defaultAdminScopes
  }

  const {isLoading: checkAdminScopesProgress, data: scopesCheckRes} = useQuery('checkAdminScopes', () => api.verifyAdminScopes(defaultAdminScopes), {
    refetchOnWindowFocus: false,
    retry: false
  });

  const users = usersRes || [];

  const adminScopes = scopesCheckRes ? jwt_decode(scopesCheckRes.access_token) : {};

  const isLoading = fetchUsersProgress || checkAdminScopesProgress;

  if (isLoading) {
    return <Progress/>;
  }

  return (
    <Grid container sx={{ flexDirection: { xs: 'column', sm: 'column', md: 'row'} }} className={classes.root}>
      <Grid item xs={2} style={{background: '#F7FAFF', padding: '16px 32px', borderRight: '1px solid #EAECF1'}}>
        <div className={classes.adminNavContainer}>
          {leftNavItems.map((n, i) => (
            <div
              key={i}
              style={{marginBottom: 20, textDecoration: currentView === n.id ? 'underline' : 'none'}}
              onClick={() => updateCurrentView(n.id)}
            >
             {n.label}
            </div>
          ))}
        </div>
      </Grid>
      <Grid item xs={10} style={{background: '#FCFCFF', padding: '32px 32px 16px 32px'}}>
        <AdminUsersList
          data={users}
          adminScopes={adminScopes}
          selectedUser={selectedUser}
          setSelectedUser={u => setSelectedUser(u)}
          refreshData={refreshList}
          handleRefreshList={() => initRefreshList(!refreshList)}
        />
      </Grid>
    </Grid>
  )
};
