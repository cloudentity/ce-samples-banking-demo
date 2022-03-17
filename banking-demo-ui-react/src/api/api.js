import {base, baseWithCustomBaseUrl} from './api-base';

export const api = {
  fetchAccounts: () => base.get({url: '/accounts'}),
  fetchTransactions: () => base.get({url: '/transactions'}),
  fetchBalances: () => base.get({url: '/balances'}),
  transferMoney: (body) => base.post({url: '/transfer', body}),
  userinfo: (authorizationServerURL, tenantId, authorizationServerId) => baseWithCustomBaseUrl('/', authorizationServerURL).get({url: `/${tenantId}/${authorizationServerId}/userinfo`})
};
