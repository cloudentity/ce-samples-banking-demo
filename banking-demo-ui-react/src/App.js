import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core';
import { StylesProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import Unauthorized from './components/Unauthorized';
import Authorized from './components/Authorized';
import './App.css';

import CloudentityAuth from '@cloudentity/auth';
import authConfig from './authConfig';
import { useAuth } from './auth';

function App() {
  const cloudentity = new CloudentityAuth(authConfig);
  const [authenticated] = useAuth(cloudentity);

  function authorize () {
    cloudentity.authorize();
  };

  function clearAuth () {
      cloudentity.revokeAuth()
      .then(() => {
        window.location.reload();
          window.location.assign("https://lovatt-org.us.authz.cloudentity.io/lovatt-org/default/oidc/logout");
         // window.location.assign("https://lovatt-org.us.authz.cloudentity.io/lovatt-org/default/oidc/logout?post_logout_redirect_uri=localhost%3A3000");
      })
      .catch(() => {
        window.location.reload();
          window.location.assign("https://lovatt-org.us.authz.cloudentity.io/lovatt-org/default/oidc/logout");
          //window.location.assign("https://lovatt-org.us.authz.cloudentity.io/lovatt-org/default/oidc/logout?post_logout_redirect_uri=localhost%3A3000");

      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <StylesProvider injectFirst>
          <div>
            <BrowserRouter>
              <Routes>
                <Route index element={<Unauthorized className="App" auth={authenticated} handleLogin={authorize} />} />
                <Route path="admin" element={<Authorized auth={authenticated} viewId={'admin'} handleLogout={clearAuth} />} />
                <Route path="accounts" element={<Authorized auth={authenticated} viewId={'accounts'} handleLogout={clearAuth} />} />
                <Route path="transfer" element={<Authorized auth={authenticated} viewId={'transfer'} handleLogout={clearAuth} />} />
                <Route path="transfer-callback" element={<Unauthorized className="App" auth={authenticated} handleLogin={authorize} redirectPath='/transfer' />} />
                <Route path="profile" element={<Authorized auth={authenticated} viewId={'profile'} handleLogout={clearAuth} />} />
              </Routes>
            </BrowserRouter>
          </div>
        </StylesProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
