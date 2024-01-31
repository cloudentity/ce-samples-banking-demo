const authConfig = {
    domain: 'lovatt-org.us.authz.cloudentity.io', // e.g. 'example.authz.cloudentity.io.' Recommended; always generates URLs with 'https' protocol.
//    domain: 'demo1.us.authz.cloudentity.io', // e.g. 'example.authz.cloudentity.io.' Recommended; always generates URLs with 'https' protocol.
     // baseUrl: optional alternative to 'domain.' Protocol required, e.g. 'https://example.demo.cloudentity.com.'
     // In situations where protocol may dynamically resolve to 'http' rather than 'https' (for example in dev mode), use 'baseUrl' rather than 'domain'.
     tenantId: 'lovatt-org', // If using ACP SaaS, this is generally in the subdomain of your ACP SaaS URL
     //tenantId: 'demo1', // If using ACP SaaS, this is generally in the subdomain of your ACP SaaS URL
     authorizationServerId: 'default', // This is generally the name of the workspace you created the OAuth application in.
     //authorizationServerId: 'demo', // This is generally the name of the workspace you created the OAuth application in.
     clientId: 'ca36a56uufbjuit9dqag', // Find this value by viewing the details of your OAuth application
     //clientId: '96d418eee7354e33b80a6df948c05060', // Find this value by viewing the details of your OAuth application
     redirectUri: 'http://localhost:3000/',
     scopes: ['profile', 'email', 'openid'], // 'revoke_tokens' scope must be present for 'logout' action to revoke token! Without it, token will only be deleted from browser's local storage.
     accessTokenName: 'banking_demo_access_token', // optional; defaults to '{tenantId}_{authorizationServerId}_access_token'
     idTokenName: 'banking_demo_id_token', // optional; defaults to '{tenantId}_{authorizationServerId}_id_token',
     responseType: ['code'],
     letClientSetAccessToken: true
 };

 export default authConfig;
