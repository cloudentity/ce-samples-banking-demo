import {useState, useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Dashboard from './Dashboard';
import Profile from './Profile';
import PageContent from './common/PageContent';
import PageToolbar from './common/PageToolbar';

import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

const Authorized = ({auth, viewId, handleLogout, handleTokenExchange}) => {
  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  const role = idTokenData.role || 'user';
  const isAdmin = role === 'admin';

  const [currentTab, setCurrentTab] = useState(isAdmin ? 'admin' : 'accounts');

  const handleTabChange = (id) => {
    setCurrentTab(id);
  }

  // May dynamically fetch bank account info if required
  const banks = ['exampleBank'];

  // console.log(idTokenData, idTokenData.iat);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div>
          {auth === null && <div>Loading...</div>}
          {auth === false && <Navigate to='/' />}
          {auth && (
            <div style={{ position: 'relative' }}>
              <PageToolbar
                mode="main"
                role={role}
                tab={isAdmin ? viewId : (viewId === 'transfer' ? 'accounts' : viewId)}
                authorizationServerURL={'authorizationServerURL'}
                authorizationServerId={'authorizationServerId'}
                tenantId={'tenantId'}
                handleTabChange={handleTabChange}
                handleLogout={handleLogout}
              />
              <PageContent>
                {!isAdmin && (viewId === 'accounts' || viewId === 'transfer') && <Dashboard banks={banks} viewId={viewId} />}
                {isAdmin && viewId === 'admin' && <AdminDashboard />}
                {viewId === 'profile' && <Profile handleTokenExchange={handleTokenExchange} />}
              </PageContent>
            </div>
          )}
        </div>
      </QueryClientProvider>
    </>
  );
};

export default Authorized;
