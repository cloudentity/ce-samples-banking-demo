import {useState, useEffect} from 'react';
import authConfig from './authConfig';

export const useAuth = (auth) => {
  const [authenticated, setAuthentication] = useState(null);

  function removeQueryString() {
    if (!(window.location.href.split('transfer-callback').length > 1) && window.location.href.split('?').length > 1) {
      window.history.replaceState({}, document.title, window.location.href.replace(/\?.*$/, ''));
    }
  }

  useEffect(() => {
    const dynamicRedirectUri = window.location.href.split('transfer-callback').length > 1
      ? {dynamicRedirectUri: authConfig.redirectUri + 'transfer-callback'}
      : {};

    auth.getAuth(dynamicRedirectUri).then((res) => {
      if (res) {
        console.log('auth response:', JSON.stringify(res));
        if (res.scope && res.scope.split(' ').length === 1 && res.scope.startsWith('transfer')) {
          window.localStorage.setItem(`${authConfig.accessTokenName}_${res.scope}`, res.access_token);
        } else {
          window.localStorage.setItem(authConfig.accessTokenName, res.access_token);
        }
        // removeQueryString();
      }
      setAuthentication(true);
    })
    .catch((_authErr) => {
      setAuthentication(false);
      if (window.location.href.split('?error').length > 1) {
        if (authenticated === false) {
          window.alert('The authorization server returned an error.');
        }
      } else {
        removeQueryString();
      }
    });
  });

  return [authenticated];
};
