import { Navigate } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import { theme } from '../theme';

import Dashboard from './Dashboard';
import PageContent from './common/PageContent';
import PageToolbar from './common/PageToolbar';

import jwt_decode from 'jwt-decode';
import authConfig from '../authConfig';

import { QueryClient, QueryClientProvider } from 'react-query';
const queryClient = new QueryClient();

const Authorized = ({auth, handleLogout}) => {
  const idToken = window.localStorage.getItem(authConfig.idTokenName);
  const idTokenData = idToken ? jwt_decode(idToken) : {};

  // May dynamically fetch bank account info if required
  const banks = ['exampleBank'];

  // console.log(idTokenData, idTokenData.iat);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <StylesProvider injectFirst>
            <div>
              {auth === null && <div>Loading...</div>}
              {auth === false && <Navigate to='/' />}
              {auth && (
                <div style={{ position: 'relative' }}>
                  <PageToolbar
                    mode="main"
                    authorizationServerURL={'authorizationServerURL'}
                    authorizationServerId={'authorizationServerId'}
                    tenantId={'tenantId'}
                  />
                  <PageContent>
                    <Dashboard banks={banks} />
                  </PageContent>
                </div>
              )}
            </div>
          </StylesProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  );
};

export default Authorized;
