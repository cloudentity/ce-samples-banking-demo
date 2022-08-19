import {base, baseWithCustomBaseUrl} from './api-base';

export const api = {
  // Admin APIs
  adminFetchUsers: () => base.get({url: '/admin/users'}),
  adminChangeWithdrawalLimit: body => base.post({url: '/admin/change-user-withdrawal-limit', body}),

  // User APIs
  fetchAccounts: () => base.get({url: '/accounts'}),
  fetchTransactions: () => base.get({url: '/accounts/transactions'}),
  fetchBalances: () => base.get({url: '/accounts/balances'}),
  transferMoney: (body, customTokenName) => base.post({url: '/transfer', body, customTokenName}),
  userinfo: (authorizationServerURL, tenantId, authorizationServerId) => baseWithCustomBaseUrl('/', authorizationServerURL).get({url: `/${tenantId}/${authorizationServerId}/userinfo`})
};
